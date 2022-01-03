import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../domain/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private readonly api = environment.api_prefix + '/employees';

  constructor(private http: HttpClient) {
  }

  findAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.api);
  }

  find(id: number): Observable<Employee> {
    return this.http.get<Employee>(this.api + `/${id}`);
  }

  create(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.api, employee);
  }

  update(id: number, employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.api + `/${id}`, employee);
  }
}
