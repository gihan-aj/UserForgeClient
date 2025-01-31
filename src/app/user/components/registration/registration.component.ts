import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { merge, Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';

import { MatButtonModule } from '@angular/material/button';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { MessageService } from '../../../shared/messages/message.service';
import {
  ABSOLUTE_ROUTES,
  DEFAULT_RETURN_URL,
} from '../../../shared/constants/absolute-routes';
import {
  EMAIL_MAX_LENGTH,
  FIRST_NAME_MAX_LENGTH,
  FIRST_NAME_MIN_LENGTH,
  LAST_NAME_MAX_LENGTH,
  LAST_NAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USER_MIN_AGE,
} from '../../../shared/constants/constraints';
import { UserService } from '../../services/user.service';
import { ErrorHandlingService } from '../../../shared/error-handling/error-handling.service';
import { AuthService } from '../../../shared/services/auth.service';
import { NotificationService } from '../../../shared/widgets/notification/notification.service';
import { LoadingContainerComponent } from '../../../shared/widgets/loading-container/loading-container.component';
import { DataValidationService } from '../../../shared/services/data-validation.service';
import { DATE_FORMATS } from '../../../shared/constants/date-formats';
import { RegistrationRequest } from './registration-request';
import { AlertType } from '../../../shared/widgets/alert/alert-type.enum';
import { AlertService } from '../../../shared/widgets/alert/alert.service';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-registration',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    LoadingContainerComponent,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent implements OnDestroy {
  msgService = inject(MessageService);
  fb = inject(FormBuilder);
  dataValidation = inject(DataValidationService);

  loading = signal(false);

  loginUrl = ABSOLUTE_ROUTES.user.userLogin;
  private dateFormat = DATE_FORMATS.display.dateInput;

  firstNameErrorMessage = signal('');
  lastNameErrorMessage = signal('');
  emailErrorMessage = signal('');
  phoneNumberErrorMessage = signal('');
  dateOfBirthErrorMessage = signal('');
  passwordErrorMessage = signal('');
  confirmPasswordErrorMessage = signal('');

  defaultReturnUrl = DEFAULT_RETURN_URL;
  returnUrl: string | null = null;

  firstNameMinLength = FIRST_NAME_MIN_LENGTH;
  firstNameMaxLength = FIRST_NAME_MAX_LENGTH;
  lastNameMinLength = LAST_NAME_MIN_LENGTH;
  lastNameMaxLength = LAST_NAME_MAX_LENGTH;
  emailMaxLength = EMAIL_MAX_LENGTH;
  passwordMinLength = PASSWORD_MIN_LENGTH;
  passwordMaxLength = PASSWORD_MAX_LENGTH;
  minAge = USER_MIN_AGE;

  hidePassword = signal(true);
  passwordVisibiltyToggle(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  hideConfirmPassword = signal(true);
  confirmPasswordVisibilityToggle(event: MouseEvent) {
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
    event.stopPropagation();
  }

  form = this.fb.nonNullable.group(
    {
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(this.firstNameMinLength),
          Validators.maxLength(this.firstNameMaxLength),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(this.lastNameMinLength),
          Validators.maxLength(this.lastNameMaxLength),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(this.emailMaxLength),
        ],
      ],
      phoneNumber: ['', Validators.pattern(/^[+]?[0-9]{7,15}$/)],
      dateOfBirth: [
        '',
        [
          // Validators.pattern(/^\d{4}-\d{2}-\d{2}$/),
          this.dataValidation.minimumAgeValidator(this.minAge),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(this.passwordMinLength),
          this.dataValidation.requireDigitValidator,
          this.dataValidation.requireLowercaseValidator,
          this.dataValidation.requireUppercaseValidator,
          this.dataValidation.requireNonAlphanumericValidator,
        ],
      ],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.dataValidation.passwordMatchValidator }
  );

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

  get password() {
    return this.form.get('password');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  firstNameErrorSubscription: Subscription;
  lastNameErrorSubscription: Subscription;
  emailErrorSubscription: Subscription;
  phoneNumberErrorSubscription: Subscription;
  dateOfBirthErrorSubscription: Subscription;
  passwordErrorSubscription: Subscription;
  confirmPasswordErrorSubscription: Subscription;

  constructor(
    private userService: UserService,
    private router: Router,
    private errorHandling: ErrorHandlingService,
    private alerService: AlertService,
    private notificationService: NotificationService
  ) {
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

    this.emailErrorSubscription = merge(
      this.email!.statusChanges,
      this.email!.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateEmailErrorMessages());

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

    this.passwordErrorSubscription = merge(
      this.password!.statusChanges,
      this.password!.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updatePasswordErrorMessages());

    this.confirmPasswordErrorSubscription = merge(
      this.confirmPassword!.statusChanges,
      this.confirmPassword!.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateConfirmPasswordErrorMessages());
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

  updateEmailErrorMessages(): void {
    if (this.email!.hasError('required')) {
      this.emailErrorMessage.set(
        this.msgService.getMessage(
          'user.validation.registration.email.required'
        )
      );
    } else if (this.email!.hasError('email')) {
      this.emailErrorMessage.set(
        this.msgService.getMessage('user.validation.registration.email.invalid')
      );
    } else {
      this.emailErrorMessage.set('');
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

  updatePasswordErrorMessages(): void {
    if (this.password!.hasError('required')) {
      this.passwordErrorMessage.set(
        this.msgService.getMessage(
          'user.validation.registration.password.required'
        )
      );
    } else if (this.password!.hasError('minLength')) {
      this.passwordErrorMessage.set(
        this.msgService.getMessage(
          'user.validation.registration.password.minLength',
          { passwordMinLength: this.passwordMinLength.toString() }
        )
      );
    } else if (this.password!.hasError('maxLength')) {
      this.passwordErrorMessage.set(
        this.msgService.getMessage(
          'user.validation.registration.password.maxLength',
          { passwordMaxLength: this.passwordMaxLength.toString() }
        )
      );
    } else if (this.password!.hasError('requireDigit')) {
      this.passwordErrorMessage.set(
        this.msgService.getMessage(
          'user.validation.registration.password.requireDigit'
        )
      );
    } else if (this.password!.hasError('requireLowercase')) {
      this.passwordErrorMessage.set(
        this.msgService.getMessage(
          'user.validation.registration.password.requireLowercase'
        )
      );
    } else if (this.password!.hasError('requireUppercase')) {
      this.passwordErrorMessage.set(
        this.msgService.getMessage(
          'user.validation.registration.password.requireUppercase'
        )
      );
    } else if (this.password!.hasError('requireNonAlphanumeric')) {
      this.passwordErrorMessage.set(
        this.msgService.getMessage(
          'user.validation.registration.password.requireNonAlphanumeric'
        )
      );
    } else {
      this.passwordErrorMessage.set('');
    }
  }

  updateConfirmPasswordErrorMessages() {
    if (this.confirmPassword?.hasError('required')) {
      this.confirmPasswordErrorMessage.set(
        this.msgService.getMessage(
          'user.validation.registration.confirmPassword.required'
        )
      );
    } else if (this.confirmPassword?.hasError('passwordMismatch')) {
      this.confirmPasswordErrorMessage.set(
        this.msgService.getMessage(
          'user.validation.registration.confirmPassword.passwordMismatch'
        )
      );
    } else {
      this.confirmPasswordErrorMessage.set('');
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading.set(true);
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

      const request: RegistrationRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: phoneNumber,
        dateOfBirth: formattedDate,
        password: data.password,
      };

      console.log(request);

      this.userService.register(request).subscribe({
        next: (res) => {
          console.log(res.message);

          this.alerService.showAlert(
            AlertType.Success,
            this.msgService.getMessage('user.alert.registration.title'),
            res.message
          );

          const message = this.msgService.getMessage(
            'user.notification.registration.success'
          );
          this.notificationService.notify(AlertType.Success, message);

          this.loading.set(false);
        },
        error: (error) => {
          this.errorHandling.handle(error);
          const message = this.msgService.getMessage(
            'user.notification.registration.fail'
          );
          this.notificationService.notify(AlertType.Danger, message);

          this.loading.set(false);
          this.form.reset();
          this.router.navigateByUrl(this.loginUrl);
        },
      });
    }
  }

  ngOnDestroy(): void {
    if (this.firstNameErrorSubscription)
      this.firstNameErrorSubscription.unsubscribe();
    if (this.lastNameErrorSubscription)
      this.lastNameErrorSubscription.unsubscribe();
    if (this.emailErrorSubscription) this.emailErrorSubscription.unsubscribe();
    if (this.phoneNumberErrorSubscription)
      this.phoneNumberErrorSubscription.unsubscribe();
    if (this.dateOfBirthErrorSubscription)
      this.dateOfBirthErrorSubscription.unsubscribe();
    if (this.passwordErrorSubscription)
      this.passwordErrorSubscription.unsubscribe();
    if (this.confirmPasswordErrorSubscription)
      this.confirmPasswordErrorSubscription.unsubscribe();
  }
}
