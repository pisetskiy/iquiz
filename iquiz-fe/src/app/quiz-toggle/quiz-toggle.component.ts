import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-quiz-toggle',
  templateUrl: './quiz-toggle.component.html',
  styleUrls: ['./quiz-toggle.component.scss']
})
export class QuizToggleComponent implements OnInit {

  readonly states = [
    {
      title: 'Все виткорины',
      value: 'all',
      class: 'btn-light'
    },
    {
      title: 'Мои викторины',
      value: 'user',
      class: 'btn-light'
    },
    {
      title: 'Избранные викторины',
      value: 'favorites',
      class: 'btn-light'
    },
  ];
  @Output()
  stateSelect = new EventEmitter<string>()
  model = this.states[0].value;

  constructor() { }

  ngOnInit(): void {
  }

}
