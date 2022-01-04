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

  constructor(private http: HttpClient) { }

  findAll(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(this.api);
  }

  findForEmployee(employeeId: number): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(this.api + `?employeeId=${employeeId}`);
  }

  find(id: number): Observable<Quiz> {
    return this.http.get<Quiz>(this.api + `/${id}`);
  }

  create(quiz: Quiz): Observable<Quiz> {
    return this.http.post<Quiz>(this.api, quiz);
  }

  update(id: number, quiz: Quiz): Observable<Quiz> {
    return this.http.post<Quiz>(this.api + `/${id}`, quiz);
  }

}
