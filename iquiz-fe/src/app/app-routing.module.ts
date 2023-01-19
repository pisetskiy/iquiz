import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {QuestionsComponent} from './questions/questions.component';
import {QuizzesComponent} from './quizzes/quizzes.component';
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
