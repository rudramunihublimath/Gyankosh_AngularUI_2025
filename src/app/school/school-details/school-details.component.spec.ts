import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolDetailsComponent } from './school-details.component';

describe('SchoolDetailsComponent', () => {
  let component: SchoolDetailsComponent;
  let fixture: ComponentFixture<SchoolDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchoolDetailsComponent]
    });
    fixture = TestBed.createComponent(SchoolDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
