import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolAgreementComponent } from './school-agreement.component';

describe('SchoolAgreementComponent', () => {
  let component: SchoolAgreementComponent;
  let fixture: ComponentFixture<SchoolAgreementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchoolAgreementComponent]
    });
    fixture = TestBed.createComponent(SchoolAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
