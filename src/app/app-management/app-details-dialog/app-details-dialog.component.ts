import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';

import { AppDetailsDialogData } from './app-details-dialog.interface';
import { AppDetailsDialogType } from './app-details-dialog.type';
import { AppDetails } from '../app-details.interface';
import {
  APP_NAME_MAX_LENGTH,
  APP_NAME_MIN_LENGTH,
  APP_DESCRIPTION_MAX_LENGTH,
} from '../../shared/constants/constraints';
import { MessageService } from '../../shared/messages/message.service';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProtectedDataService } from '../../shared/protected-data/protected-data.service';
import { ConfirmationService } from '../../shared/widgets/confirmation-dialog/confirmation.service';
import { CreateAppRequest } from '../interfaces/create-app-request.interface';
import { UpdateAppDetailsRequest } from '../interfaces/update-app-details-request.interface';

@Component({
  selector: 'app-app-details-dialog',
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
  templateUrl: './app-details-dialog.component.html',
  styleUrl: './app-details-dialog.component.scss',
})
export class AppDetailsDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AppDetailsDialogComponent>);
  data = inject<AppDetailsDialogData>(MAT_DIALOG_DATA);

  fb = inject(FormBuilder);

  mode = signal<AppDetailsDialogType>(this.data.mode);

  appDetails = signal<AppDetails>(
    this.data.appDetails
      ? {
          id: this.data.appDetails.id,
          name: this.data.appDetails.name,
          description: this.data.appDetails.description,
          baseUrl: this.data.appDetails.baseUrl,
          isActive: this.data.appDetails.isActive,
        }
      : {
          id: 0,
          name: '',
          description: '',
          baseUrl: '',
          isActive: true,
        }
  );

  viewOnly = computed(() => this.mode() === 'view');

  isProtectedApp = signal(false);

  nameMaxLength = APP_NAME_MAX_LENGTH;
  nameMinLength = APP_NAME_MIN_LENGTH;
  descriptionMaxLength = APP_DESCRIPTION_MAX_LENGTH;
  nameErrorMessage = signal('');
  descriptionErrorMessage = signal('');

  form = this.fb.group({
    id: [this.appDetails().id],
    name: [
      this.appDetails().name,
      [
        Validators.required,
        Validators.maxLength(this.nameMaxLength),
        Validators.minLength(this.nameMinLength),
      ],
    ],
    description: [
      this.appDetails().description,
      [Validators.maxLength(this.descriptionMaxLength)],
    ],
    baseUrl: [this.appDetails().baseUrl],
    isActive: [{ value: this.appDetails().isActive, disabled: true }],
  });

  constructor(
    private msgService: MessageService,
    private protectedData: ProtectedDataService,
    private confirm: ConfirmationService
  ) {
    if (
      this.data.appDetails &&
      this.protectedData.isProtectedApp(this.data.appDetails.name)
    ) {
      this.isProtectedApp.set(true);
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
        this.msgService.getMessage('appManagement.validation.name.required')
      );
    } else if (this.name!.hasError('minlength')) {
      this.nameErrorMessage.set(
        this.msgService.getMessage('appManagement.validation.name.minLength', {
          appNameMinLnegth: this.nameMinLength.toString(),
        })
      );
    } else if (this.name!.hasError('maxlength')) {
      this.nameErrorMessage.set(
        this.msgService.getMessage('appManagement.validation.name.maxLength', {
          appNameMaxLnegth: this.nameMaxLength.toString(),
        })
      );
    } else {
      this.nameErrorMessage.set('');
    }
  }

  updateDescriptionErrorMessages(): void {
    if (this.description!.hasError('maxlength')) {
      this.descriptionErrorMessage.set(
        this.msgService.getMessage(
          'appManagement.validation.description.maxLength'
        )
      );
    } else {
      this.descriptionErrorMessage.set('');
    }
  }

  onEdit() {
    this.confirm
      .fetchMessagesAndConfirm(
        'warning',
        'appManagement.confirmation.editApp.title',
        'appManagement.confirmation.editApp.message',
        'appManagement.confirmation.editApp.action',
        { appName: this.appDetails().name }
      )
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
        const request: CreateAppRequest = {
          name: data.name!,
          description: data.description,
          baseUrl: data.baseUrl,
        };

        this.dialogRef.close(request);
      } else if (this.mode() === 'edit') {
        const request: UpdateAppDetailsRequest = {
          id: data.id!,
          name: data.name!,
          description: data.description,
          baseUrl: data.baseUrl,
        };

        this.dialogRef.close(request);
      }
    }
  }
}
