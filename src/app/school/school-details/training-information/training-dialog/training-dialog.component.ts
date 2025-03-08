import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'src/app/services/login.service';
import { SchoolService } from 'src/app/services/school.service';
import { UserReq, Trainer, ResponseDto } from 'src/app/types';
import { OutreachDialogComponent } from '../../outreach-information/outreach-dialog/outreach-dialog.component';

@Component({
  selector: 'app-training-dialog',
  templateUrl: './training-dialog.component.html',
  styleUrls: ['./training-dialog.component.scss']
})
export class TrainingDialogComponent implements OnInit {

  trainerForm!: FormGroup;

  loggedInUserDetails!: UserReq;

  isAuthorized = false;

  header = 'Add Training Info';

  binaryAns = ['Yes', 'No'];
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<OutreachDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private schoolService: SchoolService,
    private loginService: LoginService,
    private spinner: NgxSpinnerService,
  ) {

  }

  ngOnInit(): void {
    this.loggedInUserDetails = JSON.parse(this.loginService.getUserDetails());
    this.isAuthorized = this.loggedInUserDetails?.nameofMyTeam === 'Central_Mool' || this.loggedInUserDetails?.nameofMyTeam === 'OutReach_Head' || this.loggedInUserDetails?.nameofMyTeam === 'TrainTheTrainer_Head';
    this.header = this.data['id'] ? 'Edit Training Info' : 'Add Training Info';

    this.initializeForm();
  }
  
  initializeForm() {
    const trainerDetail = this.data;
    this.trainerForm = this.fb.group({
      // trainTheTrainersId: [trainerDetail.id ? trainerDetail.trainTheTrainersId : ''],
      // trainTheTrainerHeadId: [trainerDetail.id ? trainerDetail.trainTheTrainerHeadId : ''],
      trainingPartCompleted: [trainerDetail.id ? trainerDetail.trainingPartCompleted : 'No'],
      dateofCompletion: [trainerDetail.id ? trainerDetail.dateofCompletion : new Date()],
      dataValidated: [trainerDetail.id ? trainerDetail.dataValidated : 'No'],
    })
  }

  submitTrainer() {
    this.spinner.show();
    const payload: Trainer = this.trainerForm.getRawValue();
    if(this.trainerForm.controls['dateofCompletion'].value && typeof this.trainerForm.controls['dateofCompletion'].value !== 'string') {
      payload.dateofCompletion = this.formatDate(this.trainerForm.controls['dateofCompletion'].value);
    }
    this.data['id'] ? this.updateTrainer(payload) : this.saveTrainer(payload);
  }

  saveTrainer(payload: Trainer) {
    this.schoolService.saveTrainer(payload, this.data.schoolId).subscribe((resp: ResponseDto<Trainer>) => {
      this.loginService.showSuccess('Trainer Added Successfully');
      this.dialogRef.close(true);

    }, err => {
      this.spinner.hide();
    })
  }

  updateTrainer(payload: Trainer) {
    payload.id = this.data.id;
    this.schoolService.updateTrainer(payload, this.data.schoolId).subscribe((resp: ResponseDto<Trainer>) => {
      this.loginService.showSuccess('Trainer Updated Successfully');
      this.dialogRef.close(true);

    }, (err) => {
      //console.log('err', err)
      this.loginService.showError('Something went wrong')
      this.spinner.hide();
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

  close() {
    this.dialogRef.close();
  }

}
