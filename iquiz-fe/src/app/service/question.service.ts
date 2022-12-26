import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Question } from '../domain/question';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private readonly api = environment.api_prefix + "/questions";

  constructor(private http: HttpClient) { }

  findAll(quizId: number): Observable<Question[]> {
    return this.http.get<Question[]>(this.api + `?quizId=${quizId}`, {withCredentials : true});
  }

  find(id: number): Observable<Question> {
    return this.http.get<Question>(this.api + `/${id}`, {withCredentials : true});
  }

  create(question: Question): Observable<Question> {
    return this.http.post<Question>(this.api, question, {withCredentials : true});
  }

  update(id: number, question: Question): Observable<Question> {
    return this.http.post<Question>(this.api + `/${id}`, question, {withCredentials : true});
  }
}
