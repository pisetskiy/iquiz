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
    return this.http.get<Question[]>(this.api + `?quizId=${quizId}`);
  }

  find(id: number): Observable<Question> {
    return this.http.get<Question>(this.api + `/${id}`);
  }

  create(question: Question): Observable<Question> {
    return this.http.post<Question>(this.api, question);
  }

  update(id: number, question: Question): Observable<Question> {
    return this.http.post<Question>(this.api + `/${id}`, question);
  }
}
