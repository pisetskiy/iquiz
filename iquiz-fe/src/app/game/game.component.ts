import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../service/user.service";
import {GameService} from "../service/game.service";
import {BehaviorSubject, finalize, Subscription, tap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Game} from "../domain/game";
import {AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";
import {ParticipantService} from "../service/participant.service";
import {Participant} from "../domain/participant";
import {Question} from "../domain/question";
import {Answer} from "../domain/answer";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

  private static readonly PARTICIPANT_VALIDATOR = (participants: Participant[]) => {
    return (control: AbstractControl) => {
      let result: ValidationErrors = {};
      let value = control.value;
      if (!value.avatar) {
        result['avatar_required'] = 'Выберите аватар участника.';
      }
      if (!value.username) {
        result['username_required'] = 'Введите псевдоним участника.';
      } else if (value.username.length > 30) {
        result['username_too_long'] = 'Псевдоним не должен превышать 30 символов.';
      } else if (participants.some(p => p.username.toLowerCase() === value.username.toLowerCase() && value.id !== p.id)) {
        result['username_not_unique'] = 'Участник с указанным псевдонимом уже присоединился.';
      }

      return result;
    }
  }

  private static readonly SETTINGS_VALIDATOR = (participants: Participant[]) => {
    return (control: AbstractControl) => {
      let result: ValidationErrors = {};

      if (participants.length === 0) {
        result['participants_missing'] = 'Невозможно начать викторину без участников.';
      }

      return result;
    }
  }

  load: boolean = false;
  code: string = '';
  gameNotFound: boolean = false;
  game: Game | null = null;
  questions: Question[] = [];
  answers: Answer[] = [];
  isGameOwner: boolean = false;
  settingsForm: FormGroup;
  settingValidationErrors: string[] = [];

  isGameParticipant: boolean = false;
  participant?: Participant;
  participantForm: FormGroup;
  participantValidationErrors: string[] = [];

  subscription?: Subscription;

  state: string = '';

  questionNumber: number = 0;
  question?: Question;
  answerForm: FormGroup;
  variantsForms: FormArray;
  answer: Answer | null = null;

  constructor(
    private user: UserService,
    private gameService: GameService,
    private participants: ParticipantService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {
    this.settingsForm = this.fb.group({
      maxParticipantCount: this.fb.control(16),
      questionDisplayTime: this.fb.control(5),
      answerWaitingTime: this.fb.control(5),
    });
    this.participantForm = this.fb.group({
      id: this.fb.control(null),
      username: this.fb.control(null),
      avatar: this.fb.control(null),
    });
    this.variantsForms = this.fb.array([]);
    this.answerForm = this.fb.group({
      question: this.fb.group({
        id: null,
        content: null,
      }),
      variants: this.variantsForms
    });
  }

  ngOnInit(): void {
    this.code = this.route.snapshot.params['code'];
    this.subscribeToEvents();
  }

  ngOnDestroy(): void {
    this.gameService.closeEventSource();
  }

  subscribeToEvents() {
    if (!this.subscription) {
      this.subscription = this.gameService.getGameEvents(this.code)
        .subscribe(
          event => this.processEvent(event),
          error => this.subscribeToEvents()
        );
    }
  }

  changeAvatar() {
    this.participantForm.setValue(
      Object.assign(this.participantForm.value, {avatar: this.getRandomColor2()})
    );
  }

  joinGame() {
    if (this.participantForm.status === 'VALID') {
      this.participantValidationErrors = [];
      let participant = Object.assign({}, this.participantForm.value);
      participant.gameId = this.game?.id;
      this.load = true;
      (participant.id
          ? this.gameService.updateParticipant(this.code, participant.id, participant)
          : this.gameService.addParticipant(this.code, participant)
      )
        .pipe(finalize(() => this.load = false))
        .subscribe(participant => {
          this.participants.setLocalParticipant(this.code, participant)
          this.participant = participant;
        });
    } else {
      this.participantValidationErrors = Object.values(this.participantForm.errors as {});
    }
  }

  startGame() {
    if (this.settingsForm.status === 'VALID') {
      this.settingValidationErrors = [];
      this.load = true;
      let game = {
        state: 'STARTED',
        settings: this.settingsForm.value
      }
      this.gameService.startGame(this.code)
        .pipe(finalize(() => this.load = false))
        .subscribe(() => {})
    } else {
      this.settingValidationErrors = Object.values(this.settingsForm.errors as {});
    }
  }

  nextQuestion() {
    let question = this.questions[this.questionNumber];
    this.load = true;
    this.gameService.showQuestion(this.code, question.id as number)
      .pipe(finalize(() => this.load = false))
      .subscribe(() => {});
  }

  showVariants() {
    this.load = true;
    this.gameService.showVariants(this.code, this.question?.id as number)
      .pipe(finalize(() => this.load = false))
      .subscribe(() => {});
  }

  showAnswers() {
    this.load = true;
    this.gameService.showAnswers(this.code, this.question?.id as number)
      .pipe(finalize(() => this.load = false))
      .subscribe(() => {});
  }

  processEvent(event: any) {
    let message = JSON.parse(event);
    let type = message.messageType;
    let data = JSON.parse(message.data);
    console.log(type);
    console.log(data);
    if (type === 'GET_GAME') {
      this.displayGame(data['game'], data['questions'], data['answers']);
      this.initParticipantForm();
      this.initSettingsForm();
    } else if (type === 'ADD_PARTICIPANT') {
      this.addParticipant(data);
    } else if (type === 'UPDATE_PARTICIPANT') {
      this.updateParticipant(data);
    } else if (type === 'START_GAME') {
      this.displayGame(data['game'], data['questions'], data['answers']);
    } else if (type == 'SHOW_QUESTION') {
      this.state = type;
      this.showQuestion(data);
    } else if (type == 'SHOW_VARIANTS') {
      this.state = type;
    } else if (type == 'ANSWER_QUESTION') {
      this.addAnswer(data);
    } else if (type == 'SHOW_ANSWERS') {
      this.state = type;
    } else if (type == "FINISH_GAME") {
      this.displayGame(data['game'], data['questions'], data['answers']);
    }
  }

  displayGame(game: Game, questions: Question[], answers: Answer[]) {
    this.game = game;
    this.questions = questions;
    this.answers = answers;
    this.isGameOwner = this.game.user.id === this.user.user$.value.id;
    if (game.state === 'FINISHED' || game.state === 'STOPPED') {
      this.gameService.closeEventSource();
    }
  }

  initParticipantForm() {
    // this.participantForm.setValidators(GameComponent.PARTICIPANT_VALIDATOR(this.game?.participants || []));
    let participant = this.participants.getLocalParticipant(this.code)
    this.isGameParticipant = !!this.game && this.game.participants.some(p => p.id === participant?.id);
    if (this.isGameParticipant) {
      this.participant = participant;
    } else {
      this.participants.removeLocalParticipant(this.code);
      this.participant = {
        id: null,
        username: '',
        avatar: this.getRandomColor2()
      }
    }

    this.participantForm.setValue({
      id: this.participant?.id,
      username: this.participant?.username,
      avatar: this.participant?.avatar,
    })
  }

  initSettingsForm() {
    // this.settingsForm.setValidators(GameComponent.SETTINGS_VALIDATOR(this.game?.participants || []));
  }

  addParticipant(participant: Participant) {
    this.game?.participants.splice(0, 0, participant);
  }

  updateParticipant(participant: Participant) {
    if (this.game) {
      let findIndex = this.game.participants?.findIndex(p => p.id === participant.id);
      if (findIndex !== -1) {
        this.game.participants[findIndex] = participant;
      } else {
        this.game?.participants.splice(0, 0, participant);
      }
    }
  }

  showQuestion(question: Question): void {
    this.questionNumber = this.questions.findIndex(q => q.id === question.id);
    const variants = question.variants.map((variant: any) => {
      return {
        id: variant.id,
        content: variant.content,
        checked: false,
        isTrue: variant.isTrue
      }
    });
    this.variantsForms = this.fb.array(variants.map(() => this.fb.group({
      id: null,
      content: null,
      checked: null,
      isTrue: null,
    })));
    this.answerForm.setControl('variants', this.variantsForms);
    this.answerForm.setValue({
      question: {
        id: question.id,
        content: question.content,
      },
      variants: variants,
    });
    this.question = question;
    this.answer = null;
  }

  sendAnswer() {
    this.load = true;
    let answer = {
      gameId: this.game?.id,
      questionId: this.question?.id,
      participantId: this.participant?.id,
      variantId: this.getChosenVariant()
    };
    this.gameService.addAnswer(this.code, this.question?.id as number, answer as Answer)
      .pipe(finalize(() => this.load = false))
      .subscribe(answer => this.answer = answer);
  }

  addAnswer(answer: Answer) {
    if (this.isGameParticipant) {
    }
    if (this.isGameOwner) {
      this.answers.splice(0, 0, answer);
    }
  }

  countQuestionAnswers(question: Question | undefined) {
    return this.answers.filter(a => a.questionId === question?.id).length;
  }

  countQuestionTrueAnswers(question: Question | undefined) {
    return this.answers.filter(a => a.questionId === question?.id && a.isTrue).length;
  }

  isValidVariant(vf: AbstractControl) {
    return this.state === 'SHOW_ANSWERS' && vf.value.isTrue;
  }

  isInvalidVariant(vf: AbstractControl) {
    return this.state === 'SHOW_ANSWERS' && !vf.value.isTrue && vf.value.checked;
  }

  countParticipantTrueAnswers(p: Participant) {
    return this.answers.filter(a => a.participantId === p.id && a.isTrue).length;
  }

  private getChosenVariant() {
    return (this.variantsForms.value as any[])
      .find(v => !!v.checked)?.id;
  }

  private getRandomColor2() {
    var length = 6;
    var chars = '0123456789ABCDEF';
    var hex = '#';
    while (length--) hex += chars[(Math.random() * 16) | 0];
    return hex;
  }

}
