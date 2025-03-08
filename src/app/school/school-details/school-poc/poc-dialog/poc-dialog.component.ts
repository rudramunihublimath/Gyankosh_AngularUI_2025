import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'src/app/services/login.service';
import { SchoolService } from 'src/app/services/school.service';
import { ResponseDto, SchoolPOC, UserReq } from 'src/app/types';

@Component({
  selector: 'app-poc-dialog',
  templateUrl: './poc-dialog.component.html',
  styleUrls: ['./poc-dialog.component.scss']
})
export class PocDialogComponent implements OnInit {

  pocForm!: FormGroup;

  loggedInUserDetails!: UserReq;

  isAuthorized = false;

  header = 'Add POC';

  levels = ['Yes', 'No'];
  grades = ['Grade-1','Grade-2','Grade-3','Grade-4','Grade-5','Grade-6','Grade-7','Grade-8'];
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PocDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private schoolService: SchoolService,
    private loginService: LoginService,
    private spinner: NgxSpinnerService,
  ) {

  }

  ngOnInit(): void {
    this.loggedInUserDetails = JSON.parse(this.loginService.getUserDetails());
    this.isAuthorized = this.loggedInUserDetails?.nameofMyTeam === 'Central_Mool' || this.loggedInUserDetails?.nameofMyTeam === 'OutReach_Head';
    this.header = this.data['id'] ? 'Edit POC' : 'Add POC';
    this.initializeForm();
  }

  initializeForm() {
    const pocDetail = this.data;
    this.pocForm = this.fb.group({
      teacherfirstname: [pocDetail.id ? pocDetail.teacherfirstname : ''],
      teacherlastname: [pocDetail.id ? pocDetail.teacherlastname : ''],
      designation: [pocDetail.id ? pocDetail.designation : ''],
      contactNum1: [pocDetail.id ? pocDetail.contactNum1 : ''],
      contactNum2: [pocDetail.id ? pocDetail.contactNum2 : ''],
      linkdinID: [pocDetail.id ? pocDetail.linkdinID : ''],
      email: [pocDetail.id ? pocDetail.email : ''],
      firstContact: [pocDetail.id ? pocDetail.firstContact : ''],
      teachingToGrade: [pocDetail.id ? pocDetail.teachingToGrade : ''],
    })
  }

  submitPOC() {
    this.spinner.show();
    const payload: SchoolPOC = this.pocForm.getRawValue();
    payload.schoolNameRequest = {id: this.data.schoolId};

    this.data['id'] ? this.updatePOC(payload) : this.savePOC(payload);
  }

  savePOC(payload: SchoolPOC) {
    this.schoolService.savePOC(payload).subscribe(resp => {
      this.loginService.showSuccess('POC Added Successfully');
      this.dialogRef.close(true);

    }, err => {
      this.spinner.hide();
    })
  }

  updatePOC(payload: SchoolPOC) {
    payload.id = this.data.id;
    this.schoolService.updatePOC(payload).subscribe((resp: ResponseDto<any>) => {
      this.loginService.showSuccess('POC Updated Successfully');
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

}
