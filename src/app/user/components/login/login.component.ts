import { Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { merge, Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { MessageService } from '../../../shared/messages/message.service';
import { RETURN_URL } from '../../../shared/constants/query-params';
import { EMAIL_MAX_LENGTH } from '../../../shared/constants/constraints';
import { UserService } from '../../services/user.service';
import {
  ABSOLUTE_ROUTES,
  DEFAULT_RETURN_URL,
} from '../../../shared/constants/absolute-routes';
import { NotificationService } from '../../../shared/widgets/notification/notification.service';
import { ErrorHandlingService } from '../../../shared/error-handling/error-handling.service';
import { AuthService } from '../../../shared/services/auth.service';
import { AlertType } from '../../../shared/widgets/alert/alert-type.enum';
import { UserPageLoadingService } from '../../services/user-page-loading.service';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  msgService = inject(MessageService);
  fb = inject(FormBuilder);

  loading = signal(false);
  submitted = signal(false);

  emailErrorMessage = signal('');
  passwordErrorMessage = signal('');

  defaultReturnUrl = DEFAULT_RETURN_URL;
  returnUrl: string | null = null;
  resendLinkUrl = ABSOLUTE_ROUTES.user.resendEmailConfirmationLink;
  emailMaxLength = EMAIL_MAX_LENGTH;

  hidePassword = signal(true);
  passwordVisibiltyToggle(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  passwordErrorSubscription: Subscription;
  emailErrorSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private errorHandling: ErrorHandlingService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private loadingService: UserPageLoadingService
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      if (params) {
        this.returnUrl = params.get(RETURN_URL);
      }
    });

    this.emailErrorSubscription = merge(
      this.email!.statusChanges,
      this.email!.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateEmailErrorMessages());

    this.passwordErrorSubscription = merge(
      this.password!.statusChanges,
      this.password!.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updatePasswordErrorMessages());
  }

  updateEmailErrorMessages(): void {
    if (this.email!.hasError('required')) {
      this.emailErrorMessage.set(
        this.msgService.getMessage('user.validation.login.email.required')
      );
    } else if (this.email!.hasError('email')) {
      this.emailErrorMessage.set(
        this.msgService.getMessage('user.validation.login.email.invalid')
      );
    } else {
      this.emailErrorMessage.set('');
    }
  }

  updatePasswordErrorMessages(): void {
    if (this.password!.hasError('required')) {
      this.passwordErrorMessage.set(
        this.msgService.getMessage('user.validation.login.password.required')
      );
    } else {
      this.passwordErrorMessage.set('');
    }
  }

  onSubmit(): void {
    this.submitted.set(true);

    const data = this.form.getRawValue();
    if (this.form.valid) {
      this.loading.set(true);

      this.userService.loginUser(data).subscribe({
        next: () => {
          if (this.returnUrl) {
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.router.navigateByUrl(this.defaultReturnUrl);
          }

          const user = this.authService.getUser();
          if (user) {
            this.notificationService.fetchAndNotify(
              'success',
              'user.notification.login.success',
              { firstName: user.firstName, lastName: user.lastName }
            );
          }

          this.form.reset();
          this.loading.set(false);
        },
        error: (error) => {
          console.error('login error: ', error);

          this.notificationService.fetchAndNotify(
            'danger',
            'user.notification.login.fail'
          );

          this.errorHandling.handle(error);
          this.loading.set(false);

          if (
            error.error &&
            error.error.type &&
            error.error.type === 'EmailNotConfirmed'
          ) {
            this.router.navigateByUrl(this.resendLinkUrl);
          }
        },
      });
    }
  }

  setLoading = effect(() => {
    this.loadingService.loadingStatus(this.loading());
  });

  ngOnDestroy(): void {
    if (this.emailErrorSubscription) this.emailErrorSubscription.unsubscribe();
    if (this.passwordErrorSubscription)
      this.passwordErrorSubscription.unsubscribe();
  }
}
