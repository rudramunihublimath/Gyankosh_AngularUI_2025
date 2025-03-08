import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'src/app/services/login.service';
import { SchoolService } from 'src/app/services/school.service';
import { SchoolGrade, UserReq, SchoolDetail, ResponseDto } from 'src/app/types';
import { PocDialogComponent } from '../school-poc/poc-dialog/poc-dialog.component';
import { GradeDialogComponent } from './grade-dialog/grade-dialog.component';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-school-grade',
  templateUrl: './school-grade.component.html',
  styleUrls: ['./school-grade.component.scss']
})
export class SchoolGradeComponent implements OnInit {

  displayedColumns = ['position', 'gradeName', 'totalStudentCount', 'booksGivenCount', 'actions'];
  dataSource: SchoolGrade[] = [];
  allGrades: SchoolGrade[] = [];
  loggedInUserDetails!: UserReq;

  isAuthorized = false;

  isPrimaryPOCAvaialable = false;
  @Input() schoolDetails!: SchoolDetail;

  currentYear = new Date().getFullYear();

  yearControl!: FormControl;
  gradeYears: Array<number> = [];

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
      this.displayedColumns?.pop();
    }

    this.yearControl = new FormControl(this.currentYear);
    this.getGradeYears();
    this.getGradeBySchoolId();
  }

  getGradeYears() {
    this.schoolService.getGradeYears().subscribe(resp => {
      this.gradeYears = resp.message;
    })
  }

  getGradeBySchoolId() {
    this.schoolService.getGradeBySchoolId(this.schoolDetails.id).subscribe((resp: Array<SchoolGrade>) => {
    this.spinner.hide();
    if(!resp?.length) {
      this.saveGrade();
    }
    this.allGrades = JSON.parse(JSON.stringify(resp));
    this.dataSource = resp;
    })
  }

  saveGrade() {
    const payload = { 
      schoolNmReq2: {id: this.schoolDetails.id}
    }
    this.schoolService.saveGrade(payload).subscribe(resp => {
      this.getGradeBySchoolId();
    })
  }

  selectedYear(evt: MatSelectChange) {
    this.dataSource = this.allGrades;
  }

  openGradeDetails(isEditMode: boolean, gradeDetail?: SchoolGrade) {
    const config = new MatDialogConfig(); 
    config.width= "45vw";
    config.disableClose=true;
    config.data = isEditMode ? {schoolId: this.schoolDetails.id, ...gradeDetail} : {schoolId: this.schoolDetails.id};
    const dialog = this.dialog.open(GradeDialogComponent, config);

    dialog.afterClosed().subscribe(resp => {
      if(resp) {
        this.getGradeBySchoolId();
      }
    })
  }

  getTotalStudentCount() {
    return this.dataSource.map(elt => elt.totalStudentCount ? +elt.totalStudentCount : 0).reduce((acc, val) => acc + (val), 0)
  }
  getTotalBooksCount() {
    return this.dataSource.map(elt => elt.booksGivenCount ? +elt.booksGivenCount : 0).reduce((acc, val) => acc + val, 0)
  }



}
