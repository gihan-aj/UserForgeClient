import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { merge, Subject, Subscription, takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogClose,
  MatDialogActions,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { RoleDetailsDialogType } from './role-details-dialog.type';
import { RoleDetails } from '../../interfaces/role-details.interface';
import { RoleDetailsDialogData } from './role-details-dilaog-data.interface';
import {
  ROLE_DESCRIPTION_MAX_LENGTH,
  ROLE_NAME_MAX_LENGTH,
  ROLE_NAME_MIN_LENGTH,
} from '../../../shared/constants/constraints';
import { MessageService } from '../../../shared/messages/message.service';
import { RoleManagementService } from '../../services/role-management.service';
import { ProtectedDataService } from '../../../shared/protected-data/protected-data.service';
import { CreateRoleRequest } from '../../interfaces/create-role-request.interface';
import { EditRoleDetailsRequest } from '../../interfaces/edit-role-details-request.interface';

@Component({
  selector: 'app-role-details-dialog',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatSlideToggleModule,
  ],
  templateUrl: './role-details-dialog.component.html',
  styleUrl: './role-details-dialog.component.scss',
})
export class RoleDetailsDialogComponent implements OnDestroy {
  readonly dialogRef = inject(MatDialogRef<RoleDetailsDialogComponent>);
  data = inject<RoleDetailsDialogData>(MAT_DIALOG_DATA);

  fb = inject(FormBuilder);

  mode = signal<RoleDetailsDialogType>(this.data.mode);

  selectedApp = this.data.app;

  role = signal<RoleDetails>(
    this.data.roleDetails
      ? {
          id: this.data.roleDetails.id,
          name: this.data.roleDetails.name,
          description: this.data.roleDetails.description,
          isActive: this.data.roleDetails.isActive,
        }
      : {
          id: '',
          name: '',
          description: '',
          isActive: true,
        }
  );

  viewOnly = computed(() => this.mode() === 'view');

  isProtectedRole = signal(false);

  nameMaxLength = ROLE_NAME_MAX_LENGTH;
  nameMinLength = ROLE_NAME_MIN_LENGTH;
  descriptionMaxLength = ROLE_DESCRIPTION_MAX_LENGTH;

  nameErrorMessage = signal('');
  descriptionErrorMessage = signal('');

  form = this.fb.group({
    id: [this.role().id],
    name: [
      this.role().name,
      [
        Validators.required,
        Validators.maxLength(this.nameMaxLength),
        Validators.minLength(this.nameMinLength),
      ],
    ],
    description: [
      this.role().description,
      [Validators.maxLength(this.descriptionMaxLength)],
    ],
    isActive: [{ value: this.role().isActive, disabled: true }],
  });

  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private msgService: MessageService,
    private protectedData: ProtectedDataService,
    private roleManagementService: RoleManagementService
  ) {
    if (
      this.data.roleDetails &&
      this.protectedData.isProtectedRole(this.data.roleDetails.name)
    ) {
      this.isProtectedRole.set(true);
    }

    merge(this.name!.statusChanges, this.name!.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateNameErrorMessages());

    merge(this.description!.statusChanges, this.description!.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateDescriptionErrorMessages());
  }

  get name() {
    return this.form.get('name');
  }

  get description() {
    return this.form.get('description');
  }

  updateNameErrorMessages(): void {
    if (this.name!.hasError('required')) {
      this.nameErrorMessage.set(
        this.msgService.getMessage(
          'roleManagement.validation.roleName.required'
        )
      );
    } else if (this.name!.hasError('minlength')) {
      this.nameErrorMessage.set(
        this.msgService.getMessage(
          'roleManagement.validation.roleName.minLength',
          { roleNameMinLnegth: this.nameMinLength.toString() }
        )
      );
    } else if (this.name!.hasError('maxlength')) {
      this.nameErrorMessage.set(
        this.msgService.getMessage(
          'roleManagement.validation.roleName.maxLength',
          { roleNameMaxLnegth: this.nameMaxLength.toString() }
        )
      );
    } else {
      this.nameErrorMessage.set('');
    }
  }

  updateDescriptionErrorMessages(): void {
    if (this.description!.hasError('maxlength')) {
      this.descriptionErrorMessage.set(
        this.msgService.getMessage(
          'roleManagement.validation.description.maxLength'
        )
      );
    } else {
      this.descriptionErrorMessage.set('');
    }
  }

  onEdit() {
    this.roleManagementService
      .confirmEdit(this.role())
      .pipe(takeUntil(this.destroy$))
      .subscribe((accepted) => {
        if (accepted) {
          this.mode.set('edit');
        }
      });
  }

  onSubmit() {
    if (this.form.valid) {
      const data = this.form.getRawValue();

      if (this.mode() === 'create') {
        const request: CreateRoleRequest = {
          roleName: data.name!,
          description: data.description,
          appId: this.selectedApp.id,
        };

        this.dialogRef.close(request);
      } else if (this.mode() === 'edit') {
        const request: EditRoleDetailsRequest = {
          roleId: data.id!,
          roleName: data.name!,
          description: data.description,
          appId: this.selectedApp.id,
        };

        this.dialogRef.close(request);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
