import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  title = 'Forgot Password';

  email: FormControl = new FormControl('', Validators.required);
  oldPWD: FormControl = new FormControl('');
  newPWD: FormControl = new FormControl('');

  constructor(
    private dialogRef: MatDialogRef<ForgotPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private loginService: LoginService,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    this.title = this.data.forgotPassword ? 'Forgot Password' : 'Change Password';
    if(!this.data.forgotPassword) {
      this.oldPWD.setValidators(Validators.required);
      this.newPWD.setValidators(Validators.required);
    }
  }

  close() {
    this.dialogRef.close();
  }

  isValid() {
    if(this.data.forgotPassword) {
      return !this.email.value;
    }

    return !(this.email.value && this.oldPWD.value && this.newPWD.value);
  }

  onSubmit() {
    this.data.forgotPassword ? this.forgotPassword() : this.changePassword();
  }

  forgotPassword() {
    this.loginService.forgotPassword(this.email.value).subscribe(resp => {
      this.loginService.showSuccess('Please Check Your Mail');
      this.dialogRef.close();
    });
  }

  changePassword() {
    const payload = {
      email: this.email.value, 
      oldPWD: this.oldPWD.value, 
      newPWD: this.newPWD.value
    }

    this.loginService.changePassword(payload).subscribe(resp => {
      this.loginService.showSuccess('Password Changed Successfully');
      this.dialogRef.close();
      this.loginService.logout();
      this.router.navigate(['/login']);
    })
  }

}
