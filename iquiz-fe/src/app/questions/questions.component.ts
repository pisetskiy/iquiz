import { Component, OnInit, TemplateRef } from '@angular/core';
import { Question } from '../domain/question';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Variant } from '../domain/variant';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
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
    let question = control.value as Question;
    let variants = question.variants;
    if (variants.length < 2) {
      return {'not_enough_variants': 'Вопрос должен содержать минимум 2 варианта ответа.'};
    }
    if (question.type === 'SINGLE' && variants.filter(v => v.isTrue).length !== 1) {
      return {'wrong_true_variants_count': 'Вопрос должен содержать ровно 1 правильный вариант.'};
    }
    if (question.type === 'MULTI' && variants.filter(v => v.isTrue).length < 1) {
      return {'wrong_true_variants_count': 'Вопрос должен содержать минимум 1 правильный вариант.'};
    }
    let map: { [key: string]: boolean } = {};
    for (let variant of variants) {
      if (map[variant.value]) {
        return {'repeated_variants': 'Вопрос не должен содержать повторяющиеся варианты.'};
      }
      map[variant.value] = true;
    }

    return null;
  }

  public readonly questionTypes = [
    {title: 'Один верный ответ', value: 'SINGLE'},
    {title: 'Несколько верных ответов', value: 'MULTI'},
  ];

  load: boolean;
  modalTitle: string;
  validationErrors: string[];
  question: FormGroup;
  variants: FormArray;

  constructor(
    private modal: NgbModal,
    private fb: FormBuilder,
    private service: QuestionService,
  ) {
    this.load = false;
    this.modalTitle = QuestionsComponent.ADD_MODAL_TITLE;
    this.validationErrors = [];
    this.variants = this.fb.array([]);
    this.question = this.fb.group({
      'id': this.fb.control(null),
      'content': this.fb.control('', [Validators.required, Validators.maxLength(500)]),
      'type': this.fb.control('SINGLE', Validators.required),
      'variants': this.variants,
    }, {
      validators: QuestionsComponent.QUESTION_VALIDATOR
    });
  }

  ngOnInit(): void {
  }

  addQuestion(content: TemplateRef<any>): void {
    this.modalTitle = QuestionsComponent.ADD_MODAL_TITLE;
    this.question.setValue({
      id: null,
      content: '',
      type: 'SINGLE',
      variants: []
    } as Question)
    this.modal.open(content);
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
      let question = this.question.value;
      this.load = true;
      this.service.create(question)
        .pipe(finalize(() => this.load = false))
        .subscribe((question) => console.log(question));
    } else {

    }
  }

  private buildVariantForm(variant: Variant): FormGroup {
    return this.fb.group({
      'value': this.fb.control(variant.value || '', [Validators.required, Validators.maxLength(30)]),
      'isTrue': this.fb.control(variant.isTrue || true, Validators.required)
    });
  }

}
