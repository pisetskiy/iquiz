import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Question } from '../domain/question';
import { environment } from 'src/environments/environment';
import {Game} from "../domain/game";
import { EventSourcePolyfill } from 'event-source-polyfill';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private readonly api = environment.api_prefix + "/games";

  eventSource: EventSourcePolyfill | null = null;

  constructor(private http: HttpClient) { }

  findAll(quizId: number): Observable<Game[]> {
    return this.http.get<Game[]>(this.api, {withCredentials : true});
  }

  find(id: number): Observable<Game> {
    return this.http.get<Game>(this.api + `/${id}`, {withCredentials : true});
  }

  create(game: any): Observable<Game> {
    return this.http.post<Game>(this.api, game, {withCredentials : true});
  }

  update(id: number, question: any): Observable<Game> {
    return this.http.post<Game>(this.api + `/${id}`, question, {withCredentials : true});
  }

  getSocketEvents(gameCode: string): Observable<any> {
    return new Observable((observer) => {
      let url = this.api + `/${gameCode}/events`;
      this.eventSource = new EventSourcePolyfill(url, { withCredentials: true });

      this.eventSource.onmessage = (event) => {
        observer.next(event.data);
      };

      this.eventSource.onerror = (error) => {
        this.closeEventSource();
      };
    });
  }

  closeEventSource(): void {
    this.eventSource?.close();
  }

}
