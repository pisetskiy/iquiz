import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-appointment-states-radio',
  templateUrl: './appointment-states-radio.component.html',
})
export class AppointmentStatesRadioComponent {

  readonly states = [
    {
      title: 'Назначено',
      value: 'CREATED',
      class: 'btn-light'
    },
    {
      title: 'Начато',
      value: 'STARTED',
      class: 'btn-secondary'
    },
    {
      title: 'Пройдено',
      value: 'PASSED',
      class: 'btn-success'
    },
    {
      title: 'Просрочено',
      value: 'EXPIRED',
      class: 'btn-danger'
    },
  ];
  @Output()
  stateSelect = new EventEmitter<string>()
  model = this.states[0].value;

  constructor() { }
}
