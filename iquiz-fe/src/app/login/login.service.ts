import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {catchError, map, Observable, of, onErrorResumeNext, switchMap} from "rxjs";
import {LoginRequest} from "./login-request";
import {User} from "../domain/user";
import {ApiInterceptorService} from "../api-interceptor.service";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly loginUrl = environment.server + '/login';
  private readonly logoutUrl = environment.server + '/logout';
  private readonly user_url = environment.api_prefix + '/user';

  constructor(private http: HttpClient, private apiInterceptor: ApiInterceptorService) {
  }

  login(request: LoginRequest): Observable<string> {
    let body = new URLSearchParams();
    body.set('username', request.email);
    body.set('password', request.password);
    return this.http.post(this.loginUrl, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
      withCredentials: true
    })
      .pipe(switchMap(() => this.user()))
      .pipe(map(user => {
        let result: string = 'ok'
        if (!user.isActive) {
          result = 'accountNotActive'
        }
        return result;
      }))
      .pipe(catchError(err => of('passwordInvalid')));
  }

  user(): Observable<User> {
    return this.http.get<User>(this.user_url, {
      withCredentials: true
    });
  }

  logout(): Observable<void> {
    return this.http.post<void>(this.logoutUrl, {}, {
      withCredentials: true
    });
  }
}
