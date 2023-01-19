import {Component} from '@angular/core';
import {UserService} from './service/user.service';
import {map, Observable, tap} from 'rxjs';
import {LoginService} from "./login/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private readonly links = [
    {title: 'Викторины', fragment: 'quizzes', authRequired: false, adminOnly: false},
    {title: 'Пользователи', fragment: 'users', authRequired: true, adminOnly: true},
  ];

  links$: Observable<any[]>;
  name$: Observable<string>;

  constructor(
    private userService: UserService,
    private loginService: LoginService,
    private router: Router
  ) {
    this.userService.loadUser();
    this.links$ = this.userService.user$
      .pipe(map(user => {
        return this.links.filter(l => (!l.authRequired || !!user.id) && (!l.adminOnly || user.role === 'ROLE_ADMIN'))
      }))
    this.name$ = this.userService.user$
      .pipe(map(user => user.username));
  }

  logout(): void {
    this.loginService.logout()
      .pipe(tap( () => this.userService.clearUser()))
      .subscribe(res => this.router.navigateByUrl('/login'));
  }
}
