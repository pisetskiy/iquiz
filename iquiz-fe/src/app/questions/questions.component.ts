import { Component, OnInit, TemplateRef } from '@angular/core';
import { Question } from '../domain/question';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Variant } from '../domain/variant';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { QuestionService } from '../service/question.service';
import { BehaviorSubject, combineLatest, finalize, map, Subject } from 'rxjs';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {

  private static readonly ADD_MODAL_TITLE = 'Добавить вопрос';
  private static readonly EDIT_MODAL_TITLE = 'Изменить вопрос';

  private static readonly QUESTION_VALIDATOR: ValidatorFn = (control: AbstractControl) => {
    let result = {} as ValidationErrors;
    let question = control.value as Question;
    if (!question.content) {
      result['content_required'] = 'Необходимо ввести описание задания.'
    }
    if(question.content.length > 500) {
      result['content_too_long'] = 'Описание задания не должно превышать 500 символов.'
    }
    let variants = question.variants;
    if (variants.length < 2) {
      result['not_enough_variants'] = 'Вопрос должен содержать минимум 2 варианта ответа.';
    }
    if (question.type === 'SINGLE' && variants.filter(v => v.isTrue).length !== 1) {
      result['wrong_true_variants_count'] = 'Вопрос должен содержать ровно 1 правильный вариант.';
    }
    if (question.type === 'MULTI' && variants.filter(v => v.isTrue).length < 1) {
      result['wrong_true_variants_count'] = 'Вопрос должен содержать минимум 1 правильный вариант.';
    }
    let map: { [key: string]: boolean } = {};
    for (let variant of variants) {
      if(!variant.value) {
        result['variant_value_required'] = 'Необходимо ввести вариант ответа.';
      }
      if (variant.value.length > 30) {
        result['variant_too_long'] = 'Описание варианта ответа не должно превышать 30 символов.';
      }
      if (map[variant.value]) {
        result['repeated_variants'] = 'Вопрос не должен содержать повторяющиеся варианты.';
      }
      map[variant.value] = true;
    }

    return result;
  }

  public readonly questionTypes = [
    {title: 'Один верный ответ', value: 'SINGLE'},
    {title: 'Несколько верных ответов', value: 'MULTI'},
  ];

  public readonly trackByFn = (index: number, question: Question) => question.id;

  load: boolean = false;
  modalTitle: string = QuestionsComponent.ADD_MODAL_TITLE;
  validationErrors: string[] = [];
  modalRef: NgbModalRef | null = null;
  questionForm: FormGroup;
  variantsForms: FormArray;

  questions$: Subject<Question[]> = new BehaviorSubject<Question[]>([]);
  query$: Subject<string> = new BehaviorSubject<string>('');
  filteredQuestions$ = combineLatest([this.questions$, this.query$])
    .pipe(map((data: any[]) => this.filterQuestionsByQuery(data[0], data[1])));

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private service: QuestionService,
  ) {
    this.variantsForms = this.fb.array([]);
    this.questionForm = this.fb.group({
      'id': this.fb.control(null),
      'content': this.fb.control(''),
      'type': this.fb.control('SINGLE'),
      'variants': this.variantsForms,
    }, {
      validators: QuestionsComponent.QUESTION_VALIDATOR
    });
  }

  ngOnInit(): void {
    this.loadQuestions();
  }

  filterQuestions(query: string) {
    this.query$.next(query);
  }

  loadQuestions(): void {
    this.load = true;
    this.service.findAll()
      .pipe(finalize(() => this.load = false))
      .subscribe(questions => this.questions$.next(questions));
  }

  addQuestion(content: TemplateRef<any>): void {
    this.openQuestionForm(
      {
        id: null,
        content: '',
        type: 'SINGLE',
        variants: []
      } as Question,
      QuestionsComponent.ADD_MODAL_TITLE,
      content
    );
  }

  updateQuestion(id: number | null, content: TemplateRef<any>): void {
    this.load = true;
    this.service.find(id as number)
      .pipe(finalize(() => this.load = false))
      .subscribe(question => this.openQuestionForm(question, QuestionsComponent.EDIT_MODAL_TITLE, content));
  }

  addVariant(): void {
    let variant = {} as Variant;
    this.variantsForms?.push(this.buildVariantForm(variant));
  }

  removeVariant(index: number): void {
    this.variantsForms?.removeAt(index);
  }

  validateAndSave(): void {
    if (this.questionForm.status === 'VALID') {
      this.validationErrors = [];
      let question = this.questionForm.value;
      this.load = true;
      (question.id ? this.service.update(question.id, question) : this.service.create(question))
        .pipe(finalize(() => this.load = false))
        .subscribe(() => this.modalRef?.close('SAVED'));
    } else {
      this.validationErrors = Object.values(this.questionForm.errors as {});
    }
  }

  private openQuestionForm(value: Question, title: string, content: TemplateRef<any>) {
    this.modalTitle = title;
    this.validationErrors = [];
    this.variantsForms = this.fb.array(value.variants.map(variant => this.buildVariantForm(variant)));
    this.questionForm.setControl('variants', this.variantsForms);
    this.questionForm.setValue(value);
    this.modalRef = this.modalService.open(content);
    this.modalRef.result.then(() => this.loadQuestions(), () => {});
  }

  private buildVariantForm(variant: Variant): FormGroup {
    return this.fb.group({
      'id': this.fb.control(variant.id || null),
      'value': this.fb.control(variant.value || ''),
      'isTrue': this.fb.control(variant.isTrue || true)
    });
  }

  private filterQuestionsByQuery(questions: Question[], query: string): Question[] {
    if (query) {
      let regexp = new RegExp(query, 'i');
      return questions.filter(q => regexp.test(q.content));
    }

    return questions;
  }

}
