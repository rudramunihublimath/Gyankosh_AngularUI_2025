import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MbpFlagComponent } from './mbp-flag.component';

describe('MbpFlagComponent', () => {
  let component: MbpFlagComponent;
  let fixture: ComponentFixture<MbpFlagComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MbpFlagComponent]
    });
    fixture = TestBed.createComponent(MbpFlagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
