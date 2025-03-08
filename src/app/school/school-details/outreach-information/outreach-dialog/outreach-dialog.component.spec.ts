import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutreachDialogComponent } from './outreach-dialog.component';

describe('OutreachDialogComponent', () => {
  let component: OutreachDialogComponent;
  let fixture: ComponentFixture<OutreachDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OutreachDialogComponent]
    });
    fixture = TestBed.createComponent(OutreachDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
