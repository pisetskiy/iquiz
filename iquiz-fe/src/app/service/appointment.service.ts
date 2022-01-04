import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../domain/appointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private readonly api = environment.api_prefix + '/appointments';
  private readonly user_api = environment.api_prefix + '/user/appointments';

  constructor(private http: HttpClient) {
  }

  findAll(employeeId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.api + `?employeeId=${employeeId}`);
  }

  find(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(this.api + `/${id}`);
  }

  create(appointment: any): Observable<Appointment> {
    return this.http.post<Appointment>(this.api, appointment);
  }

  update(id: number, appointment: any): Observable<Appointment> {
    return this.http.post<Appointment>(this.api + `/${id}`, appointment);
  }

  user(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.user_api);
  }
}
