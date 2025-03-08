import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, map, of, startWith } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { SchoolService } from 'src/app/services/school.service';
import { UserService } from 'src/app/services/user.service';
import { UserReq } from 'src/app/types';

@Component({
  selector: 'app-register-school',
  templateUrl: './register-school.component.html',
  styleUrls: ['./register-school.component.scss']
})
export class RegisterSchoolComponent implements OnInit {

  registerSchoolForm!: FormGroup;

  countries: Array<string> = [];
  states: Array<string> = [];
  cities: Array<string> = [];
  boards: Array<string> = ['State Board', 'CBSE', 'ICSE'];
  phases: Array<string> = ['MiniPilot'];

  countriesObject: any = null;
  statesObject: any = null;
  citiesObject: any = null;

  filteredCountries!: Observable<string[]>;

  loggedInUserDetails: UserReq | null = null; 
  isAuthorized = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private schoolService: SchoolService,
    private spinner: NgxSpinnerService,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    this.loggedInUserDetails = JSON.parse(this.loginService.getUserDetails());
    this.isAuthorized = this.loggedInUserDetails?.nameofMyTeam === 'Central_Mool' || this.loggedInUserDetails?.nameofMyTeam === 'OutReach_Head';
    this.getTargetPhase();
    this.getBoards();
    this.getCountries();
    this.initializeForm();
  }

  initializeForm() {
    this.registerSchoolForm = this.fb.group({
      name: [''],
      email: [''],
      country: [''],
      state: [''],
      city: [''],
      board: [''],  
      contactNum1: [''],
      contactNum2: [''],
      chainofID: [''],
      address1: [''],
      // address2: [''],
      pincode: [''],
      websiteURL: [''],
      linkdinID: [''],
      facebookID: [''],
      instaID: [''],
      targetPhase: [''],
      mbpPersonName: [''],
      mbpPersonContactNum: [''],
      mbpPersonEmail: [''],
      refPersonName: [''],
      refPersonContactNum: ['']
    })

    this.searchCountry();
  }

  searchCountry() {
    this.filteredCountries = this.registerSchoolForm.controls['country'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.countries.filter(ctry => ctry.toLowerCase().includes(filterValue));
  }

  getTargetPhase() {
    this.schoolService.getTargetPhase().subscribe(resp => {
      this.phases = Object.values(resp);
    });
  }

  getBoards() {
    this.schoolService.getBoards().subscribe(resp => {
      this.boards = Object.values(resp);
    })
  }

  getCountries() {
    this.loginService.getCountries().subscribe(resp => {
      this.countries = Object.values(resp);
      this.filteredCountries =  of(Object.values(resp));
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

    addSchool() {
      const payload = this.registerSchoolForm.getRawValue();
      payload['chainofID'] = [0];
      payload.board = this.registerSchoolForm.controls['board'].value;
      this.spinner.show();
      this.schoolService.saveSchool(payload).subscribe((resp: any) => {
        this.spinner.hide();
        this.loginService.showSuccess('School Registered Successfully');
        this.router.navigate(['/school']);
      })
    }
}
