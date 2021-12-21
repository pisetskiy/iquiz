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
import { finalize } from 'rxjs';

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

  load: boolean;
  modalTitle: string;
  validationErrors: string[];
  question: FormGroup;
  variants: FormArray;
  modalRef: NgbModalRef | null;
  questions: Question[];

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private service: QuestionService,
  ) {
    this.load = false;
    this.modalTitle = QuestionsComponent.ADD_MODAL_TITLE;
    this.validationErrors = [];
    this.variants = this.fb.array([]);
    this.question = this.fb.group({
      'id': this.fb.control(null),
      'content': this.fb.control(''),
      'type': this.fb.control('SINGLE'),
      'variants': this.variants,
    }, {
      validators: QuestionsComponent.QUESTION_VALIDATOR
    });
    this.modalRef = null;
    this.questions = [];
  }

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.load = true;
    this.service.findAll()
      .pipe(finalize(() => this.load = false))
      .subscribe(questions => this.questions = questions);
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
    this.variants?.push(this.buildVariantForm(variant));
  }

  removeVariant(index: number): void {
    this.variants?.removeAt(index);
  }

  validateAndSave(): void {
    if (this.question.status === 'VALID') {
      this.validationErrors = [];
      let question = this.question.value;
      this.load = true;
      (question.id ? this.service.update(question.id, question) : this.service.create(question))
        .pipe(finalize(() => this.load = false))
        .subscribe(() => this.modalRef?.close('SAVED'));
    } else {
      this.validationErrors = Object.values(this.question.errors as {});
    }
  }

  private openQuestionForm(value: Question, title: string, content: TemplateRef<any>) {
    this.modalTitle = title;
    this.validationErrors = [];
    this.variants = this.fb.array(value.variants.map(variant => this.buildVariantForm(variant)));
    this.question.setControl('variants', this.variants);
    this.question.setValue(value);
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

}
