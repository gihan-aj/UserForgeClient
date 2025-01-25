import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { LoadingContainerComponent } from '../../../shared/widgets/loading-container/loading-container.component';
import { MessageService } from '../../../shared/messages/message.service';
import { RETURN_URL } from '../../../shared/constants/query-params';
import { EMAIL_MAX_LENGTH } from '../../../shared/constants/constraints';
import { merge, takeUntil } from 'rxjs';
import { UserService } from '../../services/user.service';
import { ROUTE_STRINGS } from '../../../shared/constants/route-strings';

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
    LoadingContainerComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  msgService = inject(MessageService);
  fb = inject(FormBuilder);

  loading = signal(false);
  submitted = signal(false);

  emailErrorMessage = signal('');
  passwordErrorMessage = signal('');

  returnUrl: string | null = null;
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      if (params) {
        this.returnUrl = params.get(RETURN_URL);
      }
    });

    merge(this.email!.statusChanges, this.email!.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateEmailErrorMessages());

    merge(this.password!.statusChanges, this.password!.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updatePasswordErrorMessages());
  }

  updateEmailErrorMessages(): void {
    if (this.email!.hasError('required')) {
      this.emailErrorMessage.set(
        this.msgService.getMessage('user.login.validation.email.required')
      );
    } else if (this.email!.hasError('email')) {
      this.emailErrorMessage.set(
        this.msgService.getMessage('user.login.validation.email.invalid')
      );
    } else {
      this.emailErrorMessage.set('');
    }
  }

  updatePasswordErrorMessages(): void {
    if (this.password!.hasError('required')) {
      this.passwordErrorMessage.set(
        this.msgService.getMessage('user.login.validation.password.required')
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

      this.userService.login(data).subscribe({
        next: () => {
          if (this.returnUrl) {
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.router.navigateByUrl(ROUTE_STRINGS.dashboard);
          }

          this.form.reset();
          this.loading.set(false);
        },
        error: (error) => {
          console.error('login error: ', error);
          this.loading.set(false);
        },
      });
    }
  }
}
