import { inject } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { UserService } from './user/services/user.service';
import { switchMap, tap } from 'rxjs';
import { PermissionService } from './shared/services/permission.service';
import { NotificationService } from './shared/widgets/notification/notification.service';
import { MessageService } from './shared/messages/message.service';
import { AlertType } from './shared/widgets/alert/alert-type.enum';
import { ErrorHandlingService } from './shared/error-handling/error-handling.service';

export function appInitializer() {
  return () => {
    const authService = inject(AuthService);
    const userService = inject(UserService);
    const permissionsService = inject(PermissionService);
    const notificationService = inject(NotificationService);
    const messageService = inject(MessageService);
    const errorHandling = inject(ErrorHandlingService);

    return new Promise<void>((resolve) => {
      console.log('**APP INITIALIZATION STARTED.**');
      const refreshToken = authService.getRefreshToken();
      console.log(`refresh token ${refreshToken ? '' : 'not'} found.`);

      if (!refreshToken) {
        console.log('**APP INITIALIZATION FINISHED.**');
        return resolve();
      }

      userService
        .refresh(refreshToken)
        .pipe(
          tap((response) => {
            if (response) {
              console.log('user refreshed with new tokens.');
              userService.persistUser(response);
            }
          }),
          switchMap(() =>
            userService.fetchUserPermissions().pipe(
              tap((response) => {
                console.log('user permissions fetched.');
                permissionsService.setpermissions(response);
              })
            )
          )
        )
        .subscribe({
          next: () => {
            resolve();
          },
          error: (error) => {
            authService.clearUserAndTokens();
            // errorHandling.handle(error);

            notificationService.fetchMessagesAndNotify(
              'danger',
              'user.notification.refresh.fail'
            );

            console.log('user refresh faild', error);
            resolve();
          },
          complete() {
            console.log('**APP INITIALIZATION FINISHED.**');
          },
        });
    });
  };
}
