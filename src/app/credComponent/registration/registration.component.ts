import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Observable, map, startWith } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { SchoolService } from 'src/app/services/school.service';
import { SchoolDetail, SchoolTableDetail, UserReq } from 'src/app/types';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ]
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  personalDetailsForm!: FormGroup;
  contactDetailsForm!: FormGroup;
  socialInfoForm!: FormGroup;
  
  genderArr: Array<{value: string, viewValue: string}> = [
    {value: 'MALE', viewValue: 'Male'},
    {value: 'FEMALE', viewValue: 'Female'},

  ];
  countries: Array<string> = [];
  states: Array<string> = [];
  cities: Array<string> = [];
  teamList: Array<string> = [];

  countriesObject: any = null;
  statesObject: any = null;
  citiesObject: any = null;

  filteredCountries!: Observable<string[]>;

  isLinear = false;

  schools: Array<SchoolTableDetail> = [];

  loggedInUserDetails: UserReq | null = null; 

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private dialogRef: MatDialogRef<RegistrationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private schoolService: SchoolService,
  ) {

  }

  ngOnInit(): void {
    this.loggedInUserDetails = JSON.parse(this.loginService.getUserDetails());
    this.getMBPTeam();
    this.getCountries();
    // this.getCountries();
    this.initializeRegistrationForm();
  }

  initializeRegistrationForm() {

    this.personalDetailsForm = this.fb.group({
      firstname: [''],
      lastname: [''],
      email: [''],
      password: [''],
      confirmPassword: [],
      //pannum: [''],
      gender: [''],
      dob: [''],
    });
    this.contactDetailsForm = this.fb.group({
      country: [''],
      state: [''],
      city: [''],    
      address1: [''],
      // address2: [''],
      pincode: [''],
      contactNum1: [''],
      contactNum2: [''],
    });

    this.socialInfoForm = this.fb.group({
      linkdinID: [''],
      facebookID: [''],
      instaID: [''],
      reportingmanagerId: [this.loggedInUserDetails?.email],
      nameofMyTeam: [''],
      citiesAllocated: [[]],
      // schoolAllocated: [[]],
    });

    this.searchCountry();

  }

  searchCountry() {
    this.filteredCountries = this.contactDetailsForm.controls['country'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.countries.filter(ctry => ctry.toLowerCase().includes(filterValue));
  }

  saveRegistration() {
    const payload = {...this.personalDetailsForm.getRawValue(), ...this.contactDetailsForm.getRawValue(), ...this.socialInfoForm.getRawValue()};
    payload.dob = this.formatDate(this.personalDetailsForm.controls['dob'].value);
    payload.reportingmanagerId = this.loggedInUserDetails?.id;
    
    this.loginService.register(payload).subscribe(resp => {
      this.loginService.showSuccess('Member Added Sucessfully')
      this.dialogRef.close(true);
      // this.router.navigate(['/user-details'])
    },
    (err) => {
      this.loginService.openSnackBar('Please enter required details', 'REGISTRATION FAILED');
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

  getMBPTeam() {
    this.loginService.getMBPTeam().subscribe(resp => {
      this.teamList = Object.values(resp);

    })
  }

  getCountries() {
    this.loginService.getCountries().subscribe(resp => {
      this.countries = Object.values(resp);
      this.countriesObject = resp;

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

    })
  }

  selectedCities(evt: MatSelectChange) {
  if(evt.value) {
    this.getAllSchoolByCity(evt.value);
  }
    
  }

  getAllSchoolByCity(cities: Array<string>) {
    this.schoolService.getAllSchoolByCity(cities).subscribe((resp: any) => {
      this.schools = resp;
    })
  }

  close() {
    this.dialogRef.close();
  }
}
