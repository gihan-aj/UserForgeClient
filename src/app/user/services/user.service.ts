import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';

import { AuthService } from '../../shared/services/auth.service';
import { DeviceIdentifierService } from '../../shared/services/device-identifier.service';
import { LoginRequest } from '../interfaces/login-request.interface';
import { LoginResponse } from '../interfaces/login-response.interface';
import { User } from '../models/user.model';
import { RefreshUserRequest } from '../interfaces/refresh-user-request.interface';
import { NotificationService } from '../../shared/widgets/notification/notification.service';
import { ABSOLUTE_ROUTES } from '../../shared/constants/absolute-routes';
import { MessageService } from '../../shared/messages/message.service';
import { AlertType } from '../../shared/widgets/alert/alert-type.enum';
import { SettingsService } from '../../shared/settings/settings.service';
import { UserSetting } from '../../shared/settings/user-setting.interface';
import { PermissionService } from '../../shared/services/permission.service';
import { RegistrationRequest } from '../components/registration/registration-request';
import { TOKEN, USER_ID } from '../../shared/constants/query-params';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl: string = `${environment.baseUrl}/user`;
  private loginUrl = ABSOLUTE_ROUTES.user.userLogin;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private deviceId: DeviceIdentifierService,
    private notificationService: NotificationService,
    private msgService: MessageService,
    private setttingsService: SettingsService,
    private permissionsService: PermissionService
  ) {}

  private persistUser(response: LoginResponse): User {
    let user = new User(
      response.user.id,
      response.user.email,
      response.user.firstName,
      response.user.lastName,
      response.roles,
      response.userSettings
    );

    console.log('logged in user: ', user);

    this.setttingsService.loadSettings(response.userSettings);

    this.authService.persistUserWithTokens(
      user,
      response.accessToken,
      response.refreshToken
    );
    return user;
  }

  login(loginFormData: { email: string; password: string }) {
    const url = this.baseUrl + '/login';

    const request: LoginRequest = {
      email: loginFormData.email,
      password: loginFormData.password,
      deviceIdentifier: this.deviceId.getOrCreateDeviceIdentifier(),
    };

    return this.http.post<LoginResponse>(url, request, {}).pipe(
      map((response) => {
        if (response) {
          const user = this.persistUser(response);
          this.fetchPermissions().subscribe();
        }
      })
    );
  }

  refreshUser(refreshToken: string): Observable<LoginResponse> {
    const url = this.baseUrl + '/refresh';
    const deviceIdentifier = this.deviceId.getOrCreateDeviceIdentifier();

    const request: RefreshUserRequest = {
      refreshToken: refreshToken,
      deviceIdentifier: deviceIdentifier,
    };

    return this.http.post<LoginResponse>(url, request).pipe(
      tap((response) => {
        this.persistUser(response);
        this.fetchPermissions().subscribe();
      }),
      catchError((error) => {
        this.authService.clearUserAndTokens();
        this.router.navigateByUrl(this.loginUrl);

        const message = this.msgService.getMessage(
          'user.notification.refresh.fail'
        );
        this.notificationService.notify(AlertType.Danger, message);

        return throwError(() => error);
      })
    );
  }

  logoutFromServer(): Observable<void> {
    const url = this.baseUrl + '/logout';
    const body = {
      deviceIdentifier: this.deviceId.getOrCreateDeviceIdentifier(),
    };

    return this.http.put<void>(url, body, {});
  }

  saveUserSettings(settings: UserSetting[]): Observable<void> {
    const url = this.baseUrl + '/update-user-settings';
    return this.http.put<void>(url, settings, {});
  }

  fetchPermissions(): Observable<string[]> {
    const url = this.baseUrl + '/permissions';
    return this.http.get<string[]>(url).pipe(
      tap((response) => {
        console.log('user permissions: ', response);
        this.permissionsService.setpermissions(response);
      }),
      catchError((error) => {
        this.logoutFromServer().subscribe();

        this.authService.clearUserAndTokens();
        this.router.navigateByUrl(this.loginUrl);

        this.notificationService.notify(
          AlertType.Danger,
          this.msgService.getMessage('user.notification.fetchPermissions.fail')
        );
        return throwError(() => error);
      })
    );
  }

  register(request: RegistrationRequest): Observable<{ message: string }> {
    const url = this.baseUrl + '/register';
    return this.http.post<{ message: string }>(url, request);
  }

  confirmEmail(userId: string, token: string): Observable<void> {
    const url = `${this.baseUrl}/confirm-email`;

    let queryParams = new HttpParams();
    queryParams = queryParams.append(USER_ID, userId);
    queryParams = queryParams.append(TOKEN, token);

    return this.http.put<void>(url, null, { params: queryParams });
  }
}
