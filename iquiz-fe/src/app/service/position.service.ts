import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Position } from '../domain/position';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  private readonly api = environment.api_prefix + '/positions';

  constructor(private http: HttpClient) {
  }

  findAll(): Observable<Position[]> {
    return this.http.get<Position[]>(this.api);
  }

  find(id: number): Observable<Position> {
    return this.http.get<Position>(this.api + `/${id}`);
  }

  create(position: Position): Observable<Position> {
    return this.http.post<Position>(this.api, position);
  }

  update(id: number, position: Position): Observable<Position> {
    return this.http.post<Position>(this.api + `/${id}`, position);
  }
}
