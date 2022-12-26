import { Injectable } from '@angular/core';
import {Participant} from "../domain/participant";
import {map, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {

  private readonly api = environment.api_prefix + '/games';

  constructor(
    private http: HttpClient,
  ) { }

  getLocalParticipant(gameCode: string): Participant {
    let json = localStorage.getItem(`participant:${gameCode}`);
    if (json) {
      return JSON.parse(json) as unknown as Participant;
    }
    return null as unknown as Participant;
  }

  setLocalParticipant(gameCode: string, participant: Participant) {
    let json = JSON.stringify(participant);
    localStorage.setItem(`participant:${gameCode}`, json);
  }

  removeLocalParticipant(gameCode: string) {
    localStorage.removeItem(`participant:${gameCode}`);
  }

  joinGame(gameCode: string, participant: any): Observable<Participant> {
    if (participant.id) {
      return this.http.post<Participant>(this.api + `/${gameCode}/participants/${participant.id}`, participant, {withCredentials: true})
        .pipe(map(p => {
          this.setLocalParticipant(gameCode, p)
          return p;
        }));
    } else {
      return this.http.post<Participant>(this.api + `/${gameCode}/participants`, participant, {withCredentials: true})
        .pipe(map(p => {
          this.setLocalParticipant(gameCode, p)
          return p;
        }));
    }

  }

}
