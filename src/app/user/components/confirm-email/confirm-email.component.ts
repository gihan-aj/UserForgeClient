import { Component, effect, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';

import { TOKEN, USER_ID } from '../../../shared/constants/query-params';
import { UserService } from '../../services/user.service';
import { ErrorHandlingService } from '../../../shared/error-handling/error-handling.service';
import { UserPageLoadingService } from '../../services/user-page-loading.service';
import { ABSOLUTE_ROUTES } from '../../../shared/constants/absolute-routes';
import { MessageService } from '../../../shared/messages/message.service';

@Component({
  selector: 'app-confirm-email',
  imports: [CommonModule, RouterLink, MatButtonModule],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss',
})
export class ConfirmEmailComponent implements OnInit {
  private tokenParam = TOKEN;
  private userIdParam = USER_ID;

  private token: string | null = null;
  private userId: string | null = null;

  loading = signal(true);
  confirmationSuccessful = signal(false);

  statusMessage = signal('');

  loginUrl = ABSOLUTE_ROUTES.user.userLogin;
  resendLinkUrl = ABSOLUTE_ROUTES.user.resendEmailConfirmationLink;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private errorHandling: ErrorHandlingService,
    private loadingService: UserPageLoadingService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.statusMessage.set(
      this.messageService.getMessage(
        'user.notification.emailConfirmation.loading'
      )
    );

    this.token = this.route.snapshot.queryParamMap.get(this.tokenParam);
    this.userId = this.route.snapshot.queryParamMap.get(this.userIdParam);

    if (this.token && this.userId) {
      this.userService.confirmEmail(this.userId, this.token).subscribe({
        next: () => {
          this.statusMessage.set(
            this.messageService.getMessage(
              'user.notification.emailConfirmation.success'
            )
          );
          this.confirmationSuccessful.set(true);
          this.loading.set(false);
        },
        error: (error) => {
          this.statusMessage.set(
            this.messageService.getMessage(
              'user.notification.emailConfirmation.fail'
            )
          );
          this.errorHandling.handle(error);
          this.loading.set(false);

          if (
            error.error &&
            error.error.type &&
            error.error.type === 'EmailAlreadyConfirmed'
          ) {
            this.router.navigateByUrl(this.loginUrl);
          }
        },
      });
    } else {
      this.loading.set(false);
    }
  }

  setLoading = effect(() => {
    this.loadingService.loadingStatus(this.loading());
  });
}
