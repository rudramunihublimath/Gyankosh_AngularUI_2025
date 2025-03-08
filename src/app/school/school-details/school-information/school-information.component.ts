import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, map, of, startWith } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { SchoolService } from 'src/app/services/school.service';
import { ResponseDto, SchoolDetail, UserReq } from 'src/app/types';

@Component({
  selector: 'app-school-information',
  templateUrl: './school-information.component.html',
  styleUrls: ['./school-information.component.scss']
})
export class SchoolInformationComponent implements OnInit, OnChanges {

  schoolForm!: FormGroup;

  countries: Array<string> = [];
  states: Array<string> = [];
  cities: Array<string> = [];
  boards: Array<string> = [];
  phases: Array<string> = [];

  countriesObject: any = null;
  statesObject: any = null;
  citiesObject: any = null;

  filteredCountries!: Observable<string[]>;

  loggedInUserDetails: UserReq | null = null; 
  isAuthorized = false;

  
  isInitialCountryLoad = true;
  isInitialStateLoad = true;
  isInitialCityLoad = true;

  @Input() schoolDetails!: SchoolDetail;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private schoolService: SchoolService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnChanges() {
    const params = this.activatedRoute.snapshot.params;
    if(params['id']) {
      this.loggedInUserDetails = JSON.parse(this.loginService.getUserDetails());
      this.isAuthorized = this.loggedInUserDetails?.nameofMyTeam === 'Central_Mool' || this.loggedInUserDetails?.nameofMyTeam === 'OutReach_Head';
      this.initializeForm();
    }
  }

  ngOnInit(): void {

    this.loggedInUserDetails = JSON.parse(this.loginService.getUserDetails());
    this.isAuthorized = this.loggedInUserDetails?.nameofMyTeam === 'Central_Mool' || this.loggedInUserDetails?.nameofMyTeam === 'OutReach_Head';
    // console.log('this.isAuthorized', this.isAuthorized)
   
    this.getTargetPhase();
    this.getBoards();
    this.getCountries();
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

  initializeForm() {
    this.schoolForm = this.fb.group({
      name: [this.schoolDetails.name],
      email: [this.schoolDetails.email],
      country: [this.schoolDetails.country],
      state: [this.schoolDetails.state],
      city: [this.schoolDetails.city],
      board: [this.schoolDetails.board],  
      contactNum1: [this.schoolDetails.contactNum1],
      contactNum2: [this.schoolDetails.contactNum2],
      chainofID: [this.schoolDetails.chainofID],
      address1: [this.schoolDetails.address1],
      // address2: [this.schoolDetails.address2],
      pincode: [this.schoolDetails.pincode],
      websiteURL: [this.schoolDetails.websiteURL],
      linkdinID: [this.schoolDetails.linkdinID],
      facebookID: [this.schoolDetails.facebookID],
      instaID: [this.schoolDetails.instaID],
      targetPhase: [this.schoolDetails.targetPhase],
      mbpPersonName: [this.schoolDetails.mbpPersonName],
      mbpPersonContactNum: [this.schoolDetails.mbpPersonContactNum],
      mbpPersonEmail: [this.schoolDetails.mbpPersonEmail],
      refPersonName: [this.schoolDetails.refPersonName],
      refPersonContactNum: [this.schoolDetails.refPersonContactNum],
      code: [this.schoolDetails.code],
    })

    // if(!this.isAuthorized) {
    //   // console.log('this.isAuthorized----1', this.isAuthorized)
    //   this.schoolForm.disable();
    // }

    this.searchCountry();
  }

  searchCountry() {
    this.filteredCountries = this.schoolForm.controls['country'].valueChanges.pipe(
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
      this.filteredCountries =  of(Object.values(resp));
      this.countriesObject = resp;

      if(this.isInitialCountryLoad) {
        const country = this.countries.find(ctry => ctry === this.schoolDetails?.country);
        const countryId = Object.keys(this.countriesObject).find(key => this.countriesObject[key] === this.schoolDetails?.country);
        
        if(countryId) {
          this.getStates(+countryId);
        }
        if(country) {
          this.schoolForm.controls['country'].patchValue(country);
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

          const state = this.states.find(state => state === this.schoolDetails?.state);
          const stateId = Object.keys(this.statesObject).find(key => this.statesObject[key] === this.schoolDetails?.state);
          
          if(stateId) {
            this.getCities(+stateId);
          }
          if(state) {
            this.schoolForm.controls['state'].patchValue(state);
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

          const city = this.cities.find(state => state === this.schoolDetails?.city);
  
          if(city) {
            this.schoolForm.controls['city'].patchValue(city);
          }
  
          this.isInitialCityLoad = false;
        }
  
      })
    }

    updateSchool() {
      const payload = this.schoolForm.getRawValue()
      // {...this.schoolDetails, ...this.schoolForm.getRawValue()};
      payload['chainofID'] = [0];
      payload.board = this.schoolForm.controls['board'].value;
      // delete payload.state;
      // delete payload.country;
      //console.log('payload', payload);
      this.spinner.show();
      this.schoolService.updateSchool(payload, this.schoolDetails.id).subscribe((resp: any) => {
        this.spinner.hide();
        this.loginService.showSuccess('School Details Updated Successfully');
        this.router.navigate(['/school']);
        //console.log('resp', resp);
      })
    }

}
