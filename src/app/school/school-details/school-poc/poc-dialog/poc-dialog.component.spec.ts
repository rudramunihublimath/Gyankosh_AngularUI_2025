import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PocDialogComponent } from './poc-dialog.component';

describe('PocDialogComponent', () => {
  let component: PocDialogComponent;
  let fixture: ComponentFixture<PocDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PocDialogComponent]
    });
    fixture = TestBed.createComponent(PocDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
