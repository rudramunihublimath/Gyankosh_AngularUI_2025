import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingDialogComponent } from './meeting-dialog.component';

describe('MeetingDialogComponent', () => {
  let component: MeetingDialogComponent;
  let fixture: ComponentFixture<MeetingDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingDialogComponent]
    });
    fixture = TestBed.createComponent(MeetingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
