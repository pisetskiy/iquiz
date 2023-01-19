import {Component, OnInit, TemplateRef} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {Quiz} from '../domain/quiz';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {BehaviorSubject, combineLatest, finalize, map, Subject} from 'rxjs';
import {QuizService} from '../service/quiz.service';
import {Router} from '@angular/router';
import {UserService} from "../service/user.service";
import {User} from "../domain/user";
import {GameService} from "../service/game.service";
import {ParticipantService} from "../service/participant.service";

@Component({
  selector: 'app-quizzes',
  templateUrl: './quizzes.component.html',
  styleUrls: ['./quizzes.component.scss']
})
export class QuizzesComponent implements OnInit {

  private static readonly ADD_MODAL_TITLE = 'Добавить викторину';
  private static readonly EDIT_MODAL_TITLE = 'Изменить викторину';

  private static readonly QUIZ_VALIDATOR: ValidatorFn = (control: AbstractControl) => {
    let result: ValidationErrors = {};
    let value = control.value;
    if (!value.title) {
      result['title_required'] = 'Введите название викторины.';
    }
    if (value.title.length > 70) {
      result['title_too_long'] = 'Название викторины не должно превышать 70 символов.';
    }

    if (value.description) {
      if (value.description.length > 250) {
        result['description_too_long'] = 'Описание викторины не должно превышать 250 символов.';
      }
    }

    if (value.bannerFile) {

    }

    return result;
  }

  public readonly trackByFn = (index: number, quiz: Quiz) => quiz.id;

  load: boolean = false;
  modalTitle: string = QuizzesComponent.ADD_MODAL_TITLE;
  validationErrors: string[] = [];
  modalRef?: NgbModalRef;
  quizForm: FormGroup;

  quizzes$: Subject<Quiz[]> = new BehaviorSubject<Quiz[]>([]);
  query$: Subject<string> = new BehaviorSubject<string>('');
  state$ = new BehaviorSubject<string>('all');
  hasUser$ = this.user.user$.pipe(map(user => !!user.id));
  filteredQuizzes$ = combineLatest([this.quizzes$, this.query$, this.state$, this.user.user$])
    .pipe(map((data: any[]) => this.filterQuizzesByQuery(data[0], data[1], data[2], data[3])));

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private service: QuizService,
    private router: Router,
    private user: UserService,
    private games: GameService,
    private participants: ParticipantService,
  ) {
    this.quizForm = this.fb.group({
      id: this.fb.control(null),
      title: this.fb.control(''),
      description: this.fb.control(''),
      bannerFile: this.fb.control(''),
      isActive: this.fb.control(''),
      isPublic: this.fb.control(''),
    }, {
      validators: QuizzesComponent.QUIZ_VALIDATOR
    })
  }

  ngOnInit(): void {
    this.loadQuizzes();
  }

  toQuestions(id: number | null): void {
    this.router.navigateByUrl(`/quizzes/${id}/questions`)
  }

  loadQuizzes(): void {
    this.load = true;
    this.service.findAll()
      .pipe(finalize(() => this.load = false))
      .subscribe(quizzes => this.quizzes$.next(quizzes));
  }

  filterQuizzes(query: string): void {
    this.query$.next(query);
  }

  startQuiz(quiz: Quiz): void {
    if (!this.user.user$.value.id) {
      this.redirectToLogin();
      return;
    }
    this.load = true;
    this.games.create({
      quizId: quiz.id
    })
      .pipe(finalize(() => this.load = false))
      .subscribe(game => {
        this.participants.joinGame(
          game.code,
          {
            username: this.user.user$.value.username,
            avatar: this.getRandomColor2()
          })
        this.router.navigateByUrl(`/game/${game.code}`);
      })
  }

  private getRandomColor2() {
    var length = 6;
    var chars = '0123456789ABCDEF';
    var hex = '#';
    while (length--) hex += chars[(Math.random() * 16) | 0];
    return hex;
  }

  addQuiz(form: TemplateRef<any>): void {
    if (!this.user.user$.value.id) {
      this.redirectToLogin();
      return;
    }
    this.openQuizForm({
        id: null,
        title: '',
        description: null,
        bannerFile: null,
        isActive: true,
        isPublic: false,
      } as unknown as Quiz,
      QuizzesComponent.ADD_MODAL_TITLE,
      form
    );
  }

  updateQuiz(id: number | null, form: TemplateRef<any>): void {
    this.load = true;
    this.service.find(id as number)
      .pipe(finalize(() => this.load = false))
      .subscribe(quiz => this.openQuizForm(quiz, QuizzesComponent.EDIT_MODAL_TITLE, form));
  }

  validateAndSave(toQuestions: boolean = false): void {
    if (this.quizForm.status === 'VALID') {
      this.validationErrors = [];
      let quiz = this.quizForm.value;
      console.log(quiz);
      this.load = true;
      (quiz.id ? this.service.update(quiz.id, quiz) : this.service.create(quiz))
        .pipe(finalize(() => this.load = false))
        .subscribe(quiz => this.modalRef?.close({toQuestions, id: quiz.id}));
    } else {
      this.validationErrors = Object.values(this.quizForm.errors as {});
    }
  }

  openQuizForm(quiz: Quiz, modalTitle: string, form: TemplateRef<any>) {
    this.modalTitle = modalTitle;
    this.validationErrors = [];
    this.quizForm.setValue({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      bannerFile: quiz.bannerFile,
      isActive: quiz.isActive,
      isPublic: quiz.isPublic,
    });
    this.modalRef = this.modalService.open(form);
    this.modalRef.result
      .then(res => {
        res.toQuestions ? this.toQuestions(res.id) : this.loadQuizzes()
      })
      .catch(() => {
      });
  }

  filterQuizzesByQuery(quizzes: Quiz[], query: string, state: string, user: User): Quiz[] {
    if (query) {
      let regexp = new RegExp(query, 'i');
      quizzes = quizzes.filter(q => regexp.test(q.title));
    }
    if (state === 'all') {
      quizzes = quizzes.filter(q => this.isActiveAndPublic(q) || this.isUserQuiz(q, user))
    }
    if (state === 'user') {
      quizzes = quizzes.filter(q => this.isUserQuiz(q, user));
    }
    if (state === 'favorites') {
      quizzes = quizzes.filter(q => this.isActiveAndPublic(q) || this.isUserQuiz(q, user))
      quizzes = quizzes.filter(q => q.isFavorite);
    }

    return quizzes;
  }

  isUserQuiz(quiz: Quiz, user: User | null): boolean {
    if (!user) {
      user = this.user.user$.value;
    }
    return quiz.user.id === user.id;
  }

  isActiveAndPublic(quiz: Quiz): boolean {
    return quiz.isPublic && quiz.isActive;
  }

  isActive(quiz: Quiz): boolean {
    return quiz.isActive
  }

  toFavorites(quiz: Quiz) {
    if (!this.user.user$.value.id) {
      this.redirectToLogin();
      return;
    }
    this.load = true;
    this.service.toFavorites(quiz.id as number)
      .pipe(finalize(() => this.load = false))
      .subscribe(result => quiz.isFavorite = result.isFavorite);
  }

  fromFavorites(quiz: Quiz) {
    this.load = true;
    this.service.fromFavorites(quiz.id as number)
      .pipe(finalize(() => this.load = false))
      .subscribe(result => quiz.isFavorite = result.isFavorite);
  }

  redirectToLogin() {
    this.router.navigateByUrl("/login");
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {

      const file = event.target.files[0];

      console.log(file);

    }
  }
}
