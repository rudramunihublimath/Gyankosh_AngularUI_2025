import { Component, Input, OnInit } from '@angular/core';
import { SchoolDetail } from 'src/app/types';

@Component({
  selector: 'app-outreach-trainer-info',
  templateUrl: './outreach-trainer-info.component.html',
  styleUrls: ['./outreach-trainer-info.component.scss']
})
export class OutreachTrainerInfoComponent implements OnInit {

  @Input() schoolDetails!: SchoolDetail;
  constructor() {

  }

  ngOnInit(): void {
    
  }
}
