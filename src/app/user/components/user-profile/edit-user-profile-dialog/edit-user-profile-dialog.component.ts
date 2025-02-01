import { Component, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge, Subscription } from 'rxjs';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';

import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { EditUserDetails } from './edit-user-details.interface';
import { DataValidationService } from '../../../../shared/services/data-validation.service';
import { DATE_FORMATS } from '../../../../shared/constants/date-formats';
import {
  FIRST_NAME_MAX_LENGTH,
  FIRST_NAME_MIN_LENGTH,
  LAST_NAME_MAX_LENGTH,
  LAST_NAME_MIN_LENGTH,
  USER_MIN_AGE,
} from '../../../../shared/constants/constraints';
import { MessageService } from '../../../../shared/messages/message.service';
import { MatIconModule } from '@angular/material/icon';
import { UpdateUserDetailsRequest } from '../../../interfaces/update-user-details-request.interface';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-edit-user-profile-dialog',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatIconModule,
  ],
  templateUrl: './edit-user-profile-dialog.component.html',
  styleUrl: './edit-user-profile-dialog.component.scss',
})
export class EditUserProfileDialogComponent {
  readonly dialogRef = inject(MatDialogRef<EditUserProfileDialogComponent>);
  data = inject<EditUserDetails>(MAT_DIALOG_DATA);
  fb = inject(FormBuilder);
  dataValidation = inject(DataValidationService);

  private dateFormat = DATE_FORMATS.display.dateInput;

  firstNameErrorMessage = signal('');
  lastNameErrorMessage = signal('');
  phoneNumberErrorMessage = signal('');
  dateOfBirthErrorMessage = signal('');

  firstNameMinLength = FIRST_NAME_MIN_LENGTH;
  firstNameMaxLength = FIRST_NAME_MAX_LENGTH;
  lastNameMinLength = LAST_NAME_MIN_LENGTH;
  lastNameMaxLength = LAST_NAME_MAX_LENGTH;
  minAge = USER_MIN_AGE;

  form = this.fb.group({
    firstName: [
      this.data.firstName,
      [
        Validators.required,
        Validators.minLength(this.firstNameMinLength),
        Validators.maxLength(this.firstNameMaxLength),
      ],
    ],
    lastName: [
      this.data.lastName,
      [
        Validators.required,
        Validators.minLength(this.lastNameMinLength),
        Validators.maxLength(this.lastNameMaxLength),
      ],
    ],
    email: [this.data.email],
    phoneNumber: [
      this.data.phoneNumber,
      Validators.pattern(/^[+]?[0-9]{7,15}$/),
    ],
    dateOfBirth: [
      moment(this.data.dateOfBirth).format(this.dateFormat) || '',
      [
        // Validators.pattern(/^\d{4}-\d{2}-\d{2}$/),
        this.dataValidation.minimumAgeValidator(this.minAge),
      ],
    ],
  });

  get firstName() {
    return this.form.get('firstName');
  }

  get lastName() {
    return this.form.get('lastName');
  }

  get email() {
    return this.form.get('email');
  }

  get phoneNumber() {
    return this.form.get('phoneNumber');
  }
  get dateOfBirth() {
    return this.form.get('dateOfBirth');
  }

  firstNameErrorSubscription: Subscription;
  lastNameErrorSubscription: Subscription;
  phoneNumberErrorSubscription: Subscription;
  dateOfBirthErrorSubscription: Subscription;

  constructor(private msgService: MessageService) {
    this.firstNameErrorSubscription = merge(
      this.firstName!.statusChanges,
      this.firstName!.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateFirstNameErrorMessages());

    this.lastNameErrorSubscription = merge(
      this.lastName!.statusChanges,
      this.lastName!.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateLastNameErrorMessages());

    this.phoneNumberErrorSubscription = merge(
      this.phoneNumber!.statusChanges,
      this.phoneNumber!.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updatePhoneNumberErrorMessages());

    this.dateOfBirthErrorSubscription = merge(
      this.dateOfBirth!.statusChanges,
      this.dateOfBirth!.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateDateOfBirthErrorMessages());
  }

  updateFirstNameErrorMessages(): void {
    if (this.firstName!.hasError('required')) {
      this.firstNameErrorMessage.set(
        this.msgService.getMessage(
          'user.validation.registration.firstName.required'
        )
      );
    } else if (this.firstName!.hasError('minlength')) {
      this.firstNameErrorMessage.set(
        this.msgService.getMessage(
          'user.validation.registration.firstName.minLength',
          { firstNameMinLnegth: this.firstNameMinLength.toString() }
        )
      );
    } else if (this.firstName!.hasError('maxlength')) {
      this.firstNameErrorMessage.set(
        this.msgService.getMessage(
          'user.validation.registration.firstName.maxLength',
          { firstNameMaxLnegth: this.firstNameMaxLength.toString() }
        )
      );
    } else {
      this.firstNameErrorMessage.set('');
    }
  }

  updateLastNameErrorMessages(): void {
    if (this.lastName!.hasError('required')) {
      this.lastNameErrorMessage.set(
        this.msgService.getMessage(
          'user.validation.registration.lastName.required'
        )
      );
    } else if (this.lastName!.hasError('minLength')) {
      this.lastNameErrorMessage.set(
        this.msgService.getMessage(
          'user.validation.registration.lastName.minLength',
          { lastNameMinLnegth: this.lastNameMinLength.toString() }
        )
      );
    } else if (this.lastName!.hasError('maxLength')) {
      this.lastNameErrorMessage.set(
        this.msgService.getMessage(
          'user.validation.registration.lastName.maxLength',
          { lastNameMaxLnegth: this.lastNameMaxLength.toString() }
        )
      );
    } else {
      this.lastNameErrorMessage.set('');
    }
  }

  updatePhoneNumberErrorMessages(): void {
    if (this.phoneNumber?.hasError('pattern')) {
      this.phoneNumberErrorMessage.set(
        this.msgService.getMessage(
          'user.validation.registration.phoneNumber.invalid'
        )
      );
    } else {
      this.phoneNumberErrorMessage.set('');
    }
  }

  updateDateOfBirthErrorMessages(): void {
    if (this.dateOfBirth?.hasError('invalidAge')) {
      this.dateOfBirthErrorMessage.set(
        this.msgService.getMessage(
          'user.validation.registration.dateOfBirth.invalidAge',
          { minAge: this.minAge.toString() }
        )
      );
    } else if (this.dateOfBirth?.hasError('matDatePickerParse')) {
      this.dateOfBirthErrorMessage.set(
        this.msgService.getMessage(
          'user.validation.registration.dateOfBirth.invalidFormat'
        )
      );
    } else {
      this.dateOfBirthErrorMessage.set('');
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const data = this.form.getRawValue();

      let formattedDate = null;
      if (_moment.isMoment(data.dateOfBirth)) {
        const date: _moment.Moment = data.dateOfBirth;
        formattedDate = date.format(this.dateFormat);
      }

      let phoneNumber = null;
      if (data.phoneNumber !== '') {
        phoneNumber = data.phoneNumber;
      }

      const request: UpdateUserDetailsRequest = {
        firstName: data.firstName!,
        lastName: data.lastName!,
        phoneNumber: phoneNumber!,
        dateOfBirth: formattedDate!,
      };
      this.dialogRef.close(request);
    }
  }
}
