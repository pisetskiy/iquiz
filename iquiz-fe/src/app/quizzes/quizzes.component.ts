import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Quiz } from '../domain/quiz';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, combineLatest, finalize, map, Subject } from 'rxjs';
import { QuizService } from '../service/quiz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quizzes',
  templateUrl: './quizzes.component.html',
  styleUrls: ['./quizzes.component.scss']
})
export class QuizzesComponent implements OnInit {

  private static readonly ADD_MODAL_TITLE = 'Добавить тест';
  private static readonly EDIT_MODAL_TITLE = 'Изменить тест';

  private static readonly QUIZ_VALIDATOR: ValidatorFn = (control: AbstractControl) => {
    let result: ValidationErrors = {};
    let value = control.value;
    if (!value.title) {
      result['title_required'] = 'Введите название теста.';
    }
    if (value.title.length > 70) {
      result['title_too_long'] = 'Название теста не должно превышать 70 символов.';
    }
    if (!value.timeLimit) {
      result['time_limit_required'] = 'Введите ограничение по времени.';
    }
    if (value.timeLimit < 10 || 60 < value.timeLimit) {
      result['time_limit_invalid'] = 'Ограничение по времени должно быть в промежутке от 10 до 60 мин.';
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
  filteredQuizzes$ = combineLatest([this.quizzes$, this.query$])
    .pipe(map((data: any[]) => this.filterQuizzesByQuery(data[0], data[1])));

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private service: QuizService,
    private router: Router,
  ) {
    this.quizForm = this.fb.group({
      id: this.fb.control(null),
      title: this.fb.control(''),
      timeLimit: this.fb.control(20),
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

  addQuiz(form: TemplateRef<any>): void {
    this.openQuizForm({
        id: null,
        title: '',
        timeLimit: 20,
      } as Quiz,
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
      this.load = true;
      (quiz.id ? this.service.update(quiz.id, quiz) : this.service.create(quiz))
        .pipe(finalize(() => this.load = false))
        .subscribe(quiz => this.modalRef?.close({toQuestions, id: quiz.id}));
    } else {
      this.validationErrors = Object.values(this.quizForm.errors as {});
    }
  }

  private openQuizForm(quiz: Quiz, modalTitle: string, form: TemplateRef<any>) {
    this.modalTitle = modalTitle;
    this.validationErrors = [];
    this.quizForm.setValue({
      id: quiz.id,
      title: quiz.title,
      timeLimit: quiz.timeLimit
    });
    this.modalRef = this.modalService.open(form);
    this.modalRef.result
      .then(res => {
        res.toQuestions ? this.toQuestions(res.id) : this.loadQuizzes()
      })
      .catch(() => {});
  }

  private filterQuizzesByQuery(quizzes: Quiz[], query: string): Quiz[] {
    if (query) {
      let regexp = new RegExp(query, 'i');
      return quizzes.filter(q => regexp.test(q.title));
    }

    return quizzes;
  }
}
