import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolMeetingNotesComponent } from './school-meeting-notes.component';

describe('SchoolMeetingNotesComponent', () => {
  let component: SchoolMeetingNotesComponent;
  let fixture: ComponentFixture<SchoolMeetingNotesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchoolMeetingNotesComponent]
    });
    fixture = TestBed.createComponent(SchoolMeetingNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
