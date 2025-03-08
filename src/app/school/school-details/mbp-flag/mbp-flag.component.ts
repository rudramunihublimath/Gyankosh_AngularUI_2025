import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'src/app/services/login.service';
import { SchoolService } from 'src/app/services/school.service';
import { UserReq, SchoolDetail, MBPFlag, ResponseDto, Agreement } from 'src/app/types';
import { AgreementDialogComponent } from './agreement-dialog/agreement-dialog.component';
import { FlagDialogComponent } from './flag-dialog/flag-dialog.component';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-mbp-flag',
  templateUrl: './mbp-flag.component.html',
  styleUrls: ['./mbp-flag.component.scss']
})
export class MbpFlagComponent implements OnInit {

  displayedColumns = ['schoolActive', 'schoolInterested', 'dealClosed', 'isDiscontinued', 'discontinuedDate', 'reasonValidated', 'reasonForDiscontinue', 'actions'];
  agreementDisplayedColumns = ['agreementCompleted', 'agreementCompletedDate', 'agreementScanCopyLink', 'uploadedByUserId', 'actions'];

  dataSource: MBPFlag[] = [];
  agreementDataSource: Agreement[] = [];

  loggedInUserDetails!: UserReq;

  isAuthorized = false;

  @Input() schoolDetails!: SchoolDetail;

  flagDetails!: MBPFlag;
  agreementDetails!: Agreement; 

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private schoolService: SchoolService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    this.loggedInUserDetails = JSON.parse(this.loginService.getUserDetails());
    this.isAuthorized = this.loggedInUserDetails?.nameofMyTeam === 'Central_Mool' || this.loggedInUserDetails?.nameofMyTeam === 'OutReach_Head';
    if(!this.isAuthorized) {
      this.displayedColumns.pop();
      this.agreementDisplayedColumns.pop();
    }
    this.getFlagBySchoolId();
    this.getAgreementBySchoolId();
  }





  getFlagBySchoolId() {
    this.schoolService.getFlagBySchoolId(this.schoolDetails.id).subscribe((resp: ResponseDto<MBPFlag>) => {
      if(resp.status) {
        this.flagDetails = resp.message;
        this.dataSource = [resp.message];
      }
    }, (err: HttpErrorResponse) => {
       if(this.isAuthorized && err.error?.message && !err.error?.status) {
        this.saveFlag();
       }

    })
  }

  saveFlag() {
    const payload: MBPFlag = {
      schoolActive:'Yes',
      schoolInterested: 'Yes',
      dealClosed: 'No',
      isDiscontinued: 'No',
      discontinuedDate: '',
      reasonForDiscontinue: '',
      reasonValidated: ''
    }
    this.schoolService.saveFlag(payload, this.schoolDetails.id).subscribe((resp: any) => {
      this.getFlagBySchoolId()
    }, err => {
      this.spinner.hide();
      this.loginService.showError('Something went wrong')
    })
  }


  getAgreementBySchoolId() {
    this.schoolService.getAgreementBySchoolId(this.schoolDetails.id).subscribe((resp: ResponseDto<Agreement>) => {
      if(resp.status) {
        this.agreementDetails = resp.message;
        this.agreementDataSource = [resp.message];
      }
    }, (err: HttpErrorResponse) => {
      if(this.isAuthorized && err.error?.message && !err.error?.status) {
       this.saveAgreement();
      }

   })
  }

  saveAgreement() {
    const payload: Agreement = {
      agreementCompleted: 'No',
      agreementCompletedDate: '',
      agreementScanCopyLink: '',
      // uploadedByUserId: ''
    }

    this.schoolService.saveAgreement(payload, this.schoolDetails.id).subscribe((resp: any) => {
      this.getAgreementBySchoolId();
    }, err => {
      this.spinner.hide();
      this.loginService.showError('Something went wrong')
    })
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

  openFlagDetails(isEditMode: boolean, flagDetails?: MBPFlag) {
    const config = new MatDialogConfig(); 
    config.width= "60vw";
    config.disableClose=true;
    config.data = isEditMode ? {schoolId: this.schoolDetails.id, ...flagDetails} : {schoolId: this.schoolDetails.id};
    const dialog = this.dialog.open(FlagDialogComponent, config);

    dialog.afterClosed().subscribe(resp => {
      if(resp) {
        this.getFlagBySchoolId();
      }
    })
  }

  openAgreementDetails(isEditMode: boolean, agreementDetails?: MBPFlag) {
    const config = new MatDialogConfig(); 
    config.width= "60vw";
    config.disableClose=true;
    config.data = isEditMode ? {schoolId: this.schoolDetails.id, ...agreementDetails} : {schoolId: this.schoolDetails.id};
    const dialog = this.dialog.open(AgreementDialogComponent, config);

    dialog.afterClosed().subscribe(resp => {
      if(resp) {
        this.getAgreementBySchoolId();
      }
    })
  }

  navigateToProfile(id: number) {
    this.router.navigate(['/user-profile'], {queryParams: {id}});
  }
}
