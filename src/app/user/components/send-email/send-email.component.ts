import { Component, effect, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { UserPageLoadingService } from '../../services/user-page-loading.service';
import { EMAIL_MAX_LENGTH } from '../../../shared/constants/constraints';
import { ErrorHandlingService } from '../../../shared/error-handling/error-handling.service';
import { MessageService } from '../../../shared/messages/message.service';
import { DataValidationService } from '../../../shared/services/data-validation.service';
import { AlertService } from '../../../shared/widgets/alert/alert.service';
import { UserService } from '../../services/user.service';
import { AlertType } from '../../../shared/widgets/alert/alert-type.enum';
import { UNKNOWN_ERROR } from '../../../shared/error-handling/unknown-error';
import { ABSOLUTE_ROUTES } from '../../../shared/constants/absolute-routes';
import { merge, Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const MODES = {
  sendEmailConfirmationLink: 'resend-email-confirmation-link',
  forgotPasswordLink: 'forgot-password',
};

@Component({
  selector: 'app-send-email',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './send-email.component.html',
  styleUrl: './send-email.component.scss',
})
export class SendEmailComponent implements OnInit {
  fb = inject(FormBuilder);

  loading = signal(false);
  setLoading = effect(() => {
    this.loadingService.loadingStatus(this.loading());
  });

  mode: string | undefined;
  emailMaxLength = EMAIL_MAX_LENGTH;

  form = this.fb.nonNullable.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.maxLength(this.emailMaxLength),
      ],
    ],
  });

  get email() {
    return this.form.get('email');
  }

  emailErrorSubscription: Subscription;

  emailErrorMessage = signal('');

  constructor(
    private loadingService: UserPageLoadingService,
    private route: ActivatedRoute,
    public dataValidation: DataValidationService,
    private router: Router,
    public messageService: MessageService,
    private userService: UserService,
    private errorHandling: ErrorHandlingService,
    private alerService: AlertService
  ) {
    this.emailErrorSubscription = merge(
      this.email!.statusChanges,
      this.email!.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateEmailErrorMessages());
  }

  updateEmailErrorMessages(): void {
    if (this.email!.hasError('required')) {
      this.emailErrorMessage.set(
        this.messageService.getMessage('user.validation.login.email.required')
      );
    } else if (this.email!.hasError('email')) {
      this.emailErrorMessage.set(
        this.messageService.getMessage('user.validation.login.email.invalid')
      );
    } else {
      this.emailErrorMessage.set('');
    }
  }

  loginUrl = ABSOLUTE_ROUTES.user.userLogin;

  title = signal('');

  ngOnInit(): void {
    const mode = this.route.snapshot.paramMap.get('mode');
    if (mode) {
      this.mode = mode;
      if (mode === MODES.sendEmailConfirmationLink) {
        this.title.set('Enter your email to send email confirmation link.');
      } else if (mode === MODES.forgotPasswordLink) {
        this.title.set('Enter your email to send password reset link.');
      } else {
        this.title.set('Invalid link.');
      }
    } else {
      this.alerService.showAlert(
        AlertType.Danger,
        UNKNOWN_ERROR.title,
        UNKNOWN_ERROR.message
      );

      this.router.navigateByUrl(this.loginUrl);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading.set(true);

      const data = this.form.getRawValue();

      if (this.mode === MODES.sendEmailConfirmationLink) {
        this.resendEmailConfirmationLink(data.email);
      } else if (this.mode === MODES.forgotPasswordLink) {
        this.sendPasswordResetLink(data.email);
      }
    }
  }

  private resendEmailConfirmationLink(email: string) {
    this.userService.resendEmailConfirmationLink(email).subscribe({
      next: () => {
        this.alerService.showAlert(
          AlertType.Success,
          this.messageService.getMessage(
            'user.alert.sendEmail.emailConfirmationLink.success.title'
          ),
          this.messageService.getMessage(
            'user.alert.sendEmail.emailConfirmationLink.success.message'
          )
        );

        this.loading.set(false);
        this.form.reset();
        this.form.markAsPristine();
      },
      error: (error) => {
        this.errorHandling.handle(error);
        this.loading.set(false);
      },
    });
  }

  private sendPasswordResetLink(email: string) {
    this.userService.sendPassowrdResetLink(email).subscribe({
      next: () => {
        this.alerService.showAlert(
          AlertType.Success,
          this.messageService.getMessage(
            'user.alert.sendEmail.passwordResetLink.success.title'
          ),
          this.messageService.getMessage(
            'user.alert.sendEmail.passwordResetLink.success.message'
          )
        );

        this.loading.set(false);
        this.form.reset();
        this.form.markAsPristine();
      },
      error: (error) => {
        this.errorHandling.handle(error);
        this.loading.set(false);
      },
    });
  }
}
