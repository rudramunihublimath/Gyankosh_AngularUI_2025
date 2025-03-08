import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'src/app/services/login.service';
import { SchoolService } from 'src/app/services/school.service';
import { UserReq, MBPFlag, Agreement } from 'src/app/types';
import { FlagDialogComponent } from '../flag-dialog/flag-dialog.component';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-agreement-dialog',
  templateUrl: './agreement-dialog.component.html',
  styleUrls: ['./agreement-dialog.component.scss']
})
export class AgreementDialogComponent implements OnInit {

  agreementForm!: FormGroup;

  levels = ['Yes', 'No'];

  loggedInUserDetails!: UserReq;

  isAuthorized = false;

  header = 'Add Agreement';

  // flagDetails!: MBPFlag;
  isFlagLoaded = false;

  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FlagDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public agreementDetails: any,
    private schoolService: SchoolService,
    private loginService: LoginService,
    private spinner: NgxSpinnerService,
  ) {

  }

  ngOnInit(): void {
    this.loggedInUserDetails = JSON.parse(this.loginService.getUserDetails());
    this.isAuthorized = this.loggedInUserDetails?.nameofMyTeam === 'Central_Mool' || this.loggedInUserDetails?.nameofMyTeam === 'OutReach_Head';
    this.header = this.agreementDetails['id'] ? 'Edit Agreement' : 'Add Agreement';
    //console.log('this.agreementDetails', this.agreementDetails)

    this.initializeForm();
  }

  initializeForm() {
    this.agreementForm = this.fb.group({
      agreementCompleted: [{value: this.agreementDetails?.id ? this.agreementDetails?.agreementCompleted : 'No', disabled: !this.isAuthorized}],
      agreementCompletedDate: [{value: this.agreementDetails?.id ? this.agreementDetails?.agreementCompletedDate : '', disabled: !this.isAuthorized}],
      agreementScanCopyLink: [{value: this.agreementDetails?.id ? this.agreementDetails?.agreementScanCopyLink : '', disabled: !this.isAuthorized}],
      uploadedByUserId: [{value: this.agreementDetails?.id ? this.agreementDetails?.uploadedByUserId : '', disabled: !this.isAuthorized}],
    })
  }

  selectedAgreementValue(evt: MatSelectChange) {
    if(evt.value === 'No') {
      this.agreementForm.controls['agreementCompletedDate'].reset();
      this.agreementForm.controls['agreementScanCopyLink'].reset();
      this.agreementForm.controls['uploadedByUserId'].reset();
    }
    else {
      const loggedInUser = `${this.loggedInUserDetails?.firstname} ${this.loggedInUserDetails?.lastname}`
      this.agreementForm?.controls['uploadedByUserId']?.patchValue(loggedInUser);
    }
  }

  submitAgreement() {
    const payload: Agreement = this.agreementForm.getRawValue(); 
    payload.uploadedByUserId = this.loggedInUserDetails?.id ? this.loggedInUserDetails.id as any : '';
    if(this.agreementForm.controls['agreementCompletedDate'].value && typeof this.agreementForm.controls['agreementCompletedDate'].value !== 'string') {
      payload.agreementCompletedDate = this.formatDate(this.agreementForm.controls['agreementCompletedDate'].value);
    }

    if(payload.agreementCompleted === 'No') {
      payload.agreementCompletedDate = null;
      payload.agreementScanCopyLink = null;
      payload.uploadedByUserId = null;
    }

    this.agreementDetails?.id ? this.updateAgreement(payload) : this.saveAgreement(payload);

  }

  saveAgreement(payload: Agreement) {
    this.spinner.show();

    this.schoolService.saveAgreement(payload, this.agreementDetails.schoolId).subscribe((resp: any) => {
      this.spinner.hide();
      this.loginService.showSuccess('Agreement Completed Successfully');
      this.dialogRef.close(true);
    }, err => {
      this.spinner.hide();
      this.loginService.showError('Something went wrong')
      // this.dialogRef.close(false);
    })
  }

  updateAgreement(payload: Agreement) {
    // payload.id = this.agreementDetails?.id;
    payload.agreementReq = {id: this.agreementDetails?.schoolId};

    //console.log('payload', payload)
    this.spinner.show();
    this.schoolService.updateAgreement(payload, this.agreementDetails.schoolId).subscribe((resp: any) => {
      this.spinner.hide();
      this.loginService.showSuccess('Agreement Updated Successfully');
      this.dialogRef.close(true);
    }, err => {
      this.spinner.hide();
      this.loginService.showError('Something went wrong')
      // this.dialogRef.close(false);
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

  addAgreementLink(evt: any) {
    // console.log('evt', evt)
    if(evt.target.files && evt.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(evt.target.files[0]); //read file as data url
      // console.log('evt.target.files', evt.target.files)

      reader.onload = () => {
        // this.url = reader.result;
        console.log('reader', reader)
        console.log('reader.result', reader.result)
        // this.isUserLogoChanged = true;
        this.uploadAgreementLink(evt.target.files[0]);
      }
    }
  }

  uploadAgreementLink(file: any) {
    this.spinner.show();
    this.schoolService.uploadAgreementLink(this.agreementDetails.schoolId as number, file).subscribe((resp:any) => {
      this.spinner.hide();
      if(resp['status']) {
        this.agreementForm.controls['agreementScanCopyLink'].patchValue(resp['fullPath']);
      }
      this.loginService.showSuccess('Agreement Link Added Successfully');
      // if(this.loggedInUserDetails?.id === this.userDetail?.id) {
      //   this.getUserById(this.loggedInUserDetails?.id as any);
      // }
    }, err => {
      this.spinner.hide();
    })
  }
  resetAgreementLink() {
    // this.url = null;
    this.schoolService.removeAgreementLink(this.agreementDetails.schoolId as number).subscribe(resp => {
      this.spinner.hide();
      this.agreementForm.controls['agreementScanCopyLink'].reset();
      this.loginService.showSuccess('Agreement Link Removed Successfully');
    }, err => {
      this.agreementForm.controls['agreementScanCopyLink'].reset();
      this.loginService.showError('Something went wrong')
      this.spinner.hide();
    })
  }

  navigateToFile() {
    const url = this.agreementForm.controls['agreementScanCopyLink'].value;
    if(url) {
      window.open(url, '_blank');
    } else {
      this.loginService.showError('Something went wrong')
    }
  }

}
