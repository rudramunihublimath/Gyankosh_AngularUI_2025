import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginService } from '../services/login.service';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpResponse } from '@angular/common/http';
import { Report2Dto, ResponseDto } from '../types';
import { MatOption } from '@angular/material/core';

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
  displayedColumns = ['id', 'schoolName'];
  report2DataSource: Report2Dto[] = [];

  @ViewChild('selectStates') select!: MatSelect;
  allSelected=false;
  selectedStates: Array<string> = [];

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
      this.report2DataSource = resp.message;
    })
  }

  selectedState(evt: MatSelectChange) {
    const state = evt.value;
    this.selectedStates = state;
    if(this.selectedStates?.length === 0) {
      this.isReadyToDownload = false;
    }

    // if(state) {
    //   this.downloadReport1(state);
    // }
  }

  downloadReport(state: Array<string>) {
    const selectedStates = this.allSelected ? 'ALLSTATES' : state ;
    this.downloadReport1(selectedStates.toString());
  }

  toggleAllSelection() {
    if (this.allSelected) {

      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
  }
   optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
  }

}