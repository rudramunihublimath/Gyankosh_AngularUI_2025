import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'src/app/services/login.service';
import { SchoolService } from 'src/app/services/school.service';
import { ResponseDto, OutReach, UserReq } from 'src/app/types';

@Component({
  selector: 'app-outreach-dialog',
  templateUrl: './outreach-dialog.component.html',
  styleUrls: ['./outreach-dialog.component.scss']
})
export class OutreachDialogComponent implements OnInit {

  outReachForm!: FormGroup;

  loggedInUserDetails!: UserReq;

  isAuthorized = false;

  header = 'Add Outreach';
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<OutreachDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private schoolService: SchoolService,
    private loginService: LoginService,
    private spinner: NgxSpinnerService,
  ) {

  }

  ngOnInit(): void {
    this.loggedInUserDetails = JSON.parse(this.loginService.getUserDetails());
    this.isAuthorized = this.loggedInUserDetails?.nameofMyTeam === 'Central_Mool' || this.loggedInUserDetails?.nameofMyTeam === 'OutReach_Head';
    this.header = this.data['id'] ? 'Edit Outreach' : 'Add Outreach';

    this.initializeForm();
  }

  initializeForm() {
    const outReachDetail = this.data;
    this.outReachForm = this.fb.group({
      outreachuserid: [outReachDetail.id ? outReachDetail.outreachuserid : ''],
      outreach_assigneddate: [outReachDetail.id ? outReachDetail.outreach_assigneddate : ''],
      outreachheaduserid: [outReachDetail.id ? outReachDetail.outreachheaduserid : this.loggedInUserDetails?.email],
      outreachHead_assigneddate: [outReachDetail.id ? outReachDetail.outreachHead_assigneddate : ''],
    })
  }

  submitOutReach() {
    this.spinner.show();
    const payload: OutReach = this.outReachForm.getRawValue();
    // console.log('this.outReachForm.getRawValue()', this.outReachForm.getRawValue())

    if(this.outReachForm.controls['outreach_assigneddate'].value && typeof this.outReachForm.controls['outreach_assigneddate'].value !== 'string') {
      payload.outreach_assigneddate = this.formatDate(this.outReachForm.controls['outreach_assigneddate'].value);
    }

    if(this.outReachForm.controls['outreachHead_assigneddate'].value && typeof this.outReachForm.controls['outreachHead_assigneddate'].value !== 'string') {
      payload.outreachHead_assigneddate = this.formatDate(this.outReachForm.controls['outreachHead_assigneddate'].value);
    }


    // payload.outreach_assigneddate = new Date(this.outReachForm.controls['outreach_assigneddate']?.value).toISOString();
    // payload.outreachHead_assigneddate = new Date(this.outReachForm.controls['outreachHead_assigneddate']?.value).toISOString();

    this.data['id'] ? this.updateOutReach(payload) : this.saveOutReach(payload);
  }

  saveOutReach(payload: OutReach) {
    this.schoolService.saveOutreach(payload, this.data.schoolId).subscribe((resp: ResponseDto<OutReach>) => {
      this.loginService.showSuccess('Outreach Added Successfully');
      this.dialogRef.close(true);

    }, err => {
      this.loginService.showError('Something went wrong')
      this.spinner.hide();
    })
  }

  updateOutReach(payload: OutReach) {
    payload.id = this.data.id;
    this.schoolService.updateOutreach(payload, this.data.schoolId).subscribe((resp: ResponseDto<OutReach>) => {
      this.loginService.showSuccess('Outreach Updated Successfully');
      this.dialogRef.close(true);

    }, (err) => {
      //console.log('err', err)
      this.loginService.showError('Something went wrong')
      this.spinner.hide();
    })
  }

  close() {
    this.dialogRef.close();
  }

  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  formatDate(dob: Date) {
    return [
      dob.getFullYear(),
      this.padTo2Digits(dob.getMonth() + 1),
      this.padTo2Digits(dob.getDate()),
    ].join('-');
  }

}
