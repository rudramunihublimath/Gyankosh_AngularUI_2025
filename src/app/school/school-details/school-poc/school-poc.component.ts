import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoginService } from 'src/app/services/login.service';
import { SchoolService } from 'src/app/services/school.service';
import { SchoolDetail, SchoolPOC, UserReq } from 'src/app/types';
import { PocDialogComponent } from './poc-dialog/poc-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-school-poc',
  templateUrl: './school-poc.component.html',
  styleUrls: ['./school-poc.component.scss']
})
export class SchoolPOCComponent implements OnInit {

  displayedColumns = ['position', 'firstname', 'lastname', 'designation', 'contactNum', 'email', 'firstContact', 'teachingToGrade', 'actions'];
  // displayFilterColumns = ['positionFilter', 'firstnameFilter', 'lastnameFilter', 'emailFilter', 'actionFilter']
  dataSource: SchoolPOC[] = [];
  allPOCDetail: SchoolPOC[] = [];
  loggedInUserDetails!: UserReq;

  isAuthorized = false;

  isPrimaryPOCAvaialable = false;
  @Input() schoolDetails!: SchoolDetail;

  constructor(
    private dialog: MatDialog,
    private loginService: LoginService,
    private schoolService: SchoolService,
    private spinner: NgxSpinnerService,
  ) {

  }

  ngOnInit(): void {
    this.loggedInUserDetails = JSON.parse(this.loginService.getUserDetails());
    this.isAuthorized = this.loggedInUserDetails?.nameofMyTeam === 'Central_Mool' || this.loggedInUserDetails?.nameofMyTeam === 'OutReach_Head';
    if(!this.isAuthorized) {
      this.displayedColumns.pop();
    }
    this.getPOCBySchoolId();
  }

  getPOCBySchoolId() {
    this.schoolService.getPOCBySchoolId(this.schoolDetails.id).subscribe((resp: Array<SchoolPOC>) => {
    this.spinner.hide();
    //console.log('resp', resp);
    this.dataSource = resp;
    this.dataSource.forEach(elt => {
      if(elt?.teachingToGrade?.length) {
        elt.teachingToGrade = elt.teachingToGrade.toString();
      }
    })
    this.isPrimaryPOCAvaialable = resp?.some(elt => elt.firstContact === 'Yes');
    // this.allPOCDetail = resp;
    })
  }

  openPOCDetails(isEditMode: boolean, pocDetail?: SchoolPOC) {
    const config = new MatDialogConfig(); 
    config.width= "60vw";
    config.disableClose=true;
    config.data = isEditMode ? {schoolId: this.schoolDetails.id, isPrimaryPOCAvaialable: this.isPrimaryPOCAvaialable, ...pocDetail} : {schoolId: this.schoolDetails.id, isPrimaryPOCAvaialable: this.isPrimaryPOCAvaialable};
    const dialog = this.dialog.open(PocDialogComponent, config);

    dialog.afterClosed().subscribe(resp => {
      if(resp) {
        this.getPOCBySchoolId();
      }
    })
  }



}
