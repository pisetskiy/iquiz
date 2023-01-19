import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  every,
  filter,
  finalize, map,
  Observable,
  of,
  onErrorResumeNext,
  switchMap,
  tap
} from 'rxjs';
import {LoginService} from "../login/login.service";
import {User} from "../domain/user";

@Injectable({
  providedIn: 'root'
})
export class UserService implements CanActivate {

  load = false;
  user$ = new BehaviorSubject<User>({} as User);

  constructor(
    private loginService: LoginService
  ) {
  }

  loadUser() {
    this.loginService.user()
      .subscribe(
        user => this.user$.next(user),
        error => this.user$.next({} as User)
      )
  }

  clearUser() {
    this.user$.next({} as User);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.user$
      .pipe(switchMap(user => of(user.isActive)))
      .pipe(catchError(error => of(false)));
  }

}
