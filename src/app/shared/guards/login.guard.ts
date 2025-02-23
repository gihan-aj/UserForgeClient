import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../widgets/notification/notification.service';
import { AlertType } from '../widgets/alert/alert-type.enum';
import { MESSAGES } from '../messages/messages';
import { DEFAULT_RETURN_URL } from '../constants/absolute-routes';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  const defaultReturnUrl = DEFAULT_RETURN_URL;

  if (authService.getUser()) {
    notificationService.fetchMessagesAndNotify(
      'warning',
      'user.notification.alreadyLoggedIn'
    );
    router.navigateByUrl(defaultReturnUrl);
    return false;
  }
  return true;
};
