import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  links = [
    { title: 'Сотрудники', fragment: 'employees'},
    { title: 'Тесты', fragment: 'quizzes'},
    { title: 'Должности', fragment: 'positions'},
  ];

  constructor(public route: ActivatedRoute) {
  }
}
