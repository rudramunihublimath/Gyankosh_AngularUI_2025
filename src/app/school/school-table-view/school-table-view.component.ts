import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'src/app/services/login.service';
import { SchoolService } from 'src/app/services/school.service';
import { OutReach, ResponseDto, SchoolDetail, SchoolTableDetail, UserReq } from 'src/app/types';
import { TrainingDialogComponent } from '../school-details/training-information/training-dialog/training-dialog.component';
import { UserService } from 'src/app/services/user.service';
import { OutreachDetailsComponent } from './outreach-details/outreach-details.component';
import { AddTeamComponent } from './add-team/add-team.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-school-table-view',
  templateUrl: './school-table-view.component.html',
  styleUrls: ['./school-table-view.component.scss']
})
export class SchoolTableViewComponent implements OnInit {
  displayedColumns = ['position', 'name', 'contactNum', 'address', 'city', 'pincode', 'email', 'outReachAllocated', 'outReachHeadAllocated', 'trainingHeadAllocated', 'outreach', 'actions'];
  displayedFilterColumns = ['position-filter', 'name-filter', 'contactNum-filter', 'address-filter', 'city-filter','pincode-filter', 'email-filter', 'outReachAllocated-filter', 'outReachHeadAllocated-filter', 'trainingHeadAllocated-filter', 'outreach-filter', 'actions-filter'];
  dataSource!: MatTableDataSource<any>;
  allSchoolDetail: any[] = [];
  loggedInUserDetails!: UserReq;
  isAuthorized = false;
  isAdmin = false;

  schoolFilterControl = new FormControl('');

  filterBySchoolId = new FormControl('');
  filterBySchoolName = new FormControl('');
  filterByContact= new FormControl('');
  filterByAddress = new FormControl('');
  filterByCity = new FormControl('');
  filterByPinCode = new FormControl('');
  filterByEmail = new FormControl('');
  filterByOutreachAllocated = new FormControl('');
  filterByOutreachHeadAllocated= new FormControl('');
  filterByTrainingHeadAllocated = new FormControl('');

 // pagination vars
  pageSizeOptions = [25, 50, 75, 100];
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(
    private schoolService: SchoolService,
    private userService: UserService,
    private loginService: LoginService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private dialog: MatDialog,
  ) {

  }

  ngOnInit(): void {
    this.loggedInUserDetails = JSON.parse(this.loginService.getUserDetails());
    this.isAdmin = this.loggedInUserDetails?.nameofMyTeam === 'Central_Mool';
    this.isAuthorized = this.loggedInUserDetails?.nameofMyTeam === 'Central_Mool' || this.loggedInUserDetails?.nameofMyTeam === 'OutReach_Head';
    if(this.loggedInUserDetails?.nameofMyTeam === 'OutReach') {
      this.displayedColumns = ['position', 'name', 'contactNum', 'address', 'city', 'pincode', 'email', 'outReachAllocated', 'outReachHeadAllocated', 'trainingHeadAllocated', 'actions'];
      this.displayedFilterColumns = ['position-filter', 'name-filter', 'contactNum-filter', 'address-filter', 'city-filter', 'pincode-filter', 'email-filter', 'outReachAllocated-filter', 'outReachHeadAllocated-filter', 'trainingHeadAllocated-filter', 'actions-filter'];
    }

    this.getAllSchoolByCity()
    // this.isAuthorized ? this.getAllSchoolByCity() : this.getAllocatedSchools();
    
  }

  // getAllocatedSchools() {
  //   const schoolAllocated = this.loggedInUserDetails?.schoolAllocated ?? 0;
  //   // ['Pune', 'Mumbai'];
    
  //   this.spinner.show();
  //   this.schoolService.getAllocatedSchools(schoolAllocated).subscribe((resp: any) => {
  //     this.spinner.hide();
  //     this.allSchoolDetail = JSON.parse(JSON.stringify(resp));
  //     this.dataSource = resp;
  //     this.searchSchool();
  //   })
  // }


  getAllSchoolByCity() {
    const cities = this.loggedInUserDetails.citiesAllocated ? this.loggedInUserDetails.citiesAllocated : ['Pune'];
    // ['Pune', 'Mumbai'];
    
    this.spinner.show();
    this.schoolService.getAllSchoolByCity(cities).subscribe((resp: any) => {
      this.spinner.hide();
      this.allSchoolDetail = JSON.parse(JSON.stringify(resp));
      this.dataSource = new MatTableDataSource(resp);
      this.dataSource.paginator = this.paginator;
      this.searchSchool();
      this.searchByField();
    })
  }


  addNewSchool() {
    this.router.navigate(['/register-school']);
  }

  navigateToSchoolDetails(id: number) {
    this.router.navigate([`/school-details/${id}`]);
  }

  searchSchool() {
    this.schoolFilterControl.valueChanges.subscribe(val => {
      this.dataSource.data = val ? this.allSchoolDetail.filter(usr => usr.name.toLowerCase().includes(val.toLowerCase()) || usr.city.toLowerCase().includes(val.toLowerCase()) || usr.contactNum1.toLowerCase().includes(val.toLowerCase()) || usr.email.toLowerCase().includes(val.toLowerCase())) : this.allSchoolDetail;
    })
  }

  getOutReachDetails(schoolDetail: SchoolDetail) {
    this.spinner.show();
    this.schoolService.getOutreachBySchoolId(schoolDetail.id).subscribe((resp: ResponseDto<any>) => {
      //console.log('resp', resp);
      const outreachDetail = resp.message;
      if(outreachDetail) {
        this.getUserByEmail(outreachDetail);
      }
      }, err => {
        this.loginService.showError('No Details Available');
        this.spinner.hide();
      })
  }

  getUsersAllocatedToSchool(schoolDetail: SchoolDetail) {
    this.spinner.show();
    this.schoolService.getUsersAllocatedToSchool(schoolDetail.id).subscribe((resp: ResponseDto<any>) => {
      this.spinner.hide();
      const userId = Object.keys(resp.message);
      // console.log('userId', userId)
      const userDetail: any = Object.values(resp.message)
      userDetail.forEach((elt: any, idx: number) => {
        elt['id'] = userId[idx];
      });
      this.openOutreachDetails(userDetail);
    }, err => {
      this.loginService.showError('No Details Available');
      this.spinner.hide();
    })
  }

  getUserByEmail(user: OutReach) {
    this.userService.getUserByEmail(user.outreachuserid).subscribe((resp: ResponseDto<UserReq>) => {
      this.spinner.hide();
      const userDetail = resp.message;
      this.openOutreachDetails(userDetail);
    }, err => {
      this.loginService.showError('No Details Available');
      this.spinner.hide();
    })
  }

  openOutreachDetails(userDetail: any) {
    //console.log('userDetail', userDetail);
    const config = new MatDialogConfig();
      config.width= "80vw";
      config.disableClose=true;
      config.data = userDetail ? userDetail : [];
      const dialog = this.dialog.open(OutreachDetailsComponent, config);
  
      dialog.afterClosed().subscribe(resp => {
        //console.log('resp', resp)
      })
  }

  addPerson(schoolId: number) {
    const config = new MatDialogConfig(); 
      config.width= "50vw";
      config.disableClose=true;
      config.data = null;
      const dialogRef = this.dialog.open(AddTeamComponent, config);
      dialogRef.componentInstance.schoolId = schoolId;
  
      dialogRef.afterClosed().subscribe(resp => {
        //console.log('resp', resp)
      })
  }

  searchByField() {
    // console.log('allSchoolDetail', this.allSchoolDetail)
    this.filterBySchoolId.valueChanges.subscribe(val => {
      // console.log('val', val);
      this.dataSource.data = val ? this.allSchoolDetail.filter(usr => usr.id.toString().includes(val)) : this.allSchoolDetail;
    })

    this.filterBySchoolName.valueChanges.subscribe(val => {
      this.dataSource.data = val ? this.allSchoolDetail.filter(usr => usr.name.toLowerCase().includes(val.toLowerCase())) : this.allSchoolDetail;
    })

    this.filterByContact.valueChanges.subscribe(val => {
      this.dataSource.data = val ? this.allSchoolDetail.filter(usr => usr.contactNum1.includes(val)) : this.allSchoolDetail;
    })

    this.filterByAddress.valueChanges.subscribe(val => {
      this.dataSource.data = val ? this.allSchoolDetail.filter(usr => usr?.address1?.toLowerCase()?.includes(val?.toLowerCase())) : this.allSchoolDetail;
    })

    this.filterByCity.valueChanges.subscribe(val => {
      this.dataSource.data = val ? this.allSchoolDetail.filter(usr => usr.city.toLowerCase().includes(val.toLowerCase())) : this.allSchoolDetail;
    })

    this.filterByPinCode.valueChanges.subscribe(val => {
      this.dataSource.data = val ? this.allSchoolDetail.filter(usr => usr.pincode.includes(val)) : this.allSchoolDetail;
    })

    this.filterByEmail.valueChanges.subscribe(val => {
      this.dataSource.data = val ? this.allSchoolDetail.filter(usr => usr.email.toLowerCase().includes(val.toLowerCase())) : this.allSchoolDetail;
    })

    this.filterByOutreachAllocated.valueChanges.subscribe(val => {
      this.dataSource.data = val ? this.allSchoolDetail.filter(usr => usr.outReachAllocated.toString().toLowerCase().includes(val.toLowerCase())) : this.allSchoolDetail;
    })

    this.filterByOutreachHeadAllocated.valueChanges.subscribe(val => {
      this.dataSource.data = val ? this.allSchoolDetail.filter(usr => usr.outReachHeadAllocated.toString().toLowerCase().includes(val.toLowerCase())) : this.allSchoolDetail;
    })

    this.filterByTrainingHeadAllocated.valueChanges.subscribe(val => {
      this.dataSource.data = val ? this.allSchoolDetail.filter(usr => usr.trainingHeadAllocated.toString().toLowerCase().includes(val.toLowerCase())) : this.allSchoolDetail;
    })
  }

  uploadSchoolCSV(evt: any) {
    if(evt.target.files && evt.target.files.length > 0) {
      const file : File = evt.target.files.item(0); 
        const reader: FileReader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
           const csv: string = reader.result as string;
           this.uploadCSV(file);
        }
     }
  }

  uploadCSV(file: any) {
    this.spinner.show();
    this.schoolService.uploadSchools(file).subscribe(resp => {
      this.loginService.showSuccess('Schools uploaded successfully.')
      this.getAllSchoolByCity()
      this.spinner.hide();
    }, err => {
      this.loginService.showError(err?.error?.message || 'Something went wrong')
      this.spinner.hide();
    })

  }
}
