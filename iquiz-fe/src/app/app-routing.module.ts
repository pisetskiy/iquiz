import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EmployeesComponent} from './employees/employees.component';
import {PositionsComponent} from './positions/positions.component';
import {QuestionsComponent} from './questions/questions.component';
import {QuizzesComponent} from './quizzes/quizzes.component';
import {AppointmentsComponent} from './appointments/appointments.component';
import {MyComponent} from './my/my.component';
import {UserService} from './service/user.service';
import {ExamComponent} from './exam/exam.component';
import {SignupComponent} from './signup/signup.component';
import {LoginComponent} from "./login/login.component";
import {GameComponent} from "./game/game.component";

const routes: Routes = [
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'quizzes',
    canActivate: [UserService],
    children: [
      {
        path: '',
        component: QuizzesComponent
      },
      {
        path: ':quizId',
        children: [
          {
            path: 'questions',
            component: QuestionsComponent
          }
        ]
      }
    ]
  },
  {
    path: 'game/:code',
    component: GameComponent
  },
  // {
  //   path: 'employees',
  //   canActivate: [UserService],
  //   children: [
  //     {
  //       path: '',
  //       component: EmployeesComponent,
  //     },
  //     {
  //       path: ':employeeId',
  //       children: [
  //         {
  //           path: 'appointments',
  //           component: AppointmentsComponent
  //         }
  //       ]
  //     }
  //   ]
  // },
  // {
  //   path: 'positions',
  //   component: PositionsComponent,
  //   canActivate: [UserService],
  // },
  {
    path: '',
    redirectTo: '/quizzes',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
