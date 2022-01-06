import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesComponent } from './employees/employees.component';
import { PositionsComponent } from './positions/positions.component';
import { QuestionsComponent } from './questions/questions.component';
import { QuizzesComponent } from './quizzes/quizzes.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { MyComponent } from './my/my.component';
import { UserService } from './service/user.service';
import { ExamComponent } from './exam/exam.component';

const routes: Routes = [
  {
    path: 'my',
    children: [
      {
        path: '',
        component: MyComponent
      },
      {
        path: ':appointmentId',
        children: [
          {
            path: 'exam',
            component: ExamComponent
          }
        ]
      }
    ]
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
    path: 'employees',
    canActivate: [UserService],
    children: [
      {
        path: '',
        component: EmployeesComponent,
      },
      {
        path: ':employeeId',
        children: [
          {
            path: 'appointments',
            component: AppointmentsComponent
          }
        ]
      }
    ]
  },
  {
    path: 'positions',
    component: PositionsComponent,
    canActivate: [UserService],
  },
  {
    path: '',
    redirectTo: '/my',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
