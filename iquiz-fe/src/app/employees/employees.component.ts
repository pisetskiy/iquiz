import { Component, OnInit, TemplateRef } from '@angular/core';
import { EmployeeService } from '../service/employee.service';
import { Employee } from '../domain/employee';
import { BehaviorSubject, combineLatest, finalize, map, Subject } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Position } from '../domain/position';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';
import { PositionService } from '../service/position.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

  private static readonly ADD_MODAL_TITLE = 'Добавить сотрудника';
  private static readonly EDIT_MODAL_TITLE = 'Изменить данные сотрудника';

  private static readonly VALIDATOR = (control: AbstractControl): ValidationErrors => {
    const result = {} as ValidationErrors;
    const value = control.value;
    if (!value.lastName) {
      result['lastname_required'] = 'Необходимо ввести фамилию.';
    } else if (value.lastName.length > 30) {
      result['lastname_too_long']= 'Фамилия не должна быть длиннее 30 символов.';
    }

    if (!value.firstName) {
      result['firstname_required'] = 'Необходимо ввести имя.';
    } else if (value.firstName.length > 30) {
      result['firstname_too_long']= 'Имя не должно быть длиннее 30 символов.';
    }

    if (!value.middleName) {
      result['middleName_required'] = 'Необходимо ввести отчество.';
    } else if (value.middleName.length > 30) {
      result['middleName_too_long']= 'Отчество не должно быть длиннее 30 символов.';
    }

    if (!value.email) {
      result['email_required'] = 'Необходимо ввести почту.';
    } else if (value.email.length > 60) {
      result['email_too_long']= 'Почта не должна быть длиннее 60 символов.';
    }

    if (!value.position) {
      result['position_required'] = 'Необходимо указать должность.';
    }

    return result;
  }

  public readonly trackByFn = (index: number, employee: Employee) => employee.id;

  load: boolean = false;
  modalTitle: string = '';
  modalRef?: NgbModalRef;

  employeeForm: FormGroup;
  validationErrors: string[] = [];
  positions: Position[] = [];

  employees$: Subject<Employee[]> = new BehaviorSubject<Employee[]>([]);
  query$: Subject<string> = new BehaviorSubject<string>('');
  filteredEmployees$ = combineLatest([this.employees$, this.query$])
    .pipe(map((data: any[]) => this.filterEmployeesByQuery(data[0], data[1])));

  constructor(
    private service: EmployeeService,
    private positionService: PositionService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.employeeForm = this.fb.group({
      id: this.fb.control(null),
      lastName: this.fb.control(null),
      firstName: this.fb.control(null),
      middleName: this.fb.control(null),
      email: this.fb.control(null),
      position: this.fb.control(null),
      isAdmin: this.fb.control(false)
    }, {
      validators: EmployeesComponent.VALIDATOR
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
    this.positionService.findAll()
      .subscribe(positions => this.positions = positions);
  }

  loadEmployees(): void {
    this.load = true;
    this.service.findAll()
      .pipe(finalize(() => this.load = false))
      .subscribe(employees => this.employees$.next(employees))
  }

  toAppointments(id: number | null): void {
    this.router.navigateByUrl(`/employees/${id}/appointments`)
  }

  addEmployee(form: TemplateRef<any>): void {
    this.openEmployeeForm({
      id: null,
      lastName: '',
      firstName: '',
      middleName: '',
      email: '',
      isAdmin: false,
      appointments: 0,
      position: {
        id: null,
        title: '',
        quizzesCount: 0,
        quizzes: []
      }
    }, EmployeesComponent.ADD_MODAL_TITLE, form);
  }

  editEmployee(id: number | null, form: TemplateRef<any>): void {
    this.load = true;
    this.service.find(id as number)
      .pipe(finalize(() => this.load = false))
      .subscribe(e => this.openEmployeeForm(e, EmployeesComponent.EDIT_MODAL_TITLE, form))
  }

  validateAndSave(): void {
    if (this.employeeForm.status === 'VALID') {
      this.validationErrors = [];
      let employee = this.employeeForm.value;
      this.load = true;
      (employee.id ? this.service.update(employee.id, employee) : this.service.create(employee))
        .pipe(finalize(() => this.load = false))
        .subscribe(quiz => this.modalRef?.close('SAVED'));
    } else {
      this.validationErrors = Object.values(this.employeeForm.errors as {});
    }
  }

  private fullName(employee: Employee): string {
    return `${employee.lastName} ${employee.firstName} ${employee.middleName}`;
  }

  private filterEmployeesByQuery(employees: Employee[], query: string): Employee[] {
    if (query) {
      let regexp = new RegExp(query, 'i');
      return employees.filter(e => regexp.test(this.fullName(e))
        || regexp.test(e.email)
        || regexp.test(e.position.title)
      );
    }

    return employees;
  }

  private openEmployeeForm(employee: Employee, modalTitle: string, form: TemplateRef<any>): void {
    this.modalTitle = modalTitle;
    this.validationErrors = [];
    this.employeeForm.setValue({
      id: employee.id,
      lastName: employee.lastName,
      firstName: employee.firstName,
      middleName: employee.middleName,
      email: employee.email,
      isAdmin: employee.isAdmin,
      position: employee.position.id,
    });
    this.modalRef = this.modalService.open(form);
    this.modalRef.result
      .then(res => this.loadEmployees(), () => {
      })
  }

}
