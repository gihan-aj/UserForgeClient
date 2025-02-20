# UserForge - SSO User Management System

UserForge is a **Single Sign-On (SSO) user management system** built with **Angular 19** and **ASP.NET 8**. It integrates with other software packages such as POS and inventory management. The system provides **role-based access control (RBAC)**, allowing administrators to assign predefined **permissions** to roles.

## Features
* **SSO User Management -** Integrate with multiple software systems.
* **Role-Based Access Control (RBAC) -** Assign predefined permissions to roles.
* **Authentication & Authorization**
  * JWT authentication with refresh token support.
  * HTTP interceptor for automatic token refresh on 401 errors.
* **Permissions & UI Access Control**
  * Route guards to restrict access.
  * A directive ```*userHasPermission``` to control UI components (menu items, buttons, etc.).
* **State Management**
  * Uses **BehaviorSubjects** to store:
    * User details
    * Access token (JWT)
    * Permissions
    * User settings (theme, table page size, etc.).
* **Themes & UI Enhancements**
  * System, light, and dark themes.
  * Signals used in theme service, side menu, etc.
  * Side menu automatically closes if no user is logged in.
* **Reusable Components**
  * Notification bar
  * Confirmation dialog
  * Alert component
  * Comprehensive table component with a customized generic data source
    * Supports pagination, search, and column sorting.
* **Forms & Validation**
  * Uses **Reactive Forms** with mat-form.
  * Displays validation errors using mat-error.
  * Dialogs for editing and saving data.

## UI Screenshots
Here are some UI previews of UserForge:


## Code Snippets
### Token refresh interceptor
```typescript
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

  if (accessToken && refreshToken && !jwtTokenService.isTokenExpired()) {
    console.log('access token is valid');
    req = addToken(req, accessToken);
    console.log('bearer token added to the request');
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 && refreshToken) {
        console.log('request denied with 401');

        return userService.refresh(refreshToken).pipe(
          switchMap((response) => {
            console.log('user refreshed with a new token.');
            userService.persistUser(response);

            const newReq = addToken(req, response.accessToken);
            console.log('new bearer token added to the request');

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
```

### User permission directive
```typescript
@Directive({
  selector: '[userHasPermission]',
})
export class HasPermissionDirective {
  @Input() set userHasPermission(permission: string) {
    if (this.permissinsService.hasPermission(permission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissinsService: PermissionService
  ) {}
}
```

### App initializer
```typescript
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

            const message = messageService.getMessage(
              'user.notification.refresh.fail'
            );
            notificationService.notify(AlertType.Danger, message);

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
```

## Future Improvements
* Add audit logs to track user actions.
* Enhance dashboard analytics for administrators.
* Implement multi-factor authentication (MFA).

## License
* This project is licensed under the MIT License.
