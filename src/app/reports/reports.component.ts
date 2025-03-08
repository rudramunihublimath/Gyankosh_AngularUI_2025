import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { MatSelectChange } from '@angular/material/select';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpResponse } from '@angular/common/http';
import { Report2Dto, ResponseDto } from '../types';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  panelOpenState = false;
  states: Array<string> = [];
  state = new FormControl('');
  blob!: Blob;
  isReadyToDownload = false;
  reportUrl!: any;
  fileName!: string;

  // table
  displayedColumns = ['id', 'schoolName', 'nextAppointment'];
  report2DataSource: Report2Dto[] = [];

  constructor(
    private loginService: LoginService,
    private spinner: NgxSpinnerService,
  ) {

  }

  ngOnInit(): void {
    this.getStates(1);
  }

  getStates(countryId: number) {
    this.loginService.getStates(countryId).subscribe(resp => {
      this.states = Object.values(resp);
    })
  }

  selectedState(evt: MatSelectChange) {
    const state = evt.value;
    if(state) {
      this.downloadReport1(state);
    }
  }

  createSchoolReportFileName() {
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `SchoolAdminReport_${year}-${month < 9 ? '0'+month : month}-${day < 9 ? '0'+day : day}_${hour < 9 ? '0'+hour : hour}:${minutes < 9 ? '0'+minutes : minutes}:${seconds < 9 ? '0'+seconds : seconds}.xlsx`;
  }

  downloadReport1(state: string) {
    this.spinner.show();
    this.loginService.downloadReport1(state).subscribe((resp: HttpResponse<Blob>) => {

      // Extract content disposition header
      const contentDisposition = resp.headers.get('content-disposition') || '';

      // Extract the file name
      // SchoolAdminReport_2024-02-17_12:30:59.xlsx
      const matches = /filename=([^;]+)/ig.exec(contentDisposition) || '';
      const fileName = (matches[1] || this.createSchoolReportFileName()).trim();

      this.blob = new Blob([(resp.body as Blob)], {type: 'application/octet-stream'});
      const downloadURL = window.URL.createObjectURL((resp.body as Blob));
      this.isReadyToDownload = true;
      this.reportUrl = downloadURL;
      this.fileName = fileName;
      

      this.spinner.hide();

    }, err => {
      this.spinner.hide();
    })
  }

  downloadSchoolData() {
      const link = document.createElement('a');
      link.href = this.reportUrl;
      link.download = this.fileName;
      link.click();
      this.loginService.showSuccess('File Downloaded Successfully');
  }


  getReport2() {
    const loggedInUserDetails = JSON.parse(this.loginService.getUserDetails());
    this.loginService.getReport2(loggedInUserDetails.id).subscribe((resp: ResponseDto<any>) => {
      console.log('resp', resp);
      this.report2DataSource = resp.message;
    })
  }

}
