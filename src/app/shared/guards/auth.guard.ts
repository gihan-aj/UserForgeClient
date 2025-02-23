import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { UserService } from '../../user/services/user.service';
import { JwtTokenService } from '../services/jwt-token.service';
import { AuthService } from '../services/auth.service';
import { ABSOLUTE_ROUTES } from '../constants/absolute-routes';
import { MessageService } from '../messages/message.service';
import { NotificationService } from '../widgets/notification/notification.service';
import { AlertType } from '../widgets/alert/alert-type.enum';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const userService = inject(UserService);
  const jwtTokenService = inject(JwtTokenService);
  const router = inject(Router);
  const messageService = inject(MessageService);
  const notificationService = inject(NotificationService);

  const accessToken = authService.getAccessToken();
  const refreshToken = authService.getRefreshToken();

  const loginUrl = ABSOLUTE_ROUTES.user.userLogin;

  console.log('**AUTH GUARD**');
  console.log(`access token ${accessToken ? '' : 'not'} found.`);
  console.log(`refresh token ${refreshToken ? '' : 'not'} found.`);

  // 1. Check if the access token is valid
  if (accessToken && refreshToken && !jwtTokenService.isTokenExpired()) {
    console.log('access token is valid. user authenticated.');
    return of(true);
  }

  // 2. If no refresh token, redirect to login
  if (!refreshToken) {
    console.log(
      'user cannot be authenticated at auth guard. no refresh token.'
    );
    authService.clearUserAndTokens();
    return of(
      router.createUrlTree([loginUrl], {
        queryParams: { returnUrl: state.url },
      })
    );
  }

  // 3. Attempt to refresh the token
  return userService.refresh(refreshToken).pipe(
    map((response) => {
      console.log('user authenticated at auth guard');
      userService.persistUser(response);
      return true;
    }),
    catchError((error) => {
      console.log(
        'user cannot be authenticated at auth guard. refresh failed.'
      );

      notificationService.fetchAndNotify(
        'danger',
        'user.notification.refresh.fail'
      );

      authService.clearUserAndTokens();

      return of(
        router.createUrlTree([loginUrl], {
          queryParams: { returnUrl: state.url },
        })
      );
    })
  );
};
