import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../user/models/user.model';
import { REFRESH_TOKEN } from '../constants/refresh-token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  mockUser = new User('1', 'gihan@gmail.com', 'gihan', 'akila');
  private userSubject = new BehaviorSubject<User | null>(null);
  private accessTokenSubject = new BehaviorSubject<string | null>(null);

  user$ = this.userSubject.asObservable();
  accessToken$ = this.accessTokenSubject.asObservable();

  constructor() {}

  setUser(user: User): void {
    this.userSubject.next(user);
  }

  getUser(): User | null {
    return this.userSubject.value;
  }

  setAccessToken(accessToken: string): void {
    this.accessTokenSubject.next(accessToken);
  }

  getAccessToken(): string | null {
    return this.accessTokenSubject.value;
  }

  setRefreshToken(refreshToken: string) {
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN);
  }

  persistUserWithTokens(
    user: User,
    accessToken: string,
    refreshToken: string
  ): void {
    this.setUser(user);
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
  }

  clearUserAndTokens(): void {
    this.userSubject.next(null);
    this.accessTokenSubject.next(null);
    localStorage.removeItem(REFRESH_TOKEN);
  }
}
