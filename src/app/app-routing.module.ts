import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './credComponent/login/login.component';
import { RegistrationComponent } from './credComponent/registration/registration.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { HomeComponent } from './credComponent/home/home.component';
import { UserTableViewComponent } from './user/user-table-view/user-table-view.component';
import { RegisterSchoolComponent } from './school/register-school/register-school.component';
import { SchoolDetailsComponent } from './school/school-details/school-details.component';
import { SchoolTableViewComponent } from './school/school-table-view/school-table-view.component';
import { authGuard } from './Guard/auth.guard';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes =  [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent, canActivate:[authGuard()] },
  { path: 'user-profile', component: UserProfileComponent, canActivate:[authGuard()]  },
  { path: 'user-details', component: UserTableViewComponent, canActivate:[authGuard()]  },
  { path: 'register-school', component: RegisterSchoolComponent, canActivate:[authGuard()]  },
  { path: 'school-details/:id', component: SchoolDetailsComponent, canActivate:[authGuard()]  },
  { path: 'school', component: SchoolTableViewComponent, canActivate:[authGuard()]  },
  { path: 'reports', component: ReportsComponent, canActivate:[authGuard()]  },
  
  { path: '**', component: LoginComponent  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
