import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutreachTrainerInfoComponent } from './outreach-trainer-info.component';

describe('OutreachTrainerInfoComponent', () => {
  let component: OutreachTrainerInfoComponent;
  let fixture: ComponentFixture<OutreachTrainerInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OutreachTrainerInfoComponent]
    });
    fixture = TestBed.createComponent(OutreachTrainerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
