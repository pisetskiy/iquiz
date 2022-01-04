import { Component } from '@angular/core';
import { UserService } from './service/user.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private readonly links = [
    { title: 'Мои тесты', fragment: 'my' },
    { title: 'Сотрудники', fragment: 'employees', adminOnly: true },
    { title: 'Тесты', fragment: 'quizzes', adminOnly: true },
    { title: 'Должности', fragment: 'positions', adminOnly: true },
  ];

  links$: Observable<any[]>

  constructor(
    private userService: UserService
  ) {
    this.links$ = this.userService.user.pipe(map(user => {
      return this.links.filter(l => !l.adminOnly || user.isAdmin)
    }))
  }
}
