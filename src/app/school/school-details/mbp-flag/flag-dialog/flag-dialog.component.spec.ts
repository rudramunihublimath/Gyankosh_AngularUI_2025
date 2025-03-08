import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlagDialogComponent } from './flag-dialog.component';

describe('FlagDialogComponent', () => {
  let component: FlagDialogComponent;
  let fixture: ComponentFixture<FlagDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FlagDialogComponent]
    });
    fixture = TestBed.createComponent(FlagDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
