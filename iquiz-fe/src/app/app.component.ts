import { Component } from '@angular/core';
import { UserService } from './service/user.service';
import { map, Observable } from 'rxjs';
import {LoginService} from "./login/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private readonly links = [
    { title: 'Викторины', fragment: 'quizzes' },
    { title: 'Пользователи', fragment: 'users', adminOnly: true },
  ];

  links$: Observable<any[]>;
  name$: Observable<string>;

  constructor(
    private userService: UserService,
    private loginService: LoginService,
    private router: Router
  ) {
    this.links$ = this.userService.user.pipe(map(user => {
      return this.links.filter(l => !l.adminOnly || user.role === 'ROLE_ADMIN')
    }))
    this.name$ = this.userService.user.pipe(map(user => {
      return `${user.username}`
    }))
  }

  logout(): void {
    this.loginService.logout().subscribe(res => this.router.navigateByUrl('/login'));
  }
}
