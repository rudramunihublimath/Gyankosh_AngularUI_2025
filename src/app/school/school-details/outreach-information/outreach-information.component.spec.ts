import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutreachInformationComponent } from './outreach-information.component';

describe('OutreachInformationComponent', () => {
  let component: OutreachInformationComponent;
  let fixture: ComponentFixture<OutreachInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OutreachInformationComponent]
    });
    fixture = TestBed.createComponent(OutreachInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
