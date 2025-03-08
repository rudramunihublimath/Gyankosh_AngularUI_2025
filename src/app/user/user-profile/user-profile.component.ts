import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, map, startWith } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { SchoolService } from 'src/app/services/school.service';
import { UserService } from 'src/app/services/user.service';
import { ResponseDto, SchoolTableDetail, UserReq } from 'src/app/types';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  userProfileForm!: FormGroup;

  genderArr: Array<string> = ['Male', 'Female'];
  binaryQuetionArr: Array<string> = ['Yes', 'No'];
  countries: Array<string> = [];
  states: Array<string> = [];
  cities: Array<string> = [];
  schools: Array<SchoolTableDetail> = [];

  countriesObject: any = null;
  statesObject: any = null;
  citiesObject: any = null;


  filteredCountries!: Observable<string[]>;

  userDetail: UserReq | null = null; 
  loggedInUserDetails: UserReq | null = null; 

  isInitialCountryLoad = true;
  isInitialStateLoad = true;
  isInitialCityLoad = true;
  isInitialAllocatedSchoolLoad = true;

  isAuthorized = false;

  url: any = null;
  defaultImg: any = null;
  isUserLogoChanged = false;
  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private schoolService: SchoolService,
  ) {
    
  }

  ngOnInit(): void {
    this.loggedInUserDetails = JSON.parse(this.loginService.getUserDetails());
    this.isAuthorized = this.loggedInUserDetails?.nameofMyTeam === 'Central_Mool' || this.loggedInUserDetails?.nameofMyTeam === 'OutReach_Head' || this.loggedInUserDetails?.nameofMyTeam === 'TrainTheTrainer_Head';
    this.defaultImg = "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
    const queryParams = this.route.snapshot.queryParams;
    if(queryParams['id']) {
      this.getUserById(queryParams['id']);
    } else {
      this.spinner.show();
      this.userDetail = JSON.parse(this.loginService.getUserDetails());
      // 'https://maitribodh.org/images/header/logo_side.png?v=20231112201126'
      if(this.userDetail?.imageName?.includes('http') || this.userDetail?.imageName?.includes('https')) {
        this.url = this.userDetail?.imageName;
      } else {
        const imageName = this.userDetail?.imageName?.split("\\").pop();
        this.url = imageName ? `/assets/Maitribodh_Photo/${imageName}` : null;
      }
      this.initializeUserProfileForm();

      setTimeout(() => {
        this.spinner.hide();
      }, 500);
    }
  }

  initializeUserProfileForm() {
    this.userProfileForm = this.fb.group({
      firstname: [this.userDetail?.firstname],
      lastname: [this.userDetail?.lastname],
      email: [this.userDetail?.email],
      pannum: [this.userDetail?.pannum],
      gender: [this.userDetail?.gender === 'MALE' ? 'Male' : 'Female'],
      country: [this.userDetail?.country],
      state: [this.userDetail?.state],
      city: [this.userDetail?.city],    
      address1: [this.userDetail?.address1],
      // address2: [this.userDetail?.address2],
      pincode: [this.userDetail?.pincode],
      contactNum1: [this.userDetail?.contactNum1],
      contactNum2: [this.userDetail?.contactNum2],
      linkdinID: [this.userDetail?.linkdinID],
      facebookID: [this.userDetail?.facebookID],
      instaID: [this.userDetail?.instaID],
      dob: [this.userDetail?.dob],
      citiesAllocated: [this.userDetail?.citiesAllocated],
      reportingmanagerId: [this.userDetail?.reportingmanagerId],
      profileActive: [this.userDetail?.profileActive],
      // schoolAllocated: [this.userDetail?.schoolAllocated}],
    })

    this.getAllSchoolByCity(this.userProfileForm.controls['citiesAllocated']?.value);
    this.getCountries();
    this.searchCountry();

  }

  getUserEmail() {
    this.userService.emitEmail.subscribe(email => {
      this.getUserByEmail(email);
    })
  }

  getUserByEmail(email: string) {
    this.spinner.show();
    this.userService.getUserByEmail(email).subscribe((resp: ResponseDto<UserReq>) => {
      this.userDetail = resp.message;
      this.initializeUserProfileForm();
      this.spinner.hide();
    })
  }

  getUserById(id: string) {
    this.spinner.show();
    this.userService.getUserById(id).subscribe((resp: ResponseDto<UserReq>) => {
      this.userDetail = resp.message;
      if(this.userDetail?.imageName?.includes('http') || this.userDetail?.imageName?.includes('https')) {
        this.url = this.userDetail?.imageName;
      } else {
        const imageName = this.userDetail?.imageName?.split("\\").pop();
        this.url = imageName ? `/assets/Maitribodh_Photo/${imageName}` : null;
      }
      // console.log('this.url', this.url)
      if(this.loggedInUserDetails?.id === this.userDetail?.id) {
        this.loginService.setUserDetails(this.userDetail);
      }
      this.initializeUserProfileForm();
      this.spinner.hide();
    })
  }

  updateUser() {
    const payload = {...this.userDetail, ...this.userProfileForm.getRawValue()};
    payload.gender = this.userProfileForm.controls['gender'].value.toUpperCase();

    if(typeof this.userProfileForm.controls['dob'].value !== 'string') {
      payload.dob = this.formatDate(this.userProfileForm.controls['dob'].value);
    }

    if(this.userProfileForm.controls['profileActive'].value) {
      payload.profileNOTActiveUpdatedby = this.loggedInUserDetails?.id === this.userDetail?.id ? this.userDetail?.id : this.userDetail?.reportingmanagerId;
    }

    delete payload.jwtToken;
    delete payload.refreshToken;
    this.spinner.show();
    this.userService.updateUser(payload).subscribe(resp => {
      this.loginService.showSuccess('User Details Updated');
      if(this.userDetail?.profileActive) {
        this.userDetail.profileActive = this.userProfileForm.controls['profileActive'].value;
      }
      if(this.loggedInUserDetails?.id === this.userDetail?.id) {
        this.getUserById(this.loggedInUserDetails?.id as any);
      }
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

  searchCountry() {
    this.filteredCountries = this.userProfileForm.controls['country'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.countries.filter(ctry => ctry.toLowerCase().includes(filterValue));
  }

  getCountries() {
    this.loginService.getCountries().subscribe(resp => {
      this.countries = Object.values(resp);
      this.countriesObject = resp;

      if(this.isInitialCountryLoad) {
        const country = this.countries.find(ctry => ctry === this.userDetail?.country);
        const countryId = Object.keys(this.countriesObject).find(key => this.countriesObject[key] === this.userDetail?.country);
        
        if(countryId) {
          this.getStates(+countryId);
        }
        if(country) {
          this.userProfileForm.controls['country'].patchValue(country);
        }

        this.isInitialCountryLoad = false;
      }


    })
  }

  selectedCountry(evt: MatAutocompleteSelectedEvent) {
  const countryId = Object.keys(this.countriesObject).find(key => this.countriesObject[key] === evt.option.value);
  if(countryId) {
    this.getStates(+countryId);
  }
  }

  getStates(countryId: number) {
    this.loginService.getStates(countryId).subscribe(resp => {
      this.states = Object.values(resp);
      this.statesObject = resp;

      if(this.isInitialStateLoad) {

        const state = this.states.find(state => state === this.userDetail?.state);
        const stateId = Object.keys(this.statesObject).find(key => this.statesObject[key] === this.userDetail?.state);
        
        if(stateId) {
          this.getCities(+stateId);
        }
        if(state) {
          this.userProfileForm.controls['state'].patchValue(state);
        }

        this.isInitialStateLoad = false;
      }

    })
  }

  selectedState(evt: MatSelectChange) {
    const stateId = Object.keys(this.statesObject).find(key => this.statesObject[key] === evt.value);
    if(stateId) {
      this.getCities(+stateId);
    }
    
  }

  getCities(stateId: number) {
    this.loginService.getCities(stateId).subscribe(resp => {
      this.cities = Object.values(resp);

      if(this.isInitialCityLoad) {

        const city = this.cities.find(state => state === this.userDetail?.city);

        if(city) {
          this.userProfileForm.controls['city'].patchValue(city);
        }

        this.isInitialCityLoad = false;
      }

    })
  }

  selectedCities(evt: MatSelectChange) {
    if(evt.value) {
      this.getAllSchoolByCity(evt.value);
    }
      
  }
  
  getAllSchoolByCity(cities: Array<string>) {
    //console.log('cities', cities)
    this.schoolService.getAllSchoolByCity(cities).subscribe((resp: any) => {
      this.schools = Object.values(resp);
      //console.log('this.schools', this.schools)
    })
  }

  addUserImage(evt: any) {
    // console.log('evt', evt)
    if(evt.target.files && evt.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(evt.target.files[0]); //read file as data url
      // console.log('evt.target.files', evt.target.files)

      reader.onload = () => {
        this.url = reader.result;
        // console.log('reader', reader)
        this.isUserLogoChanged = true;
        this.uploadUserImage(evt.target.files[0]);
      }
    }
  }

  
  uploadUserImage(file: any) {
    this.spinner.show();
    this.userService.uploadUserImage(this.loggedInUserDetails?.id as number, file).subscribe(resp => {
      // console.log('resp', resp)
      this.spinner.hide();
      this.loginService.showSuccess('Profile Added Successfully');
      if(this.loggedInUserDetails?.id === this.userDetail?.id) {
        this.getUserById(this.loggedInUserDetails?.id as any);
      }
    })
  }
  
  removeUserImage() {
    this.url = null;
    this.userService.removeUserImage(this.loggedInUserDetails?.id as number).subscribe(resp => {
      this.spinner.hide();
      this.loginService.showSuccess('Profile Removed Successfully');
      if(this.loggedInUserDetails?.id === this.userDetail?.id) {
        this.getUserById(this.loggedInUserDetails?.id as any);
      }
    })
  }


  navigateToProfile() {
    if(this.userProfileForm.get('reportingmanagerId')?.value) {
      const id = this.userProfileForm.get('reportingmanagerId')?.value
      const link = `/user-profile?id=${id}`;
      window.open(link, '_blank');
    }
  }

}
