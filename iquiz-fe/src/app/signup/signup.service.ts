import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable, of} from "rxjs";
import {SignupRequest} from "./signup-request";
import {SignupResult} from "./signup-result";

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  private readonly api = environment.api_prefix + '/signup';

  constructor(private http: HttpClient) {
  }

  signup(request: SignupRequest): Observable<string> {
    return this.http.post<SignupResult>(this.api, request).pipe(map(response => response.result));
  }

}
