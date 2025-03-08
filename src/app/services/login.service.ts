import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ChangePassword, ResponseDto, UserLoginReq, UserReq } from '../types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  baseUrl =  `${environment.baseUrl}/MBP`;
  securedBaseUrl = `${environment.baseUrl}/Secured/MBP`;
  userLoginStatus: Subject<boolean> = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  login(loginDetails: UserLoginReq) {
    return this.http.post<ResponseDto<UserReq>>(`${this.baseUrl}/Login/LoginUser`, loginDetails);
  }

  register(registrationDetails: UserReq) {
    return this.http.post(`${this.baseUrl}/Login/RegisterUser`, registrationDetails);
  }

  getMBPTeam() {
    return this.http.get(`${this.securedBaseUrl}/Login/MBPTeam`);
  }

  getCountries() {
    return this.http.get(`${this.securedBaseUrl}/Login/countries`);
  }

  getStates(countryId: number) {
    return this.http.get(`${this.securedBaseUrl}/Login/states/${countryId}`);
  }

  getCities(stateId: number) {
    return this.http.get(`${this.securedBaseUrl}/Login/cities/${stateId}`);
  }

  changePassword(changePasswordData: ChangePassword) {
    return this.http.put(`${this.securedBaseUrl}/Login/ChangePassword`, changePasswordData);
  }
  forgotPassword(email: string) {
    const params = new HttpParams().set('email', email);
    return this.http.get(`${this.baseUrl}/Login/forgotPWD`, {params});
  }

  userToken(token: string) {
    this.userLoginStatus.next(token ? true : false);
    sessionStorage.setItem('token', JSON.stringify(token));
    return true;
  }

  isLoggedIn() {
    const token = sessionStorage.getItem('token');
    return token ? true:false;
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    this.router.navigate(['']);
  }

  getToken() {
    return JSON.parse(JSON.stringify(sessionStorage.getItem('token')));
  }

  setUserDetails(user: any) {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  getUserDetails() {
    return JSON.parse(JSON.stringify(sessionStorage.getItem('user')));
  }

  getUserRole() {
    const user = this.getUserDetails();
    return user?.profile;
  }

  openSnackBar(msg: string, title?: string) {
    this.snackbar.open(msg, title, {
      duration:  4000,
    });
  }
  showSuccess(msg: string) {
    this.toastr.success(msg, 'Success');
  }

  showError(msg: string) {
    this.toastr.error(msg, 'Error');
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  downloadReport1(state: string) {
    const params = new HttpParams().set('state', state);
    return this.http.get(`${this.securedBaseUrl}/School/Admin/Report1`, 
    {
      params,
      responseType: 'blob',
      observe: 'response'
    }
    );
    
  }

  getReport2(id: number) {
    const params = new HttpParams().set('user_id', id);
    return this.http.get<any>(`${this.securedBaseUrl}/School/Admin/Report2`, {params});
  }
}
