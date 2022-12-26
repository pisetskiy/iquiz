import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {delay, finalize, of, pipe} from "rxjs";
import {SignupRequest} from "./signup-request";
import {SignupService} from "./signup.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  private static readonly SERVER_MESSAGES: {[key: string]: string} = {
    'ok': 'Выполнено',
    'usernameRequired': 'Необходимо ввести имя.',
    'usernameInvalid': 'Необходимо ввести корректное имя.',
    'usernameNotUnique': 'Введенное имя не может быть использовано. Введите другое.',
    'emailRequired': 'Необходимо ввести почту.',
    'emailInvalid': 'Необходимо ввести корректный почтовый адрес.',
    'emailNotUnique': 'Введенный почтовый адрес не может быть использован. Введите другой.',
    'passwordRequired': 'Необходимо ввести пароль.',
    'passwordMinLength': 'Необходимо ввести пароль длиной минимум 8 символов.'
  };

  private static readonly VALIDATOR = (control: AbstractControl): ValidationErrors => {
    const result = {} as ValidationErrors;
    const value = control.value;
    if (!value.username) {
      result['username'] = 'Необходимо ввести имя.';
    } else if (value.username.length > 30) {
      result['username'] = 'Имя не должно быть длиннее 30 символов.';
    }

    let emailErrors = Validators.email(control.get('email') as AbstractControl);
    if (!value.email) {
      result['email'] = 'Необходимо ввести почту.';
    } else if (value.email.length > 60) {
      result['email'] = 'Почта не должна быть длиннее 60 символов.';
    } else if (emailErrors !== null) {
      result['email'] = 'Необходимо ввести корректный адрес почты.';
    }

    if (!value.password) {
      result['password'] = 'Необходимо ввести пароль.';
    } else if (value.password.length < 8) {
      result['password'] = 'Пароль должен быть длиннее 8 символов.';
    }

    return result;
  }

  signupForm: FormGroup;
  validationErrors: string[] = [];
  load: boolean = false;
  redirectMessage: string = '';


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: SignupService,
  ) {
    this.signupForm = this.fb.group({
      username: this.fb.control(null),
      email: this.fb.control(null),
      password: this.fb.control(null),
    }, {
      validators: SignupComponent.VALIDATOR
    });
  }

  ngOnInit(): void {
  }

  validateAndSave(): void {
    if (this.signupForm.status === 'VALID') {
      this.validationErrors = [];
      let signupRequest = this.signupForm.value as SignupRequest;
      this.load = true;
      this.service.signup(signupRequest)
        .pipe(finalize(() => this.load = false))
        .subscribe((result: string) => {
          if (result === 'ok') {
            this.goToLogin(true);
          } else {
            this.validationErrors = [SignupComponent.SERVER_MESSAGES[result]];
          }
        });
    } else {
      this.validationErrors = Object.values(this.signupForm.errors as {});
    }
  }

  goToLogin(message: boolean): void {
    this.load = true;
    let waitms = 0;
    if (message) {
      waitms = 3000;
      this.redirectMessage = 'Регистрация успешно пройдена. Проверьте указанный почтовый адрес чтобы подтвердить регистрацию.'
    }
    of(1)
      .pipe(delay(waitms))
      .pipe(finalize(() => {
        this.load = false;
        this.redirectMessage = '';
      }))
      .subscribe(ignore => this.router.navigateByUrl('/login'));
  }

}
