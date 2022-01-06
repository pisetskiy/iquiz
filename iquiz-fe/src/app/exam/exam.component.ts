import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../service/appointment.service';
import { Appointment } from '../domain/appointment';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';

const ANSWER_VALIDATOR = (control: AbstractControl): ValidationErrors => {
  const result = {} as ValidationErrors;
  if (!control.value.variants?.some((v: any) => v.checked)) {
    result['variant_required'] = 'At least one variant required';
  }
  return result;
};

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit {

  load = false;

  isCreated = false;
  isStarted = false;
  isPassed = false;
  isExpired = false;

  appointment: any;
  quiz: any;
  questions: any;
  question: any;
  answerMap: any;
  timerSeconds = 0;

  variantsForms: FormArray;
  answerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private service: AppointmentService,
  ) {
    this.variantsForms = this.fb.array([]);
    this.answerForm = this.fb.group({
      question: this.fb.group({
        id: null,
        content: null,
      }),
      variants: this.variantsForms
    }, {
      validators: ANSWER_VALIDATOR
    })
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['appointmentId'];
    this.load = true;
    this.service.findForUser(id)
      .pipe(finalize(() => this.load = false))
      .subscribe(appointment => this.initValues(appointment));
  }

  start(): void {
    this.load = true;
    this.service.start(this.appointment.id)
      .pipe(finalize(() => this.load = false))
      .subscribe(appointment => this.initValues(appointment))
  }

  stop(): void {
    if (this.isStarted && this.timerSeconds) {
      this.load = true;
      this.service.stop(this.appointment.id)
        .pipe(finalize(() => this.load = false))
        .subscribe(appointment => this.initValues(appointment))
    }
  }

  addAnswer(): void {
    const value = this.answerForm.value;
    const request = {
      question: value.question.id,
      variants: value.variants.filter((v: any) => v.checked).map((v: any) => v.id),
    }
    this.load = true;
    this.service.answer(this.appointment.id, request)
      .pipe(finalize(() => this.load = false))
      .subscribe(answer => {
        this.answerMap[answer.question] = answer;
        this.variantsForms.controls.forEach(c => c.disable())
        this.checkAllAnswered()
      });
  }

  prev(): void {
    const index = this.question.number - 1;
    this.selectQuestion(index - 1);
  }

  next(): void {
    const index = this.question.number - 1;
    this.selectQuestion(index + 1);
  }

  private initValues(appointment: Appointment) {
    this.isCreated = appointment.state === 'CREATED';
    this.isStarted = appointment.state === 'STARTED';
    this.isPassed = appointment.state === 'PASSED';
    this.isExpired = appointment.state === 'EXPIRED';

    const endDate = Date.parse(appointment.startDate || '') + ((appointment.quiz?.timeLimit || 0) * 60_000);
    const now = Date.now();
    this.timerSeconds = now > endDate ? 0 : ((endDate - now) / 1000);
    this.questions = (appointment.questions || []).sort((q1, q2) => (q2.id || 0) - (q1.id || 0));
    this.questions?.forEach((question: any, index: number) => question['number'] = index + 1);

    this.answerMap = (appointment.answers || []).reduce((map, answer) => {
      map[answer.question] = answer;
      return map;
    }, {} as any);

    this.selectQuestion(0);

    this.quiz = appointment.quiz;

    this.appointment = appointment;
  }

  private selectQuestion(index: number): void {
    const question = this.questions[index];
    const answer = this.answerMap[question.id]
    const variants = question.variants.map((variant: any) => {
      return {
        id: variant.id,
        value: variant.value,
        checked: answer ? answer.variants.indexOf(variant.id) !== -1 : false
      }
    });
    this.variantsForms = this.fb.array(variants.map(() => this.fb.group({
      id: null,
      value: null,
      checked: null,
    })));
    if (this.answerMap[question.id]) {
      this.variantsForms.controls.forEach(c => c.disable())
    }
    this.answerForm.setControl('variants', this.variantsForms);
    this.answerForm.setValue({
      question: {
        id: question.id,
        content: question.content,
      },
      variants: variants,
    });
    this.question = question;
  }

  private checkAllAnswered() {
    const unanswered = this.questions.filter((q: any) => !this.answerMap[q.id]);
    console.log(unanswered)
    if (!unanswered.length) {
      this.stop();
    }
  }

}
