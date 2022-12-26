import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../service/user.service";
import {GameService} from "../service/game.service";
import {BehaviorSubject, finalize, Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Game} from "../domain/game";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {ParticipantService} from "../service/participant.service";
import {Participant} from "../domain/participant";
import {Question} from "../domain/question";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

  load: boolean = false;
  code: string = '';
  game: Game | null = null;
  isGameOwner: boolean = false;
  participant?: Participant;
  settingsForm: FormGroup;
  participantForm: FormGroup;

  subscription?: Subscription;

  state: string = '';
  question?: Question;
  answerForm: FormGroup;
  variantsForms: FormArray;

  constructor(
    private user: UserService,
    private games: GameService,
    private participants: ParticipantService,
    private route: ActivatedRoute,
    private fb:FormBuilder,
  ) {
    this.settingsForm = this.fb.group({
      maxParticipantCount: this.fb.control(16),
      questionDisplayTime: this.fb.control(10),
      answerWaitingTime: this.fb.control(10),
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
    this.games.closeEventSource();
  }

  subscribeToEvents() {
    if (!this.subscription) {
      this.subscription = this.games.getSocketEvents(this.code)
        .subscribe(event => this.processEvent(event));
    }
  }

  displayGame(game: Game) {
    this.game = game;
    this.isGameOwner = this.game.user.id === this.user.user$.value.id;
  }

  displayParticipant() {
    let participant = this.participants.getLocalParticipant(this.code)
    if (this.game && this.game.participants.some(p => p.id === participant?.id)) {
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

  joinGame() {
    let participant = this.participantForm.value;
    participant.gameId = this.game?.id;
    this.load = true;
    this.participants.joinGame(this.code, participant)
      .pipe(finalize(() => this.load = false))
      .subscribe(participant => this.participant = participant);
  }

  startGame() {
    this.load = true;
    let game = {
      state: 'STARTED',
      settings: this.settingsForm.value
    }
    this.games.update(Number.parseInt(this.code), game)
      .pipe(finalize(() => this.load = false))
      .subscribe(game => {})
  }

  processEvent(event: any) {
    let message = JSON.parse(event);
    let type = message.messageType;
    let data = JSON.parse(message.data);
    console.log(type);
    console.log(data);
    if (type === 'GET_GAME') {
      this.displayGame(data as Game);
      this.displayParticipant();
    } else if (type === 'UPDATE_GAME') {
      this.displayGame(data as Game);
      this.displayParticipant();
    } else if (type === 'ADD_PARTICIPANT') {
      this.game?.participants.splice(0, 0, data);
    } else if (type === 'UPDATE_PARTICIPANT') {
      if (this.game) {
        let findIndex = this.game.participants?.findIndex(p => p.id === data.id);
        if (findIndex !== -1) {
          this.game.participants[findIndex] = data;
        } else {
          this.game?.participants.splice(0, 0, data);
        }
      }
    } else if (type == 'SHOW_QUESTION') {
      this.state = type;
      this.showQuestion(data);
    } else if (type == 'WAIT_ANSWER') {
      this.state = type;
    } else if (type == 'SHOW_ANSWER') {
      this.state = type;
      this.sendAnswer();
    }
  }

  private showQuestion(question: Question): void {
    const variants = question.variants.map((variant: any) => {
      return {
        id: variant.id,
        content: variant.content,
        checked: false
      }
    });
    this.variantsForms = this.fb.array(variants.map(() => this.fb.group({
      id: null,
      content: null,
      checked: null,
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
  }

  sendAnswer() {
    this.load = true;
    let answer
  }

  private getRandomColor2() {
    var length = 6;
    var chars = '0123456789ABCDEF';
    var hex = '#';
    while (length--) hex += chars[(Math.random() * 16) | 0];
    return hex;
  }

}
