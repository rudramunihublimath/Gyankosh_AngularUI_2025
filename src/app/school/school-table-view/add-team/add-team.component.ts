import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { SchoolService } from 'src/app/services/school.service';
import { ResponseDto, UserReq } from 'src/app/types';

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.scss']
})
export class AddTeamComponent implements OnInit {

  teamForm!: FormGroup;
  loggedInUserDetails!: UserReq;
  isAuthorized = false;
  header = 'Add Team';
  teamList: Array<string> = [];
  schoolId!: number;
  existingUser:any = null;
  filteredUser: any = [];
  constructor(
    private dialogRef: MatDialogRef<AddTeamComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private loginService: LoginService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private schoolService: SchoolService,
  ) {

  }

  ngOnInit(): void {

    this.loggedInUserDetails = JSON.parse(this.loginService.getUserDetails());
    this.isAuthorized = this.loggedInUserDetails?.nameofMyTeam === 'Central_Mool' || this.loggedInUserDetails?.nameofMyTeam === 'OutReach_Head';
    this.header = this.data?.id ? 'Edit Team' : 'Add Team';

    this.getMBPTeam();  
  }

  getMBPTeam() {
    this.spinner.show();
    this.loginService.getMBPTeam().subscribe(resp => {
      this.spinner.hide();
      this.teamList = Object.values(resp).filter(val => val !== 'Central_Mool');
      this.initializeForm();
      this.searchUsers();
    })
  }

  initializeForm() {
    this.teamForm = this.fb.group({
      teamName: ['', Validators.required],
      userId: [null, Validators.required],
      newUserId: [null],
    })
  }

  selectedTeam(evt: MatSelectChange) {
    this.existingUser = null;
    this.teamForm.controls['userId']?.enable();
    this.teamForm.controls['userId']?.reset();
    this.getUsersAllocatedToSchool();
  }

  saveTeam(closeDialog: boolean) {

    const userId = this.teamForm.controls['userId']?.value?.id;
    const payload = {
      schoolId: this.schoolId,
      teamName: this.teamForm.controls['teamName']?.value,
      userId,
    }

    this.existingUser?.id ? this.editUserToSchool(closeDialog, payload) : this.addUserToSchool(closeDialog, payload)
  }

  addUserToSchool(closeDialog: boolean, payload: any) {
    
    this.schoolService.addUserToSchool(payload).subscribe(resp => {
    // console.log('resp', resp);
    if(closeDialog) {
      this.dialogRef.close(true);
    }
    this.loginService.showSuccess(`${this.teamForm.controls['teamName']?.value} Added Successfully`);

    }, err => {
      this.loginService.showError('Something Went Wrong');
    })
  }

  editUserToSchool(closeDialog: boolean, payload: any) {
    const newUserId = this.teamForm.controls['newUserId']?.value?.id;
    this.schoolService.editUserToSchool(payload, newUserId).subscribe(resp => {
    // console.log('resp', resp);
    if(closeDialog) {
      this.dialogRef.close(true);
    }
    this.loginService.showSuccess(`${this.teamForm.controls['teamName']?.value} Edited Successfully`);

    }, err => {
      this.loginService.showError('Something Went Wrong');
    })
  }

  getUsersAllocatedToSchool() {
    this.spinner.show();
    this.schoolService.getUsersAllocatedToSchool(this.schoolId).subscribe((resp: ResponseDto<any>) => {
      this.spinner.hide();
      // console.log('resp', resp)
      const userId = Object.keys(resp.message);
      // console.log('userId', userId)
      const userDetail: any = Object.values(resp.message)
      userDetail.forEach((elt: any, idx: number) => {
        elt['id'] = userId[idx];
      });
      // console.log('userDetail', userDetail);
      this.existingUser = userDetail?.find((elt: any) =>  elt?.nameofMyTeam === this.teamForm.controls['teamName']?.value);
      // console.log('this.existingUser', this.existingUser)
      if(this.existingUser) {
        this.teamForm.controls['userId']?.patchValue(this.existingUser);
        this.teamForm.controls['userId']?.disable();
      }
    })
  }

  selectedUser(evt: MatAutocompleteSelectedEvent) {
    // console.log('evt', evt)
  }

  searchUsers() {

    this.teamForm.controls['userId']?.valueChanges
    .pipe(debounceTime(500), distinctUntilChanged())
    .subscribe(val => {
      if(val) {
        // this.spinner.show();
        this.getUserSearchBook(val);

      }
    })

    this.teamForm.controls['newUserId']?.valueChanges
    .pipe(debounceTime(500), distinctUntilChanged())
    .subscribe(val => {
      if(val) {
        // this.spinner.show();
        this.getUserSearchBook(val);

      }
    })
  }

  getUserSearchBook(name: string) {
    this.schoolService.getUserSearchBook(this.teamForm.controls['teamName']?.value, name).subscribe(resp => {
      this.filteredUser = resp;
      // this.spinner.hide();

    }, err => {
      this.loginService.showError('Something Went Wrong');
    })
  }

  displayUser(user: any) {
    return user ? `${user.firstname} ${user.lastname}` : '';
  }

  displayNewUser(user: any) {
    return user ? `${user.firstname} ${user.lastname}` : '';
  }

  close() {
    this.dialogRef.close();
  }

}
