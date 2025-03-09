import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './credComponent/login/login.component';
import { RegistrationComponent } from './credComponent/registration/registration.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { HomeComponent } from './credComponent/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { authInterceptorProviders } from './services/auth.interceptor';
import { UserTableViewComponent } from './user/user-table-view/user-table-view.component';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ForgotPasswordComponent } from './credComponent/forgot-password/forgot-password.component';
import { RegisterSchoolComponent } from './school/register-school/register-school.component';
import { SchoolDetailsComponent } from './school/school-details/school-details.component';
import { SchoolTableViewComponent } from './school/school-table-view/school-table-view.component';
import { SchoolInformationComponent } from './school/school-details/school-information/school-information.component';
import { SchoolPOCComponent } from './school/school-details/school-poc/school-poc.component';
import { SchoolMeetingNotesComponent } from './school/school-details/school-meeting-notes/school-meeting-notes.component';
import { OutreachInformationComponent } from './school/school-details/outreach-information/outreach-information.component';
import { MbpFlagComponent } from './school/school-details/mbp-flag/mbp-flag.component';
import { PocDialogComponent } from './school/school-details/school-poc/poc-dialog/poc-dialog.component';
import { SchoolAgreementComponent } from './school/school-details/school-agreement/school-agreement.component';
import { MeetingDialogComponent } from './school/school-details/school-meeting-notes/meeting-dialog/meeting-dialog.component';
import { OutreachDialogComponent } from './school/school-details/outreach-information/outreach-dialog/outreach-dialog.component';
import { TrainingDialogComponent } from './school/school-details/training-information/training-dialog/training-dialog.component';
import { TrainingInformationComponent } from './school/school-details/training-information/training-information.component';
import { OutreachTrainerInfoComponent } from './school/school-details/outreach-trainer-info/outreach-trainer-info.component';
import { FlagDialogComponent } from './school/school-details/mbp-flag/flag-dialog/flag-dialog.component';
import { AgreementDialogComponent } from './school/school-details/mbp-flag/agreement-dialog/agreement-dialog.component';
import { NgxMatDateFormats, NgxMatNativeDateModule, NGX_MAT_DATE_FORMATS, NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { OutreachDetailsComponent } from './school/school-table-view/outreach-details/outreach-details.component';
import { SchoolGradeComponent } from './school/school-details/school-grade/school-grade.component';
import { GradeDialogComponent } from './school/school-details/school-grade/grade-dialog/grade-dialog.component';
import { AddTeamComponent } from './school/school-table-view/add-team/add-team.component';
import { ReportsComponent } from './reports/reports.component';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';


const INTL_DATE_INPUT_FORMAT = {

  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hourCycle: 'h23',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
}

// const MAT_DATE_FORMATS: NgxMatDateFormats =  {

//   parse: {
//     dateInput: INTL_DATE_INPUT_FORMAT,
//   },
//   display: {
//     dateInput: INTL_DATE_INPUT_FORMAT,
//     monthYearLabel: {year: 'numeric', month: 'short'},
//     dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
//     monthYearA11yLabel: {year: 'numeric', month: 'long'},
//   }
// };

// If using Moment
const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: "l, LTS"
  },
  display: {
    dateInput: "l, LTS",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    UserProfileComponent,
    HomeComponent,
    UserTableViewComponent,
    ForgotPasswordComponent,
    RegisterSchoolComponent,
    SchoolDetailsComponent,
    SchoolTableViewComponent,
    SchoolInformationComponent,
    SchoolPOCComponent,
    SchoolMeetingNotesComponent,
    OutreachInformationComponent,
    MbpFlagComponent,
    PocDialogComponent,
    SchoolAgreementComponent,
    MeetingDialogComponent,
    OutreachDialogComponent,
    TrainingInformationComponent,
    TrainingDialogComponent,
    OutreachTrainerInfoComponent,
    FlagDialogComponent,
    AgreementDialogComponent,
    OutreachDetailsComponent,
    SchoolGradeComponent,
    GradeDialogComponent,
    AddTeamComponent,
    ReportsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    NgxMatMomentModule,
    // MatDatepickerModule, 
    // MatNativeDateModule,
    
  ],
  providers: [authInterceptorProviders,
    {provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS}
  ], //authInterceptorProviders
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
