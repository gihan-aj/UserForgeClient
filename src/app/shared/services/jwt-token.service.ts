import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class JwtTokenService {
  jwtToken: string = '';
  decodedToken: { [key: string]: string } = {};

  private setToken(token: string) {
    if (token) {
      this.jwtToken = token;
    }
  }

  private decodeToken() {
    if (this.jwtToken && this.jwtToken.length > 0) {
      this.decodedToken = jwtDecode(this.jwtToken);
    }
  }

  private getExpiryTime(token: string) {
    this.setToken(token);
    this.decodeToken();
    return this.decodedToken ? this.decodedToken['exp'] : null;
  }

  getDecodedToken(token: string) {
    this.setToken(token);
    this.decodeToken();
    return this.decodeToken;
  }

  isTokenExpired(token: string): boolean {
    const expiryTime: string | null = this.getExpiryTime(token);
    if (expiryTime) {
      return Number(expiryTime) * 1000 - new Date().getTime() < 5000;
    } else {
      return true;
    }
  }
}
