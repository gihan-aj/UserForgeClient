import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRolesDialogComponent } from './user-roles-dialog.component';

describe('UserRolesDialogComponent', () => {
  let component: UserRolesDialogComponent;
  let fixture: ComponentFixture<UserRolesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRolesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRolesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
