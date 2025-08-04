import { Injectable } from '@angular/core';
import { APP_CONSTANTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  // Auth specific methods
  setAuthToken(token: string): void {
    this.setItem(APP_CONSTANTS.STORAGE_KEYS.AUTH_TOKEN, token);
  }

  getAuthToken(): string | null {
    return this.getItem(APP_CONSTANTS.STORAGE_KEYS.AUTH_TOKEN);
  }

  setUserEmail(email: string): void {
    this.setItem(APP_CONSTANTS.STORAGE_KEYS.USER_EMAIL, email);
  }

  getUserEmail(): string | null {
    return this.getItem(APP_CONSTANTS.STORAGE_KEYS.USER_EMAIL);
  }

  setLoginStatus(isLoggedIn: boolean): void {
    this.setItem(APP_CONSTANTS.STORAGE_KEYS.IS_LOGGED_IN, isLoggedIn.toString());
  }

  isLoggedIn(): boolean {
    return this.getItem(APP_CONSTANTS.STORAGE_KEYS.IS_LOGGED_IN) === 'true';
  }

  logout(): void {
    this.removeItem(APP_CONSTANTS.STORAGE_KEYS.IS_LOGGED_IN);
    this.removeItem(APP_CONSTANTS.STORAGE_KEYS.AUTH_TOKEN);
    this.removeItem(APP_CONSTANTS.STORAGE_KEYS.USER_EMAIL);
  }

  // Checkin specific methods
  getCheckinKey(date: Date): string {
    return `${APP_CONSTANTS.STORAGE_KEYS.CHECKIN_PREFIX}${date.toDateString()}`;
  }

  hasCheckinForDate(date: Date): boolean {
    const key = this.getCheckinKey(date);
    return this.getItem(key) !== null;
  }

  saveCheckinForDate(date: Date, checkinData: any): void {
    const key = this.getCheckinKey(date);
    this.setItem(key, JSON.stringify(checkinData));
  }

  getCheckinForDate(date: Date): any | null {
    const key = this.getCheckinKey(date);
    const data = this.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  cleanOldCheckins(): void {
    const today = new Date().toDateString();
    const keysToRemove: string[] = [];

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(APP_CONSTANTS.STORAGE_KEYS.CHECKIN_PREFIX)) {
          const checkinDate = key.replace(APP_CONSTANTS.STORAGE_KEYS.CHECKIN_PREFIX, '');
          if (checkinDate !== today) {
            keysToRemove.push(key);
          }
        }
      }

      keysToRemove.forEach(key => this.removeItem(key));
    } catch (error) {
      console.error('Error cleaning old checkins:', error);
    }
  }
}
