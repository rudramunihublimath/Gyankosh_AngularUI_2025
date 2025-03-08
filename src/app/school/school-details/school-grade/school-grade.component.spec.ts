import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolGradeComponent } from './school-grade.component';

describe('SchoolGradeComponent', () => {
  let component: SchoolGradeComponent;
  let fixture: ComponentFixture<SchoolGradeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchoolGradeComponent]
    });
    fixture = TestBed.createComponent(SchoolGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
