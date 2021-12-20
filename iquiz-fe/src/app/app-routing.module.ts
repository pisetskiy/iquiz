import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesComponent } from './employees/employees.component';
import { PositionsComponent } from './positions/positions.component';
import { QuestionsComponent } from './questions/questions.component';
import { QuizzesComponent } from './quizzes/quizzes.component';

const routes: Routes = [
  {
    path: 'questions',
    component: QuestionsComponent
  },
  {
    path: 'quizzes',
    component: QuizzesComponent
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
    redirectTo: '/questions',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
