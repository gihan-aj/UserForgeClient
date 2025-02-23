import { Component, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ThemeService } from '../../theme/theme.service';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../user/models/user.model';
import { SideNavService } from '../side-nav/side-nav.service';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { ABSOLUTE_ROUTES } from '../../shared/constants/absolute-routes';
import { APP_TITLE } from '../../shared/constants/app-title';
import { TOP_BAR_TOOL_TIPS } from './top-bar-tool-tips';
import { USER_MENU } from './user-menu';
import { ConfirmationService } from '../../shared/widgets/confirmation-dialog/confirmation.service';
import { AlertType } from '../../shared/widgets/alert/alert-type.enum';
import { MessageService } from '../../shared/messages/message.service';
import { UserService } from '../../user/services/user.service';
import { NotificationService } from '../../shared/widgets/notification/notification.service';
import { ErrorHandlingService } from '../../shared/error-handling/error-handling.service';

@Component({
  selector: 'app-top-bar',
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatTooltipModule,
    BreadcrumbComponent,
  ],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
})
export class TopBarComponent implements OnDestroy {
  themeService = inject(ThemeService);
  sideNavService = inject(SideNavService);

  appName = APP_TITLE;
  tooltips = TOP_BAR_TOOL_TIPS;
  userMenuNames = USER_MENU;
  userRoutes = ABSOLUTE_ROUTES.user;

  user = signal<User | null>(null);

  userSubscription: Subscription;
  logoutConfirmSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private msgService: MessageService,
    private notificationService: NotificationService,
    private errorHandling: ErrorHandlingService
  ) {
    this.userSubscription = this.authService.user$.subscribe({
      next: (user) => {
        if (user) {
          this.user.set(user);
        } else {
          this.user.set(null);
        }
      },
    });
  }

  onLogout() {
    this.logoutConfirmSubscription = this.confirmationService
      .fetchMessagesAndConfirm(
        'warning',
        'user.confirmation.logout.title',
        'user.confirmation.logout.message',
        'user.confirmation.logout.action'
      )
      .subscribe((accepted) => {
        if (accepted) {
          this.userService.logoutFromServer().subscribe({
            next: () => {
              this.authService.clearUserAndTokens();

              this.notificationService.fetchMessagesAndNotify(
                'success',
                'user.notification.logout.success'
              );

              this.router.navigateByUrl(this.userRoutes.userLogin);
              this.sideNavService.closeSideNav();
            },
            error: (error) => {
              this.authService.clearUserAndTokens();
              this.errorHandling.handle(error);

              this.notificationService.fetchMessagesAndNotify(
                'danger',
                'user.notification.logout.fail'
              );

              this.router.navigateByUrl(this.userRoutes.userLogin);
              this.sideNavService.closeSideNav();
            },
          });
        }
      });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) this.userSubscription.unsubscribe();
    if (this.logoutConfirmSubscription)
      this.logoutConfirmSubscription.unsubscribe();
  }
}
