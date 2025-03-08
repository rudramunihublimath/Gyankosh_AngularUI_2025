import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementDialogComponent } from './agreement-dialog.component';

describe('AgreementDialogComponent', () => {
  let component: AgreementDialogComponent;
  let fixture: ComponentFixture<AgreementDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgreementDialogComponent]
    });
    fixture = TestBed.createComponent(AgreementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
