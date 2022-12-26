import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quiz } from '../domain/quiz';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private readonly api = environment.api_prefix + "/quizzes";
  private readonly favorites_api = environment.api_prefix + "/favoritess"

  constructor(private http: HttpClient) { }

  findAll(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(this.api, {withCredentials: true});
  }

  findForEmployee(employeeId: number): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(this.api + `?employeeId=${employeeId}`,{withCredentials: true});
  }

  find(id: number): Observable<Quiz> {
    return this.http.get<Quiz>(this.api + `/${id}`,{withCredentials: true});
  }

  create(quiz: Quiz): Observable<Quiz> {
    return this.http.post<Quiz>(this.api, quiz,{withCredentials: true});
  }

  update(id: number, quiz: Quiz): Observable<Quiz> {
    return this.http.post<Quiz>(this.api + `/${id}`, quiz,{withCredentials: true});
  }

  toFavorites(id: number): Observable<Quiz> {
    return this.http.post<Quiz>(this.api + `/${id}/favorites`, {}, {withCredentials: true});
  }

  fromFavorites(id: number): Observable<Quiz> {
    return this.http.delete<Quiz>(this.api + `/${id}/favorites`, {withCredentials: true});
  }

}
