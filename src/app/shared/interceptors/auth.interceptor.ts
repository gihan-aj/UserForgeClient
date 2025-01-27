import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from '../../user/services/user.service';
import { AuthService } from '../services/auth.service';
import { JwtTokenService } from '../services/jwt-token.service';
import { catchError, switchMap, throwError, map } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const userService = inject(UserService);
  const jwtTokenService = inject(JwtTokenService);

  const accessToken = authService.getAccessToken();
  const refreshToken = authService.getRefreshToken();

  console.log('entered interceptor');
  console.log('access token', accessToken?.length);
  console.log('refresh token', refreshToken);
  console.log(
    'access token expired?',
    jwtTokenService.isTokenExpired(accessToken!)
  );

  if (
    refreshToken &&
    accessToken &&
    !jwtTokenService.isTokenExpired(accessToken)
  ) {
    req = addToken(req, accessToken);
    console.log('bearer token added to the request.');
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 && refreshToken) {
        console.log('request denied with 401.');

        return userService.refreshUser(refreshToken).pipe(
          switchMap((response) => {
            console.log('user refreshed. new access token received.');
            const newAccessToken = response.accessToken;
            return next(addToken(req, newAccessToken));
          }),
          catchError((error) => {
            console.log('could not refresh user');
            return throwError(() => error);
          })
        );
      }
      console.log('request failed.');
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
