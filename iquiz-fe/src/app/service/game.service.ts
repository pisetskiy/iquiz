import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Question } from '../domain/question';
import { environment } from 'src/environments/environment';
import {Game} from "../domain/game";
import { EventSourcePolyfill } from 'event-source-polyfill';
import {Participant} from "../domain/participant";
import {Answer} from "../domain/answer";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private readonly api = environment.api_prefix + "/games";

  eventSource: EventSourcePolyfill | null = null;

  constructor(private http: HttpClient) { }

  create(game: any): Observable<Game> {
    return this.http.post<Game>(this.api, game, {withCredentials : true});
  }

  update(id: number, question: any): Observable<Game> {
    return this.http.post<Game>(this.api + `/${id}`, question, {withCredentials : true});
  }

  getGameEvents(code: string): Observable<any> {
    return new Observable((observer) => {
      let url = this.api + `/${code}/events`;
      this.eventSource = new EventSourcePolyfill(url, { withCredentials: true });

      this.eventSource.onmessage = (event) => {
        observer.next(event.data);
      };

      this.eventSource.onerror = (error) => {
        observer.error(error);
        this.closeEventSource();
      };
    });
  }

  addParticipant(code: string, participant: Participant) {
    return this.http.post<Participant>(this.api + `/${code}/participants`, participant, {withCredentials : true});
  }

  updateParticipant(code: string, participantId: number, participant: Participant) {
    return this.http.put<Participant>(this.api + `/${code}/participants/${participantId}`, participant, {withCredentials : true});
  }

  startGame(code: string) {
    return this.http.post<void>(this.api + `/${code}/start`, {}, {withCredentials : true});
  }

  showQuestion(code: string, questionId: number) {
    return this.http.post<void>(this.api + `/${code}/questions/${questionId}/showQuestion`, {}, {withCredentials : true});
  }

  showVariants(code: string, questionId: number) {
    return this.http.post<void>(this.api + `/${code}/questions/${questionId}/showVariants`, {}, {withCredentials : true});
  }

  addAnswer(code: string, questionId: number, answer: Answer) {
    return this.http.post<Answer>(this.api + `/${code}/questions/${questionId}/addAnswer`, answer, {withCredentials : true});
  }

  showAnswers(code: string, questionId: number) {
    return this.http.post<void>(this.api + `/${code}/questions/${questionId}/showAnswers`, {}, {withCredentials : true});
  }

  closeEventSource(): void {
    this.eventSource?.close();
  }

}
