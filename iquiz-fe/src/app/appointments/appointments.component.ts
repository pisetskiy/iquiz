import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../service/employee.service';
import { Employee } from '../domain/employee';
import { BehaviorSubject, combineLatest, finalize, map } from 'rxjs';
import { Quiz } from '../domain/quiz';
import { QuizService } from '../service/quiz.service';
import { AppointmentService } from '../service/appointment.service';
import { Appointment } from '../domain/appointment';
import { NgbDate, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
})
export class AppointmentsComponent implements OnInit {

  private static readonly ADD_MODAL_TITLE = 'Провести тестирование';

  private static readonly IS_DUPLICATE = (appointment: Appointment, id: number | null, quiz: number) => {
    if (id && appointment.id === id) return false;
    return appointment.quiz?.id === quiz
      && appointment.state !== 'PASSED'
      && appointment.state !== 'EXPIRED'
  }

  private static readonly APPOINTMENT_VALIDATOR: ((appointments: Appointment[]) => ValidatorFn) =
    (appointments: Appointment[]) => {
      return (control: AbstractControl) => {
        let result = {} as ValidationErrors;
        let appointment = control.value;
        if (!appointment.quiz) {
          result['quiz_required'] = 'Необходимо выбрать тест.'
        } else if (appointments.some(a => AppointmentsComponent.IS_DUPLICATE(a, appointment.id, appointment.quiz))) {
          result['quiz_duplicated'] = 'Выбранный тест уже назначен для сдачи.'
        }

        if (!appointment.deadline) {
          result['deadline_required'] = 'Необходимо указать срок сдачи';
        }

        return result;
      }
    }


  readonly states: { [key: string]: string } = {
    CREATED: 'Назначено',
    STARTED: 'Начато',
    PASSED: 'Пройдено',
    EXPIRED: 'Просрочено',
  };
  readonly trackByFn = (index: number, appointment: Appointment) => appointment.id;
  readonly isEditable = (appointment: Appointment) => appointment.state === 'CREATED';

  load = false;

  employeeId?: number;
  employee?: Employee;
  quizzes: Quiz[] = [];
  minDate: NgbDate = new NgbDate(0, 1, 1);
  maxDate: NgbDate = new NgbDate(9999, 1, 1);

  appointments: Appointment[] = [];
  appointments$ = new BehaviorSubject<Appointment[]>([]);
  query$ = new BehaviorSubject<string>('');
  state$ = new BehaviorSubject<string>('CREATED');
  filteredAppointments$ = combineLatest([this.appointments$, this.query$, this.state$])
    .pipe(map((data: any[]) => this.filterAppointmentsByQuery(data[0], data[1], data[2])));

  @ViewChild('appointment_form', {static: true})
  formTemplate?: TemplateRef<any>;
  modalRef?: NgbModalRef;
  modalTitle?: string;
  validationErrors: string[] = [];

  appointmentForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private quizService: QuizService,
    private service: AppointmentService,
    private modal: NgbModal,
    private fb: FormBuilder,
  ) {
    this.appointmentForm = this.fb.group({
      id: this.fb.control(null),
      employee: this.fb.control(null),
      quiz: this.fb.control(null),
      deadline: this.fb.control(null),
    })
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.params['employeeId'];
    this.employeeService.find(this.employeeId as number)
      .subscribe(employee => this.employee = employee);
    this.quizService.findForEmployee(this.employeeId as number)
      .subscribe(quizzes => this.quizzes = quizzes.filter(q => q.questionsCount > 0));

    this.loadAppointments();
  }

  loadAppointments(): void {
    this.load = true;
    this.service.findAll(this.employeeId as number)
      .pipe(finalize(() => this.load = false))
      .subscribe(appointments => {
        this.appointments = appointments;
        this.appointments$.next(appointments)
      });
  }

  addAppointment(): void {
    this.openAppointmentForm({id: null, employee: this.employee}, AppointmentsComponent.ADD_MODAL_TITLE);
  }

  editAppointment(id: number | null) {
    this.load = true;
    this.service.find(id as number)
      .pipe(finalize(() => this.load = false))
      .subscribe(appointment => {
        this.openAppointmentForm(appointment, AppointmentsComponent.ADD_MODAL_TITLE)
      });
  }

  validateAndSave(): void {
    if (this.appointmentForm.valid) {
      this.validationErrors = [];
      let value = this.appointmentForm.value;
      this.load = true;
      (value.id ? this.service.update(value.id, value) : this.service.create(value))
        .pipe(finalize(() => this.load = false))
        .subscribe(() => this.modalRef?.close('SAVED'));
    } else {
      this.validationErrors = Object.values(this.appointmentForm.errors as {});
    }
  }

  private openAppointmentForm(appointment: Appointment, title: string) {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    this.minDate = new NgbDate(minDate.getFullYear(), minDate.getMonth() + 1, minDate.getDate())

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    this.maxDate = new NgbDate(maxDate.getFullYear(), maxDate.getMonth() + 1, maxDate.getDate())

    this.modalTitle = title;
    this.validationErrors = [];
    this.appointmentForm.setValue({
      id: appointment.id || null,
      employee: appointment.employee?.id || null,
      quiz: appointment.quiz?.id || null,
      deadline: appointment.deadline || null,
    });
    this.appointmentForm.setValidators(AppointmentsComponent.APPOINTMENT_VALIDATOR(this.appointments));
    this.modalRef = this.modal.open(this.formTemplate);
    this.modalRef.result.then(() => this.loadAppointments(), () => {
    });
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
