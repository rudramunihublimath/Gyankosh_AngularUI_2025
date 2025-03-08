import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ResponseDto, UserReq, UserTableDto } from '../types';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  emitEmail: Subject<string> = new Subject<string>();
  baseUrl =  `${environment.baseUrl}/MBP`;
  securedBaseUrl = `${environment.baseUrl}/Secured/MBP`;

  constructor(
    private http: HttpClient
  ) { }

  getAllUsersById(id: number) {
    let params = new HttpParams().set('id', id);
    return this.http.get<UserTableDto[]>(`${this.securedBaseUrl}/Login/findUserReportingMe`, {params});
  }

  getUserByMobile(contactNum: string) {
    let params = new HttpParams().set('contactNum', contactNum);
    return this.http.get(`${this.securedBaseUrl}/Login/findUserByMobile`, {params});
  }

  getUserByEmail(email: string) {
    let params = new HttpParams().set('email', email);
    return this.http.get<ResponseDto<UserReq>>(`${this.securedBaseUrl}/Login/findByEmail`, {params});
  }

  getUserById(id: string) {
    let params = new HttpParams().set('id', id);
    return this.http.get<ResponseDto<UserReq>>(`${this.securedBaseUrl}/Login/findUserId`, {params});
  }

  updateUser(userDetails: UserReq) {
    return this.http.put(`${this.securedBaseUrl}/Login/UpdateUserData`, userDetails);
  }

  uploadUserImage(userId: number, file: any) {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.patch(`${this.securedBaseUrl}/Login/Image?userId=${userId}`, formData);
  }

  removeUserImage(userId: number) {
    return this.http.patch(`${this.securedBaseUrl}/Login/RemoveImage?userId=${userId}`, null);
  }

  uploadSchools(file: any) {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post(`${this.securedBaseUrl}/School/ImportSchoolListInBulk`, formData);
  }
}
