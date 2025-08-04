import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, timeout, retry } from 'rxjs/operators';

// Import models and constants
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User
} from '../models/auth.models';
import {
  CheckinRequest,
  CheckinResponse,
  CheckinStatusResponse
} from '../models/checkin.model';
import { API_CONFIG } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  // API Methods

  login(credentials: LoginRequest): Observable<LoginResponse> {
    const endpoint = API_CONFIG.ENDPOINTS.AUTH.LOGIN;

    if (API_CONFIG.USE_MOCK_API) {
      return this.getMockLoginResponse(credentials);
    }

    return this.http.post<LoginResponse>(`${this.baseUrl}${endpoint}`, credentials, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    }).pipe(
      timeout(5000),
      retry(2),
      catchError(error => {
        console.error('❌ Login error:', error);
        return throwError(() => error);
      })
    );
  }

  register(data: RegisterRequest): Observable<any> {
    const endpoint = API_CONFIG.ENDPOINTS.AUTH.REGISTER;

    return this.http.post(`${this.baseUrl}${endpoint}`, data).pipe(
      timeout(5000),
      retry(2),
      catchError(error => {
        console.error('❌ Register error:', error);
        return throwError(() => error);
      })
    );
  }

  changePassword(data: any): Observable<any> {
    const endpoint = API_CONFIG.ENDPOINTS.USER.RESET_PASSWORD;

    return this.http.put(`${this.baseUrl}${endpoint}`, data).pipe(
      timeout(5000),
      retry(2),
      catchError(error => {
        console.error('❌ Change password error:', error);
        return throwError(() => error);
      })
    );
  }

  doCheckin(data: CheckinRequest): Observable<CheckinResponse> {
    const endpoint = API_CONFIG.ENDPOINTS.CHECKIN.CREATE;

    if (API_CONFIG.USE_MOCK_API) {
      return this.getMockCheckinResponse();
    }

    return this.http.post<CheckinResponse>(`${this.baseUrl}${endpoint}`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    }).pipe(
      timeout(5000),
      retry(2),
      catchError(error => {
        console.error('❌ Checkin error:', error);
        return throwError(() => error);
      })
    );
  }

  getCheckinStatus(): Observable<CheckinStatusResponse> {
    const endpoint = API_CONFIG.ENDPOINTS.CHECKIN.STATUS;

    if (API_CONFIG.USE_MOCK_API) {
      return this.getMockCheckinStatus();
    }

    return this.http.get<CheckinStatusResponse>(`${this.baseUrl}${endpoint}`, {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    }).pipe(
      timeout(5000),
      retry(2),
      catchError(error => {
        console.error('❌ Checkin status error:', error);
        // Return default status for offline usage
        const defaultStatus: CheckinStatusResponse = {
          can_checkin: true,
          reason: '',
          message: '',
          today: new Date().toLocaleDateString('pt-BR'),
          is_weekend: this.isWeekend(),
          already_checked_in: false
        };
        return of(defaultStatus);
      })
    );
  }

  getCheckins(): Observable<any[]> {
    const endpoint = API_CONFIG.ENDPOINTS.CHECKIN.LIST;

    if (API_CONFIG.USE_MOCK_API) {
      return this.getMockCheckins();
    }

    return this.http.get<any[]>(`${this.baseUrl}${endpoint}`).pipe(
      timeout(5000),
      retry(2),
      catchError(error => {
        console.error('❌ Checkins history error:', error);
        return throwError(() => error);
      })
    );
  }

  createUser(userData: any): Observable<any> {
    const endpoint = API_CONFIG.ENDPOINTS.USER.CREATE;

    return this.http.post(`${this.baseUrl}${endpoint}`, userData).pipe(
      timeout(5000),
      retry(2),
      catchError(error => {
        console.error('❌ Create user error:', error);
        return throwError(() => error);
      })
    );
  }

  resetPassword(resetData: any): Observable<any> {
    const endpoint = API_CONFIG.ENDPOINTS.USER.RESET_PASSWORD;

    return this.http.post(`${this.baseUrl}${endpoint}`, resetData).pipe(
      timeout(5000),
      retry(2),
      catchError(error => {
        console.error('❌ Reset password error:', error);
        return throwError(() => error);
      })
    );
  }

  healthCheck(): Observable<any> {
    const endpoint = API_CONFIG.ENDPOINTS.HEALTH;

    return this.http.get(`${this.baseUrl}${endpoint}`).pipe(
      timeout(5000),
      retry(2),
      catchError(error => {
        console.error('❌ Health check error:', error);
        return of({ status: 'offline' });
      })
    );
  }

  // Mock API responses for development/testing

  private getMockLoginResponse(credentials: LoginRequest): Observable<LoginResponse> {
    // Simple mock validation
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      const mockResponse: LoginResponse = {
        token: 'mock-jwt-token-12345',
        user: {
          id: 1,
          name: 'Admin User',
          email: credentials.username + '@example.com',
          username: credentials.username
        }
      };
      return of(mockResponse);
    } else {
      return throwError(() => new HttpErrorResponse({
        error: { message: 'Invalid credentials' },
        status: 401,
        statusText: 'Unauthorized'
      }));
    }
  }

  private getMockCheckinResponse(): Observable<CheckinResponse> {
    const mockResponse: CheckinResponse = {
      id: Math.floor(Math.random() * 1000),
      userId: 1,
      timestamp: new Date().toISOString(),
      points: 10
    };
    return of(mockResponse);
  }

  private getMockCheckinStatus(): Observable<CheckinStatusResponse> {
    const today = new Date();
    const isWeekendDay = this.isWeekend();

    const mockStatus: CheckinStatusResponse = {
      can_checkin: !isWeekendDay,
      reason: isWeekendDay ? 'Check-in não disponível nos fins de semana' : '',
      message: isWeekendDay ? 'Aproveite seu fim de semana!' : '',
      today: today.toLocaleDateString('pt-BR'),
      is_weekend: isWeekendDay,
      already_checked_in: false
    };

    return of(mockStatus);
  }

  private getMockCheckins(): Observable<any[]> {
    const mockCheckins = [
      {
        id: 1,
        userId: 1,
        timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        points: 10
      },
      {
        id: 2,
        userId: 1,
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        points: 10
      }
    ];
    return of(mockCheckins);
  }

  // Helper methods
  private isWeekend(): boolean {
    const today = new Date();
    const dayOfWeek = today.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sunday, 6 = Saturday
  }
}
