import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesComponent } from './employees/employees.component';
import { PositionsComponent } from './positions/positions.component';
import { QuestionsComponent } from './questions/questions.component';
import { QuizzesComponent } from './quizzes/quizzes.component';

const routes: Routes = [
  {
    path: 'quizzes',
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
    component: EmployeesComponent
  },
  {
    path: 'positions',
    component: PositionsComponent
  },
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
