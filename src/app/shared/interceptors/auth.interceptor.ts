import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from '../../user/services/user.service';
import { AuthService } from '../services/auth.service';
import { JwtTokenService } from '../services/jwt-token.service';
import { catchError, switchMap, throwError, map } from 'rxjs';
import { NotificationService } from '../widgets/notification/notification.service';
import { MessageService } from '../messages/message.service';
import { AlertType } from '../widgets/alert/alert-type.enum';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const userService = inject(UserService);
  const jwtTokenService = inject(JwtTokenService);
  const notificationService = inject(NotificationService);
  const messageService = inject(MessageService);

  const accessToken = authService.getAccessToken();
  const refreshToken = authService.getRefreshToken();

  console.log('**AUTH INTERCEPTOR**');
  console.log(`access token ${accessToken ? '' : 'not'} found.`);
  console.log(`refresh token ${refreshToken ? '' : 'not'} found.`);

  if (
    accessToken &&
    refreshToken &&
    !jwtTokenService.isTokenExpired(accessToken)
  ) {
    console.log('access token is valid');
    req = addToken(req, accessToken);
    console.log('bearer token added to the request');
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 && refreshToken) {
        console.log('request denied with 401');
        switchMap(() =>
          userService.refresh(refreshToken).pipe(
            map((response) => {
              if (response) {
                console.log('user refreshed with new token.');
                userService.persistUser(response);
                req = addToken(req, response.accessToken);
              }
              console.log('new bearer token added to the request.');
              return next(req);
            }),
            catchError((error) => {
              authService.clearUserAndTokens();

              const message = messageService.getMessage(
                'user.notification.refresh.fail'
              );
              notificationService.notify(AlertType.Danger, message);

              console.log('user refresh faild', error);
              return throwError(() => error);
            })
          )
        );
      }
      return throwError(() => error);
    })
  );
};

const addToken = (req: HttpRequest<any>, token: string): HttpRequest<any> =>
  req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
