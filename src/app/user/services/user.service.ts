import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../shared/services/auth.service';
import { DeviceIdentifierService } from '../../shared/services/device-identifier.service';
import { LoginRequest } from '../interfaces/login-request.interface';
import { LoginResponse } from '../interfaces/login-response.interface';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { RefreshUserRequest } from '../interfaces/refresh-user-request.interface';
import { Router } from '@angular/router';
import { ROUTE_STRINGS } from '../../shared/constants/route-strings';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl: string = `${environment.baseUrl}/user`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private deviceId: DeviceIdentifierService
  ) {}

  private persistUser(response: LoginResponse) {
    let user = new User(
      response.user.id,
      response.user.email,
      response.user.firstName,
      response.user.lastName
    );

    user.roles = response.roles;
    user.userSettings = response.userSettings;

    console.log('logged in user: ', user);

    this.authService.persistUserWithTokens(
      user,
      response.accessToken,
      response.refreshToken
    );
  }

  login(loginFormData: { email: string; password: string }) {
    const url = this.baseUrl + '/login';
    console.log('url :', url);

    const request: LoginRequest = {
      email: loginFormData.email,
      password: loginFormData.password,
      deviceIdentifier: this.deviceId.getOrCreateDeviceIdentifier(),
    };

    return this.http.post<LoginResponse>(url, request, {}).pipe(
      map((response) => {
        if (response) {
          this.persistUser(response);
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
      }),
      catchError((error) => {
        this.authService.clearUserAndTokens();
        this.router.navigateByUrl(ROUTE_STRINGS.user.userLogin);
        return throwError(() => error);
      })
    );
  }
}
