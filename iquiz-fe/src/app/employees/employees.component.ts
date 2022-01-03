import { Component, OnInit, TemplateRef } from '@angular/core';
import { EmployeeService } from '../service/employee.service';
import { Employee } from '../domain/employee';
import { BehaviorSubject, combineLatest, finalize, map, Subject } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Position } from '../domain/position';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PositionService } from '../service/position.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

  private static readonly ADD_MODAL_TITLE = 'Добавить сотрудника';
  private static readonly EDIT_MODAL_TITLE = 'Изменить данные сотрудника';

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
  ) {
    this.employeeForm = this.fb.group({
      id: this.fb.control(null),
      lastName: this.fb.control(null),
      firstName: this.fb.control(null),
      middleName: this.fb.control(null),
      email: this.fb.control(null),
      position: this.fb.control(null),
      isAdmin: this.fb.control(false)
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

  addEmployee(form: TemplateRef<any>): void {
    this.openEmployeeForm({
      id: null,
      lastName: '',
      firstName: '',
      middleName: '',
      email: '',
      isAdmin: false,
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
      return employees.filter(e => regexp.test(this.fullName(e)));
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
      .then(res => this.loadEmployees(), () => {})
  }

}
