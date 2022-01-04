import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, filter, finalize, Observable, of, switchMap } from 'rxjs';
import { EmployeeService } from './employee.service';
import { Employee } from '../domain/employee';

@Injectable({
  providedIn: 'root'
})
export class UserService implements CanActivate {

  load = false;
  user$ = new BehaviorSubject<Employee>({} as Employee);

  constructor(
    private service: EmployeeService
  ) {}

  get user() {
    return this._user();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this._user().pipe(switchMap(user => of(user.isAdmin)));
  }

  private _user(): Observable<Employee> {
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
