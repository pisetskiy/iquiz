import { Component, OnInit, TemplateRef } from '@angular/core';
import { PositionService } from '../service/position.service';
import { Position } from '../domain/position';
import { BehaviorSubject, combineLatest, finalize, map, Subject } from 'rxjs';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Quiz } from '../domain/quiz';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { QuizService } from '../service/quiz.service';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.scss']
})
export class PositionsComponent implements OnInit {

  private static readonly ADD_MODAL_TITLE = 'Добавить должность';
  private static readonly EDIT_MODAL_TITLE = 'Изменить должность';

  private static readonly POSITION_VALIDATOR: ValidatorFn = (control: AbstractControl) => {
    let result = {} as ValidationErrors;
    let position = control.value as Position;
    if (!position.title) {
      result['title_required'] = 'Необходимо ввести наименование должности.'
    }
    if(position.title.length > 50) {
      result['title_too_long'] = 'Наименование должности не должно превышать 50 символов.'
    }

    return result;
  }

  public readonly trackByFn = (index: number, position: Position) => position.id;

  load: boolean = false;
  modalTitle: string = PositionsComponent.ADD_MODAL_TITLE;
  positionForm: FormGroup;
  quizzesForms: FormArray;
  validationErrors: string[] = [];
  modalRef?: NgbModalRef;

  quizzes: Quiz[] = [];
  positions$: Subject<Position[]> = new BehaviorSubject<Position[]>([]);
  query$: Subject<string> = new BehaviorSubject<string>('');
  filteredPositions$ = combineLatest([this.positions$, this.query$])
    .pipe(map((data: any[]) => this.filterPositionsByQuery(data[0], data[1])));

  constructor(
    private service: PositionService,
    private quizService: QuizService,
    private fb: FormBuilder,
    private modalService: NgbModal,
  ) {
    this.quizzesForms = this.fb.array([]);
    this.positionForm = this.fb.group({
      id: this.fb.control(null),
      title: this.fb.control(''),
      quizzes: this.quizzesForms
    }, {
      validators: PositionsComponent.POSITION_VALIDATOR
    })
  }

  ngOnInit(): void {
    this.quizService.findAll()
      .subscribe(quizzes => this.quizzes = quizzes)
    this.loadPositions();
  }

  loadPositions(): void {
    this.load = true;
    this.service.findAll()
      .pipe(finalize(() => this.load = false))
      .subscribe(positions => this.positions$.next(positions));
  }

  filterPositions(query: string) {
    this.query$.next(query);
  }

  addPosition(form: TemplateRef<any>) {
    this.openPositionForm({
      id: null,
      quizzesCount: 0,
      title: '',
      quizzes: []
    }, PositionsComponent.ADD_MODAL_TITLE, form);
  }

  updatePosition(id: number | null, form: TemplateRef<any>) {
    this.load = true;
    this.service.find(id as number)
      .pipe(finalize(() => this.load = false))
      .subscribe(position => this.openPositionForm(position, PositionsComponent.EDIT_MODAL_TITLE, form))
  }

  addQuiz(quiz: Quiz): void {
    if (!this.quizzesForms.controls.some(q => q.get('id')?.value == quiz.id)) {
      this.quizzesForms.push(this.buildQuizForm(quiz));
    }
  }

  removeQuiz(index: number): void {
    this.quizzesForms.removeAt(index);
  }

  validateAndSave(): void {
    if (this.positionForm.status === 'VALID') {
      this.validationErrors = [];
      let position = this.positionForm.value;
      this.load = true;
      (position.id ? this.service.update(position.id, position) : this.service.create(position))
        .pipe(finalize(() => this.load = false))
        .subscribe(() => this.modalRef?.close('SAVED'));
    } else {
      this.validationErrors = Object.values(this.positionForm.errors as {});
    }
  }

  private filterPositionsByQuery(positions: Position[], query: string): Position[] {
    if (query) {
      let regexp = new RegExp(query, 'i');
      return positions.filter(p => regexp.test(p.title));
    }

    return positions;
  }

  private openPositionForm(position: Position, modalTitle: string, form: TemplateRef<any>) {
    this.modalTitle = modalTitle;
    this.validationErrors = [];
    this.quizzesForms = this.fb.array(position.quizzes.map(quiz => this.buildQuizForm(quiz)));
    this.positionForm.setControl('quizzes', this.quizzesForms);
    this.positionForm.setValue({
      id: position.id,
      title: position.title,
      quizzes: position.quizzes
    });
    this.modalRef = this.modalService.open(form);
    this.modalRef.result.then(res => this.loadPositions()).catch(() => {});
  }

  private buildQuizForm(quiz: Quiz): FormGroup {
    return this.fb.group({
      id: this.fb.control(quiz.id),
      title: this.fb.control(quiz.title),
    });
  }
}
