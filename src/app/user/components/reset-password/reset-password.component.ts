import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { merge, Subscription } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { DataValidationService } from '../../../shared/services/data-validation.service';
import { ErrorHandlingService } from '../../../shared/error-handling/error-handling.service';
import { AlertService } from '../../../shared/widgets/alert/alert.service';
import { NotificationService } from '../../../shared/widgets/notification/notification.service';
import { UserPageLoadingService } from '../../services/user-page-loading.service';
import { UserService } from '../../services/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '../../../shared/constants/constraints';
import { MessageService } from '../../../shared/messages/message.service';
import { TOKEN, USER_ID } from '../../../shared/constants/query-params';
import { AlertType } from '../../../shared/widgets/alert/alert-type.enum';
import { UNKNOWN_ERROR } from '../../../shared/error-handling/unknown-error';
import { ABSOLUTE_ROUTES } from '../../../shared/constants/absolute-routes';
import { ResetPasswordRequest } from '../../interfaces/reset-password-request.interface';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reset-password',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {
  fb = inject(FormBuilder);
  dataValidation = inject(DataValidationService);

  loading = signal(false);
  setLoading = effect(() => {
    this.loadingService.loadingStatus(this.loading());
  });

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

  passwordMinLength = PASSWORD_MIN_LENGTH;
  passwordMaxLength = PASSWORD_MAX_LENGTH;

  passwordErrorMessage = signal('');
  confirmPasswordErrorMessage = signal('');

  form = this.fb.nonNullable.group(
    {
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

  get password() {
    return this.form.get('password');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  passwordErrorSubscription: Subscription;
  confirmPasswordErrorSubscription: Subscription;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private errorHandling: ErrorHandlingService,
    private alerService: AlertService,
    private notificationService: NotificationService,
    private loadingService: UserPageLoadingService,
    private msgService: MessageService
  ) {
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

  private tokenParam = TOKEN;
  private userIdParam = USER_ID;

  private token: string | null = null;
  private userId: string | null = null;

  loginUrl = ABSOLUTE_ROUTES.user.userLogin;

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get(this.tokenParam);
    const userId = this.route.snapshot.queryParamMap.get(this.userIdParam);

    if (token && userId) {
      this.token = token;
      this.userId = userId;
    } else {
      this.alerService.showAlert(
        AlertType.Danger,
        UNKNOWN_ERROR.title,
        UNKNOWN_ERROR.message
      );

      this.router.navigateByUrl(this.loginUrl);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading.set(true);

      if (this.token && this.userId) {
        const data = this.form.getRawValue();

        const request: ResetPasswordRequest = {
          userId: this.userId,
          token: this.token,
          newPassword: data.password,
        };

        this.userService.resetPassword(request).subscribe({
          next: () => {
            this.alerService.showAlert(
              AlertType.Success,
              this.msgService.getMessage(
                'user.alert.sendEmail.resetPassword.success.title'
              ),
              this.msgService.getMessage(
                'user.alert.sendEmail.resetPassword.success.message'
              )
            );

            this.loading.set(false);
            this.form.reset();
            this.router.navigateByUrl(this.loginUrl);
          },
          error: (error) => {
            this.errorHandling.handle(error);
            this.loading.set(false);
          },
        });
      }
    }
  }
}
