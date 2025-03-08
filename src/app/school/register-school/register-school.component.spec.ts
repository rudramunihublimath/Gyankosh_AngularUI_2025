import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSchoolComponent } from './register-school.component';

describe('RegisterSchoolComponent', () => {
  let component: RegisterSchoolComponent;
  let fixture: ComponentFixture<RegisterSchoolComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterSchoolComponent]
    });
    fixture = TestBed.createComponent(RegisterSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
