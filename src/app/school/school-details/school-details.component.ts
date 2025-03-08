import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SchoolService } from 'src/app/services/school.service';
import { ResponseDto, SchoolDetail } from 'src/app/types';

@Component({
  selector: 'app-school-details',
  templateUrl: './school-details.component.html',
  styleUrls: ['./school-details.component.scss']
})
export class SchoolDetailsComponent implements OnInit {

  schoolDetails!: SchoolDetail;

  constructor(
    private schoolService: SchoolService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;
    if(params['id']) {
      this.getSchoolById(params['id']);
    }
  }

  getSchoolById(id: number) {
    this.spinner.show();
    this.schoolService.getSchoolById(id).subscribe((resp: ResponseDto<SchoolDetail>) => {
      this.spinner.hide();
      this.schoolDetails = resp.message;
    })
  }

}
