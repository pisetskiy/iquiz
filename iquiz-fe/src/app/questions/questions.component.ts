import { Component, OnInit, TemplateRef } from '@angular/core';
import { Question } from '../domain/question';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Variant } from '../domain/variant';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {

  public readonly questionTypes = [
    { title: 'Один верный ответ', value: 'SINGLE' },
    { title: 'Несколько верных ответов', value: 'MULTI' },
  ];

  modalTitle: string = '';
  selectedQuestion: Question | null = null;

  constructor(private modal: NgbModal) { }

  ngOnInit(): void {
  }

  addQuestion(content: TemplateRef<any>): void {
    this.selectedQuestion = {} as Question;
    this.modalTitle = 'Добавить вопрос';
    this.modal.open(content);
  }

  addVariant(): void {
    if (this.selectedQuestion) {
      this.selectedQuestion.variants = [...(this.selectedQuestion?.variants || []), {} as Variant];
    }
  }

  removeVariant(index: number): void {
    if (this.selectedQuestion?.variants) {
      this.selectedQuestion.variants.splice(index, 1);
      this.selectedQuestion.variants = [...this.selectedQuestion.variants];
    }
  }

}
