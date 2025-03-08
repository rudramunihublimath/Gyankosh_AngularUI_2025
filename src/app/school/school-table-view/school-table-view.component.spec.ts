import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolTableViewComponent } from './school-table-view.component';

describe('SchoolTableViewComponent', () => {
  let component: SchoolTableViewComponent;
  let fixture: ComponentFixture<SchoolTableViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchoolTableViewComponent]
    });
    fixture = TestBed.createComponent(SchoolTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
