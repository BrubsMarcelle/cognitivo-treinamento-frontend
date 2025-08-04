import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';

import { LoginRequest, RegisterRequest, CreateUserRequest, ResetPasswordRequest } from '../models/auth.model';
import { LoginResponse } from '../models/user.model';
import { CheckinRequest, CheckinResponse, CheckinStatusResponse } from '../models/checkin.model';
import { StorageService } from './storage.service';
import { APP_CONSTANTS } from '../constants/app.constants';
import { API_CONFIG } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = API_CONFIG.BASE_URL;
  private readonly defaultHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  // Auth endpoints
  login(credentials: LoginRequest): Observable<LoginResponse> {
    const endpoint = API_CONFIG.ENDPOINTS.AUTH.LOGIN;

    if (API_CONFIG.USE_MOCK_API) {
      return this.mockLogin(credentials);
    }

    return this.http.post<any>(this.getFullUrl(endpoint), credentials, { headers: this.defaultHeaders })
      .pipe(
        timeout(APP_CONSTANTS.API_TIMEOUT),
        map(response => this.transformLoginResponse(response, credentials.username)),
        catchError(error => this.handleError('login', error))
      );
  }

  healthCheck(): Observable<any> {
    const endpoint = API_CONFIG.ENDPOINTS.HEALTH;

    if (API_CONFIG.USE_MOCK_API) {
      return of({ status: 'ok', message: 'Mock API is healthy' });
    }

    return this.http.get<any>(this.getFullUrl(endpoint), { headers: this.defaultHeaders })
      .pipe(
        timeout(APP_CONSTANTS.API_TIMEOUT),
        catchError(error => this.handleError('healthCheck', error))
      );
  }

  // User endpoints
  createUser(userData: CreateUserRequest): Observable<any> {
    const endpoint = API_CONFIG.ENDPOINTS.USER.CREATE;

    return this.http.post<any>(this.getFullUrl(endpoint), userData, { headers: this.getAuthHeaders() })
      .pipe(
        timeout(APP_CONSTANTS.API_TIMEOUT),
        catchError(error => this.handleError('createUser', error))
      );
  }

  resetPassword(data: ResetPasswordRequest): Observable<any> {
    const endpoint = API_CONFIG.ENDPOINTS.USER.RESET_PASSWORD;

    return this.http.post<any>(this.getFullUrl(endpoint), data, { headers: this.defaultHeaders })
      .pipe(
        timeout(APP_CONSTANTS.API_TIMEOUT),
        catchError(error => this.handleError('resetPassword', error))
      );
  }

  // Checkin endpoints
  getCheckinStatus(): Observable<CheckinStatusResponse> {
    const endpoint = API_CONFIG.ENDPOINTS.CHECKIN.STATUS;

    if (API_CONFIG.USE_MOCK_API) {
      return this.mockCheckinStatus();
    }

    return this.http.get<any>(this.getFullUrl(endpoint), { headers: this.getAuthHeaders() })
      .pipe(
        timeout(APP_CONSTANTS.API_TIMEOUT),
        map(response => this.transformCheckinStatusResponse(response)),
        catchError(error => this.handleError('getCheckinStatus', error))
      );
  }

  doCheckin(checkinData: CheckinRequest): Observable<CheckinResponse> {
    const endpoint = API_CONFIG.ENDPOINTS.CHECKIN.CREATE;

    if (API_CONFIG.USE_MOCK_API) {
      return this.mockCheckin(checkinData);
    }

    return this.http.post<any>(this.getFullUrl(endpoint), checkinData, { headers: this.getAuthHeaders() })
      .pipe(
        timeout(APP_CONSTANTS.API_TIMEOUT),
        map(response => this.transformCheckinResponse(response)),
        catchError(error => this.handleError('doCheckin', error))
      );
  }

  getCheckins(): Observable<CheckinResponse[]> {
    const endpoint = API_CONFIG.ENDPOINTS.CHECKIN.LIST;

    if (API_CONFIG.USE_MOCK_API) {
      return this.mockCheckins();
    }

    return this.http.get<any[]>(this.getFullUrl(endpoint), { headers: this.getAuthHeaders() })
      .pipe(
        timeout(APP_CONSTANTS.API_TIMEOUT),
        map(response => response.map(item => this.transformCheckinResponse(item))),
        catchError(error => this.handleError('getCheckins', error))
      );
  }

  // Helper methods
  private getAuthHeaders(): HttpHeaders {
    const token = this.storageService.getAuthToken();
    if (token) {
      return this.defaultHeaders.set('Authorization', `Bearer ${token}`);
    }
    return this.defaultHeaders;
  }

  private getFullUrl(endpoint: string): string {
    return `${this.baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  }

  // Error handling
  private handleError(operation: string, error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error: ${error.status} - ${error.message}`;
    }

    console.error(`❌ ${operation} failed:`, errorMessage);
    return throwError(() => ({
      message: errorMessage,
      status: error.status,
      operation
    }));
  }

  // Response transformers
  private transformLoginResponse(response: any, username: string): LoginResponse {
    return {
      token: response.token || response.access_token || `mock-token-${Date.now()}`,
      user: {
        id: response.user?.id || 1,
        email: response.user?.email || `${username}@example.com`,
        name: response.user?.name || username
      }
    };
  }

  private transformCheckinStatusResponse(response: any): CheckinStatusResponse {
    return {
      can_checkin: response.can_checkin ?? true,
      reason: response.reason || '',
      message: response.message || '',
      today: response.today || new Date().toISOString().split('T')[0],
      is_weekend: response.is_weekend ?? false,
      already_checked_in: response.already_checked_in ?? false
    };
  }

  private transformCheckinResponse(response: any): CheckinResponse {
    return {
      id: response.id || Date.now(),
      userId: response.user_id || response.userId || 1,
      timestamp: response.timestamp || new Date().toISOString(),
      points: response.points || 10
    };
  }

  // Mock implementations
  private mockLogin(credentials: LoginRequest): Observable<LoginResponse> {
    const validCredentials = [
      { username: 'admin', password: '123456' },
      { username: 'user', password: 'password' },
      { username: 'test', password: 'test123' }
    ];

    const isValid = validCredentials.some(cred =>
      cred.username === credentials.username && cred.password === credentials.password
    );

    if (isValid) {
      const mockResponse: LoginResponse = {
        token: `mock-token-${Date.now()}`,
        user: {
          id: 1,
          email: `${credentials.username}@example.com`,
          name: credentials.username
        }
      };
      return of(mockResponse);
    } else {
      return throwError(() => ({
        message: 'Credenciais inválidas',
        status: 401,
        operation: 'mockLogin'
      }));
    }
  }

  private mockCheckinStatus(): Observable<CheckinStatusResponse> {
    const today = new Date().toISOString().split('T')[0];
    const lastCheckinStr = this.storageService.getItem(`checkin_${today}`);

    return of({
      can_checkin: !lastCheckinStr,
      reason: lastCheckinStr ? 'Você já fez check-in hoje!' : 'Você pode fazer check-in',
      message: lastCheckinStr ? 'Você já fez check-in hoje!' : 'Você pode fazer check-in',
      today: today,
      is_weekend: false,
      already_checked_in: !!lastCheckinStr
    });
  }

  private mockCheckin(checkinData: CheckinRequest): Observable<CheckinResponse> {
    const mockResponse: CheckinResponse = {
      id: Date.now(),
      userId: checkinData.userId || 1,
      timestamp: checkinData.timestamp || new Date().toISOString(),
      points: 10
    };

    // Save to localStorage for mock consistency
    const today = new Date().toISOString().split('T')[0];
    this.storageService.setItem(`checkin_${today}`, JSON.stringify(mockResponse));

    return of(mockResponse);
  }

  private mockCheckins(): Observable<CheckinResponse[]> {
    const checkins: CheckinResponse[] = [];
    const today = new Date();

    // Get last 7 days of mock checkins
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const storedCheckin = this.storageService.getItem(`checkin_${dateStr}`);
      if (storedCheckin) {
        try {
          const checkin = JSON.parse(storedCheckin);
          checkins.push(checkin);
        } catch (error) {
          console.error('Error parsing stored checkin:', error);
        }
      }
    }

    return of(checkins);
  }
}
