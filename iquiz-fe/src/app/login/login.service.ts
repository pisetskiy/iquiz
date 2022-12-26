import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map, Observable, of, onErrorResumeNext} from "rxjs";
import {LoginRequest} from "./login-request";
import {User} from "../domain/user";
import {ApiInterceptorService} from "../api-interceptor.service";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly loginUrl = environment.api_prefix + '/login';
  private readonly logoutUrl = environment.server + '/logout'

  constructor(private http: HttpClient, private apiInterceptor: ApiInterceptorService) {
  }

  login(request: LoginRequest): Observable<string> {
    return this.http.get<User>(this.loginUrl, {
      headers: new HttpHeaders({
        "Authorization": 'Basic ' + btoa(request.email + ':' + request.password)
      })
    })
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
    return this.http.get<User>(this.loginUrl, {
      withCredentials: true
    });
  }

  logout(): Observable<void> {
    return this.http.get<void>(this.logoutUrl, {
      withCredentials: true
    });
  }
}
