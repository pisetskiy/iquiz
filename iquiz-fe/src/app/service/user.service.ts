import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, filter, finalize, Observable, of, switchMap } from 'rxjs';
import {LoginService} from "../login/login.service";
import {User} from "../domain/user";

@Injectable({
  providedIn: 'root'
})
export class UserService implements CanActivate {

  load = false;
  user$ = new BehaviorSubject<User>({} as User);

  constructor(
    private service: LoginService
  ) {}

  get user() {
    return this._user();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this._user().pipe(switchMap(user => of(user.isActive)));
    return of(false);
  }

  private _user(): Observable<User> {
    if (!this.user$.value.id && !this.load) {
      this.load = true
      this.service.user()
        .pipe(finalize(() => this.load = false))
        .subscribe(user => this.user$.next(user))
    }
    return this.user$.pipe(
      filter(user => !!user.id),
    );
  }

}
