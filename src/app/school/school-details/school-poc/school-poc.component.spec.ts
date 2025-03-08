import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolPOCComponent } from './school-poc.component';

describe('SchoolPOCComponent', () => {
  let component: SchoolPOCComponent;
  let fixture: ComponentFixture<SchoolPOCComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchoolPOCComponent]
    });
    fixture = TestBed.createComponent(SchoolPOCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
