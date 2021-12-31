import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  links = [
    { title: 'Тесты', fragment: 'quizzes'},
    { title: 'Сотрудники', fragment: 'employees'},
    { title: 'Должности', fragment: 'positions'},
  ];

  constructor(public route: ActivatedRoute) {
  }
}
