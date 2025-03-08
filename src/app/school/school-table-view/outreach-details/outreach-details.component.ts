import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { SchoolService } from 'src/app/services/school.service';

@Component({
  selector: 'app-outreach-details',
  templateUrl: './outreach-details.component.html',
  styleUrls: ['./outreach-details.component.scss']
})
export class OutreachDetailsComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<OutreachDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private schoolService: SchoolService,
    private spinner: NgxSpinnerService,
  ) {

  }

  ngOnInit(): void {
    
  }

  getTeamName(nameofMyTeam: string) {
  let name = ''; 
    switch (nameofMyTeam) {
      case 'OutReach':
        name = 'Out Reach';
        break;
      case 'OutReach_Head':
        name = 'Out Reach Head';
        break;
      case 'TrainTheTrainer':
        name = 'Train The Trainer';
        break;
      case 'TrainTheTrainer_Head':
        name = 'Train The Trainer Head';
        break;
    
      default:
        break;
    }

    return name;

  }

  close() {
    this.dialogRef.close();
  }
}
