import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {SignupService} from "../signup/signup.service";
import {SignupRequest} from "../signup/signup-request";
import {delay, finalize, of} from "rxjs";
import {LoginService} from "./login.service";
import {LoginRequest} from "./login-request";
import {UserService} from "../service/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private static readonly SERVER_MESSAGES: {[key: string]: string} = {
    'ok': 'Выполнено',
    'passwordInvalid': 'Неверный адрес почты или пароль.',
    'accountNotActive': 'Аккунт не активирован. Для актвации аккаунта перейдите по ссылке, которую можно найти в вашем почтовом ящике.',
  };

  private static readonly VALIDATOR = (control: AbstractControl): ValidationErrors => {
    const result = {} as ValidationErrors;
    const value = control.value;

    let emailErrors = Validators.email(control.get('email') as AbstractControl);
    if (!value.email) {
      result['email'] = 'Необходимо ввести почту.';
    } else if (emailErrors !== null) {
      result['email'] = 'Необходимо ввести корректный адрес почты.';
    }

    if (!value.password) {
      result['password'] = 'Необходимо ввести пароль.';
    }

    return result;
  }

  loginForm: FormGroup;
  validationErrors: string[] = [];
  load: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    // private service: LoginService,
    private service: LoginService,
  ) {
    this.loginForm = this.fb.group({
      username: this.fb.control(null),
      email: this.fb.control(null),
      password: this.fb.control(null),
    }, {
      validators: LoginComponent.VALIDATOR
    });
  }

  ngOnInit(): void {
  }

  validateAndSave(): void {
    if (this.loginForm.status === 'VALID') {
      this.validationErrors = [];
      let loginRequest = this.loginForm.value as LoginRequest;
      this.load = true;
      this.service.login(loginRequest)
        .pipe(finalize(() => this.load = false))
        .subscribe((result: string) => {
          if (result === 'ok') {
            this.router.navigateByUrl("/quizzes");
          } else {
            this.validationErrors = [LoginComponent.SERVER_MESSAGES[result]];
          }
        });
    } else {
      this.validationErrors = Object.values(this.loginForm.errors as {});
    }
  }

  goToSignup(): void {
    this.router.navigateByUrl('/signup')
  }

}
