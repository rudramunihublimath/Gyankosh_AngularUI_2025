import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'src/app/services/login.service';
import { SchoolService } from 'src/app/services/school.service';
import { UserReq, MBPFlag } from 'src/app/types';

@Component({
  selector: 'app-flag-dialog',
  templateUrl: './flag-dialog.component.html',
  styleUrls: ['./flag-dialog.component.scss']
})
export class FlagDialogComponent implements OnInit {

  flagForm!: FormGroup;

  levels = ['Yes', 'No'];

  loggedInUserDetails!: UserReq;

  isAuthorized = false;

  header = 'Add MBP Flag';

  // flagDetails!: MBPFlag;
  isFlagLoaded = false;

  showSchollDiscontinuedFields = false;

  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FlagDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public flagDetails: any,
    private schoolService: SchoolService,
    private loginService: LoginService,
    private spinner: NgxSpinnerService,
  ) {

  }

  ngOnInit(): void {
    this.loggedInUserDetails = JSON.parse(this.loginService.getUserDetails());
    this.isAuthorized = this.loggedInUserDetails?.nameofMyTeam === 'Central_Mool' || this.loggedInUserDetails?.nameofMyTeam === 'OutReach_Head';
    this.header = this.flagDetails['id'] ? 'Edit MBP Flag' : 'Add MBP Flag';

    this.initializeForm();
  }

  initializeForm() {
    this.flagForm = this.fb.group({
      schoolActive: [{value: this.flagDetails?.id ? this.flagDetails.schoolActive : 'Yes', disabled: !this.isAuthorized}],
      schoolInterested: [{value: this.flagDetails?.id ? this.flagDetails.schoolInterested : 'Yes', disabled: !this.isAuthorized}],
      dealClosed: [{value: this.flagDetails?.id ? this.flagDetails.dealClosed : 'No', disabled: !this.isAuthorized}],
      isDiscontinued: [{value: this.flagDetails?.id ? this.flagDetails.isDiscontinued : 'No', disabled: !this.isAuthorized}],
      discontinuedDate: [{value: this.flagDetails?.id ? this.flagDetails.discontinuedDate : '', disabled: !this.isAuthorized}],
      reasonForDiscontinue: [{value: this.flagDetails?.id ? this.flagDetails.reasonForDiscontinue : '', disabled: !this.isAuthorized}],
      reasonValidated: [{value: this.flagDetails?.id ? this.flagDetails.reasonValidated : '', disabled: !this.isAuthorized}],
    });

    this.showSchollDiscontinuedFields = this.flagDetails.isDiscontinued === 'Yes';
  }

  submitFlag() {
    const payload: MBPFlag = this.flagForm.getRawValue(); 
    if(this.flagForm.controls['discontinuedDate'].value && typeof this.flagForm.controls['discontinuedDate'].value !== 'string') {
      payload.discontinuedDate = this.formatDate(this.flagForm.controls['discontinuedDate'].value);
    }
    //console.log('payload', payload)
    this.flagDetails?.id ? this.updateFlag(payload) : this.saveFlag(payload);

  }

  saveFlag(payload: MBPFlag) {
    this.spinner.show();
    this.schoolService.saveFlag(payload, this.flagDetails.schoolId).subscribe((resp: any) => {
      //console.log('resp', resp);
      this.dialogRef.close(resp);
      this.spinner.hide();
      this.loginService.showSuccess('MBP Flags Added Successfully');
    })
  }

  updateFlag(payload: MBPFlag) {
    this.spinner.show();
    this.schoolService.updateFlag(payload, this.flagDetails.schoolId).subscribe((resp: any) => {
      //console.log('resp', resp);
      this.dialogRef.close(resp);
      this.spinner.hide();
      this.loginService.showSuccess('MBP Flags Updated Successfully');
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

  selectedSchoolDiscontinued(evt: MatSelectChange) {

    this.showSchollDiscontinuedFields = evt.value === 'Yes';
    
   }

}
