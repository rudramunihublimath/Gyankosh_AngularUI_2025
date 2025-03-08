import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'src/app/services/login.service';
import { SchoolService } from 'src/app/services/school.service';
import { UserReq, SchoolGrade, ResponseDto } from 'src/app/types';

@Component({
  selector: 'app-grade-dialog',
  templateUrl: './grade-dialog.component.html',
  styleUrls: ['./grade-dialog.component.scss']
})
export class GradeDialogComponent implements OnInit {

  gradeForm!: FormGroup;

  loggedInUserDetails!: UserReq;

  isAuthorized = false;

  header = 'Add Grade';

  levels = ['Yes', 'No'];
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<GradeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private schoolService: SchoolService,
    private loginService: LoginService,
    private spinner: NgxSpinnerService,
  ) {

  }

  ngOnInit(): void {
    this.loggedInUserDetails = JSON.parse(this.loginService.getUserDetails());
    this.isAuthorized = this.loggedInUserDetails?.nameofMyTeam === 'Central_Mool' || this.loggedInUserDetails?.nameofMyTeam === 'OutReach_Head';
    this.header = this.data['id'] ? 'Edit Grade' : 'Add Grade';
    this.initializeForm();
  }

  initializeForm() {
    const gradeDetail = this.data;
    this.gradeForm = this.fb.group({
      // year: [gradeDetail.id ? gradeDetail.year : ''],
      gradeName: [gradeDetail.id ? gradeDetail.gradeName : ''],
      totalStudentCount: [gradeDetail.id ? gradeDetail.totalStudentCount : ''],
      booksGivenCount: [gradeDetail.id ? gradeDetail.booksGivenCount : ''],
      
    })
  }

  submitGrade() {
    this.spinner.show();
    const payload: SchoolGrade = this.gradeForm.getRawValue();
    payload.schoolNmReq2 = {id: this.data.schoolId};

    this.updateGrade(payload)
    // this.data['id'] ? this.updateGrade(payload) : this.savePOC(payload);
  }

  // savePOC(payload: SchoolGrade) {
  //   this.schoolService.savePOC(payload).subscribe(resp => {
  //     this.loginService.showSuccess('Grade Added Successfully');
  //     this.dialogRef.close(true);

  //   }, err => {
  //     this.spinner.hide();
  //   })
  // }

  updateGrade(payload: SchoolGrade) {
    payload.id = this.data.id;
    this.schoolService.updateGrade(payload).subscribe((resp: ResponseDto<SchoolGrade>) => {
      this.loginService.showSuccess('Grade Detail Updated Successfully');
      this.dialogRef.close(true);

    }, (err) => {
      this.loginService.showError('Something went wrong')
      this.spinner.hide();
    })
  }

  close() {
    this.dialogRef.close();
  }

}
