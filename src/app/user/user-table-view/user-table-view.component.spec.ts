import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTableViewComponent } from './user-table-view.component';

describe('UserTableViewComponent', () => {
  let component: UserTableViewComponent;
  let fixture: ComponentFixture<UserTableViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserTableViewComponent]
    });
    fixture = TestBed.createComponent(UserTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
