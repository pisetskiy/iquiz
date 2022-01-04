import { Component, OnInit } from '@angular/core';
import { Appointment } from '../domain/appointment';
import { BehaviorSubject, combineLatest, finalize, map } from 'rxjs';
import { AppointmentService } from '../service/appointment.service';

@Component({
  selector: 'app-my',
  templateUrl: './my.component.html',
  styleUrls: ['./my.component.scss']
})
export class MyComponent implements OnInit {

  readonly states = [
    {
      title: 'Назначено',
      value: 'CREATED',
      class: 'btn-light'
    },
    {
      title: 'Начато',
      value: 'STARTED',
      class: 'btn-secondary'
    },
    {
      title: 'Пройдено',
      value: 'PASSED',
      class: 'btn-success'
    },
    {
      title: 'Просрочено',
      value: 'EXPIRED',
      class: 'btn-danger'
    },
  ];
  readonly statesMap: { [key: string]: string } = {
    CREATED: 'Назначено',
    STARTED: 'Начато',
    PASSED: 'Пройдено',
    EXPIRED: 'Просрочено',
  };
  readonly trackByFn = (index: number, appointment: Appointment) => appointment.id;
  readonly hasActions = (a: Appointment) => a.state === 'CREATED' || a.state === 'STARTED'
  readonly isCreated = (a: Appointment) => a.state === 'CREATED'
  readonly isStarted = (a: Appointment) => a.state === 'STARTED'

  load = false;
  appointments$ = new BehaviorSubject<Appointment[]>([]);
  query$ = new BehaviorSubject<string>('');
  state$ = new BehaviorSubject<string>('CREATED');
  filteredAppointments$ = combineLatest([this.appointments$, this.query$, this.state$])
    .pipe(map((data: any[]) => this.filterAppointmentsByQuery(data[0], data[1], data[2])));

  constructor(
    private service: AppointmentService,
  ) { }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.load = true;
    this.service.user()
      .pipe(finalize(() => this.load = false))
      .subscribe(appointments => this.appointments$.next(appointments));
  }

  start(id: number | null): void {

  }

  continue(id: number | null): void {

  }

  private filterAppointmentsByQuery(appointments: Appointment[], query: string, state: string): Appointment[] {
    let result = appointments;
    if (query) {
      const regexp = new RegExp(query, 'i');
      result = result.filter(a => regexp.test(a.quiz?.title || '')
        || regexp.test(a.deadline || ''));
    }
    if (state) {
      result = result.filter(a => a.state === state);
    }
    return result;
  }

}
