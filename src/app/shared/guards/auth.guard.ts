import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../user/services/user.service';
import { JwtTokenService } from '../services/jwt-token.service';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';
import { ABSOLUTE_ROUTES } from '../constants/absolute-routes';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const userService = inject(UserService);
  const jwtTokenService = inject(JwtTokenService);
  const router = inject(Router);

  const accessToken = authService.getAccessToken();
  const refreshToken = authService.getRefreshToken();

  const loginUrl = ABSOLUTE_ROUTES.user.userLogin;

  console.log('auth guard chacking authentication ', accessToken, refreshToken);

  if (accessToken && !jwtTokenService.isTokenExpired(accessToken)) {
    console.log('has a valid access token. authenticated.');
    return true;
  }

  if (refreshToken) {
    return userService.refreshUser(refreshToken).pipe(
      map((response) => {
        if (response) {
          return true;
        } else {
          console.log('authentication failed refreshing user at guard.');
          router.navigate([loginUrl], {
            queryParams: { returnUrl: state.url },
          });
          return false;
        }
      }),
      catchError(() => {
        console.log(
          'authentication failed. catching error refreshing user at guard.'
        );
        router.navigate([loginUrl], {
          queryParams: { returnUrl: state.url },
        });
        return of(false);
      })
    );
  }

  router.navigate([loginUrl], {
    queryParams: { returnUrl: state.url },
  });

  console.log('authentication failed at guard.');

  return false;
};
