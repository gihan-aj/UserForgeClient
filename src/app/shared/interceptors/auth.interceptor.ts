import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from '../../user/services/user.service';
import { AuthService } from '../services/auth.service';
import { JwtTokenService } from '../services/jwt-token.service';
import { catchError, switchMap, throwError, map, tap } from 'rxjs';
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

  // Add the access token if the token is valid
  if (accessToken && refreshToken && !jwtTokenService.isTokenExpired()) {
    console.log('access token is valid');
    req = addToken(req, accessToken);
    console.log('bearer token added to the request');
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 && refreshToken) {
        console.log('request denied with 401');

        // Call refresh request to get a new token
        return userService.refresh(refreshToken).pipe(
          switchMap((response) => {
            console.log('user refreshed with a new token.');
            userService.persistUser(response);

            //clone the original request with the new request
            const newReq = addToken(req, response.accessToken);
            console.log('new bearer token added to the request');

            // retry the request
            return next(newReq);
          }),
          catchError((refreshError) => {
            authService.clearUserAndTokens();
            const message = messageService.getMessage(
              'user.notification.refresh.fail'
            );
            notificationService.notify(AlertType.Danger, message);

            console.log('user refresh faild', refreshError);
            return throwError(() => refreshError);
          })
        );
      }
      // If it's not a 401 or there's no refresh token, rethrow the error
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
