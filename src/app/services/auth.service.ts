import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { APP_CONSTANTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private storageService: StorageService
  ) {}

  isAuthenticated(): boolean {
    return this.storageService.isLoggedIn();
  }

  login(token: string, email: string): void {
    this.storageService.setAuthToken(token);
    this.storageService.setUserEmail(email);
    this.storageService.setLoginStatus(true);
  }

  logout(): void {
    this.storageService.logout();
    this.router.navigate([APP_CONSTANTS.ROUTES.LOGIN]);
  }

  getCurrentUserEmail(): string | null {
    return this.storageService.getUserEmail();
  }

  getAuthToken(): string | null {
    return this.storageService.getAuthToken();
  }

  redirectToLogin(): void {
    this.router.navigate([APP_CONSTANTS.ROUTES.LOGIN]);
  }

  redirectToCheckin(): void {
    this.router.navigate([APP_CONSTANTS.ROUTES.CHECKIN]);
  }
}
