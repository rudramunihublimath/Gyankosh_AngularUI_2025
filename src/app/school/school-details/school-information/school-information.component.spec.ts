import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolInformationComponent } from './school-information.component';

describe('SchoolInformationComponent', () => {
  let component: SchoolInformationComponent;
  let fixture: ComponentFixture<SchoolInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchoolInformationComponent]
    });
    fixture = TestBed.createComponent(SchoolInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
