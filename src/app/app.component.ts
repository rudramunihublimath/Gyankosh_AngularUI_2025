import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { LoginService } from './services/login.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ForgotPasswordComponent } from './credComponent/forgot-password/forgot-password.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'maitriBodh';
  currentRoute = ''; 
  isUserLoggedIn = false;
  loggedInUserDetails: any = null;
  isAuthorized = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private dialog: MatDialog,
    ) {
  }

  ngOnInit(): void {
    this.showNav();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
   });

   this.isUserLoggedIn = this.loginService.getUserDetails() ? true : false;
   this.loggedInUserDetails = JSON.parse(this.loginService.getUserDetails());
   this.isAuthorized = this.loggedInUserDetails?.nameofMyTeam === 'Central_Mool' || this.loggedInUserDetails?.nameofMyTeam === 'OutReach_Head' || this.loggedInUserDetails?.nameofMyTeam === 'TrainTheTrainer_Head';
  }

  showNav() {
    this.loginService.userLoginStatus.subscribe(sts => {
      this.isUserLoggedIn = sts;
      this.loggedInUserDetails = JSON.parse(this.loginService.getUserDetails());
      this.isAuthorized = this.loggedInUserDetails?.nameofMyTeam === 'Central_Mool' || this.loggedInUserDetails?.nameofMyTeam === 'OutReach_Head';
      //console.log('this.loggedInUserDetails', this.loggedInUserDetails)
    })
    // return !(this.currentRoute === '/login' || this.currentRoute === '/register' || this.currentRoute === '/')
  }

  navigateToProfile() {
    //console.log('navigateToProfile')
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
   this.router.navigate(['/user-profile']));
  }

  logout() {
    this.isUserLoggedIn = false;
    this.loginService.logout();
  }

  openForgotPasswordDialog() {
    const config = new MatDialogConfig(); 
    config.width= "40vw";
    config.disableClose=true;
    config.data = {forgotPassword: false};
    const dialog = this.dialog.open(ForgotPasswordComponent, config);

    dialog.afterClosed().subscribe(resp => {
      //console.log('resp', resp);
      // API CALL
    })
  }
}
