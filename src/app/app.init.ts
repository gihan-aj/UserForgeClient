import { inject } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { UserService } from './user/services/user.service';

export function appInitializer() {
  return () => {
    const authService = inject(AuthService);
    const userService = inject(UserService);
    return new Promise<void>((resolve) => {
      console.log('app initialization started.');

      const refreshToken = authService.getRefreshToken();
      console.log('refresh token: ', refreshToken);

      if (refreshToken) {
        userService.refreshUser(refreshToken).subscribe({
          next: () => {
            console.log('new token obtained.');
            resolve();
          },
          error: (error) => {
            console.log('could not obtained a new token ', error);
            resolve();
          },
        });
      } else {
        console.log('could not find the refresh token');
        resolve();
      }
    });
  };
}
