import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from './auth.service';
import { APP_ID } from '../constants/query-params';

@Injectable({
  providedIn: 'root',
})
export class JwtTokenService {
  decodedToken: { [key: string]: string } = {};

  constructor(private authService: AuthService) {
    this.authService.accessToken$.subscribe((jwt) => {
      if (jwt && jwt.length > 0) {
        this.decodedToken = jwtDecode(jwt);
      } else {
        this.decodedToken = {};
      }
    });
  }

  private getExpiryTime() {
    return this.decodedToken ? this.decodedToken['exp'] : null;
  }

  isTokenExpired(): boolean {
    const expiryTime: string | null = this.getExpiryTime();
    if (expiryTime) {
      return Number(expiryTime) * 1000 - new Date().getTime() < 5000;
    } else {
      return true;
    }
  }

  getAppId(): number {
    return this.decodedToken ? Number(this.decodedToken[APP_ID]) : 0;
  }
}
