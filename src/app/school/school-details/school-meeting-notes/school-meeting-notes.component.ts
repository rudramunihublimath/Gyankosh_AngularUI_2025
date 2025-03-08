import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoginService } from 'src/app/services/login.service';
import { SchoolService } from 'src/app/services/school.service';
import { SchoolDetail, SchoolMOM, UserReq } from 'src/app/types';
import { NgxSpinnerService } from 'ngx-spinner';
import { MeetingDialogComponent } from './meeting-dialog/meeting-dialog.component';

@Component({
  selector: 'app-school-meeting-notes',
  templateUrl: './school-meeting-notes.component.html',
  styleUrls: ['./school-meeting-notes.component.scss']
})
export class SchoolMeetingNotesComponent implements OnInit {

  displayedColumns = ['position', 'meetingDateTime', 'nextAppointment', 'mom', 'actions'];
  // displayFilterColumns = ['positionFilter', 'firstnameFilter', 'lastnameFilter', 'emailFilter', 'actionFilter']
  dataSource: SchoolMOM[] = [];
  allPOCDetail: SchoolMOM[] = [];
  loggedInUserDetails!: UserReq;

  isAuthorized = false;
  isBtnShow = true;

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
    
    if(this.loggedInUserDetails?.nameofMyTeam === 'TrainTheTrainer_Head') {
      this.isBtnShow = false;
      this.displayedColumns?.pop();
    }
    this.getMOMBySchoolId();
  }

  getMOMBySchoolId() {
    this.schoolService.getMOMBySchoolId(this.schoolDetails.id).subscribe((resp: Array<SchoolMOM>) => {
    this.spinner.hide();
    //console.log('resp', resp);
    this.dataSource = resp;
    // this.allPOCDetail = resp;
    })
  }

  openMOMDetails(isEditMode: boolean, momDetail?: SchoolMOM) {
    const config = new MatDialogConfig(); 
    config.width= "60vw";
    config.maxHeight="100vh";
    config.disableClose=true;
    config.data = isEditMode ? {schoolId: this.schoolDetails.id, ...momDetail} : {schoolId: this.schoolDetails.id};
    const dialog = this.dialog.open(MeetingDialogComponent, config);

    dialog.afterClosed().subscribe(resp => {
      if(resp) {
        this.getMOMBySchoolId();
      }
    })
  }



}
