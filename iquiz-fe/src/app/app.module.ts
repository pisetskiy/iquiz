import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerI18n, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PositionsComponent } from './positions/positions.component';
import { HttpClientModule } from '@angular/common/http';
import { EmployeesComponent } from './employees/employees.component';
import { QuestionsComponent } from './questions/questions.component';
import { QuizzesComponent } from './quizzes/quizzes.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search/search.component';
import { TypeaheadComponent } from './typeahead/typeahead.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AppointmentsComponent } from './appointments/appointments.component';
import { DatepickerFormatService } from './service/datepicker-format.service';
import { DatepickerAdapterService } from './service/datepicker-adapter.service';
import { DatepickerTranslationService } from './service/datepicker-translation.service';

@NgModule({
  declarations: [
    AppComponent,
    PositionsComponent,
    EmployeesComponent,
    QuestionsComponent,
    QuizzesComponent,
    SearchComponent,
    TypeaheadComponent,
    AppointmentsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    NgSelectModule,
  ],
  providers: [
    { provide: NgbDateParserFormatter, useClass: DatepickerFormatService },
    { provide: NgbDateAdapter, useClass: DatepickerAdapterService },
    { provide: NgbDatepickerI18n, useClass: DatepickerTranslationService },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
