import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutreachDetailsComponent } from './outreach-details.component';

describe('OutreachDetailsComponent', () => {
  let component: OutreachDetailsComponent;
  let fixture: ComponentFixture<OutreachDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OutreachDetailsComponent]
    });
    fixture = TestBed.createComponent(OutreachDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
