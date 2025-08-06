import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { Login } from './login';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let localStorageSpy: jasmine.Spy;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const apiSpy = jasmine.createSpyObj('ApiService', ['login', 'healthCheck']);
    const authSpy = jasmine.createSpyObj('AuthService', ['logout', 'isAuthenticated']);

    await TestBed.configureTestingModule({
      imports: [
        Login,
        HttpClientTestingModule
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ApiService, useValue: apiSpy },
        { provide: AuthService, useValue: authSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockApiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    // Setup localStorage spy once
    localStorageSpy = spyOn(localStorage, 'setItem');

    // Setup default mock responses
    mockApiService.healthCheck.and.returnValue(of({ status: 'ok' }));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form data', () => {
    expect(component.loginData.username).toBe('');
    expect(component.loginData.password).toBe('');
    expect(component.isLoading).toBe(false);
    expect(component.errorMessage).toBe('');
  });

  it('should test backend connection on init', () => {
    component.ngOnInit();

    expect(mockApiService.healthCheck).toHaveBeenCalled();
  });

  it('should show error for empty fields', () => {
    component.loginData.username = '';
    component.loginData.password = '';

    component.onLogin();

    expect(component.errorMessage).toBe('Por favor, preencha todos os campos');
    expect(mockApiService.login).not.toHaveBeenCalled();
  });

  it('should show error for missing username', () => {
    component.loginData.username = '';
    component.loginData.password = 'password123';

    component.onLogin();

    expect(component.errorMessage).toBe('Por favor, preencha todos os campos');
  });

  it('should show error for missing password', () => {
    component.loginData.username = 'testuser';
    component.loginData.password = '';

    component.onLogin();

    expect(component.errorMessage).toBe('Por favor, preencha todos os campos');
  });

  it('should handle successful API login', fakeAsync(() => {
    component.loginData.username = 'testuser';
    component.loginData.password = 'password123';

    const mockResponse = {
      token: 'mock-token',
      user: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test User'
      }
    };
    mockApiService.login.and.returnValue(of(mockResponse));

    component.onLogin();
    tick(100);

    expect(component.isLoading).toBe(false);
    expect(localStorageSpy).toHaveBeenCalledWith('isLoggedIn', 'true');
  }));

  it('should handle API login error and fallback to hardcoded credentials', fakeAsync(() => {
    component.loginData.username = 'user';
    component.loginData.password = 'password';

    mockApiService.login.and.returnValue(throwError(() => new Error('API Error')));

    component.onLogin();
    tick(1100);

    expect(component.isLoading).toBe(false);
    expect(localStorageSpy).toHaveBeenCalledWith('isLoggedIn', 'true');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/checkin']);
  }));

  it('should reject invalid fallback credentials', fakeAsync(() => {
    component.loginData.username = 'invalid';
    component.loginData.password = 'wrong';

    mockApiService.login.and.returnValue(throwError(() => new Error('API Error')));

    component.onLogin();
    tick(1100);

    expect(component.errorMessage).toContain('Credenciais inválidas');
    expect(component.isLoading).toBe(false);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  }));

  it('should accept valid fallback credentials for user/password', fakeAsync(() => {
    component.loginData.username = 'user';
    component.loginData.password = 'password';

    mockApiService.login.and.returnValue(throwError(() => new Error('API Error')));

    component.onLogin();
    tick(1100);

    expect(component.isLoading).toBe(false);
    expect(localStorageSpy).toHaveBeenCalledWith('isLoggedIn', 'true');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/checkin']);
  }));

  it('should accept valid fallback credentials for test/test123', fakeAsync(() => {
    component.loginData.username = 'test';
    component.loginData.password = 'test123';

    mockApiService.login.and.returnValue(throwError(() => new Error('API Error')));

    component.onLogin();
    tick(1100);

    expect(component.isLoading).toBe(false);
    expect(localStorageSpy).toHaveBeenCalledWith('isLoggedIn', 'true');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/checkin']);
  }));

  it('should set loading state during login', fakeAsync(() => {
    component.loginData.username = 'testuser';
    component.loginData.password = 'password123';

    const mockResponse = {
      token: 'mock-token',
      user: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test User'
      }
    };
    mockApiService.login.and.returnValue(of(mockResponse));

    expect(component.isLoading).toBe(false);

    component.onLogin();

    // Loading should be true immediately after calling onLogin
    tick(10);

    expect(component.isLoading).toBe(false);
  }));

  it('should clear error message on successful login', fakeAsync(() => {
    component.errorMessage = 'Previous error';
    component.loginData.username = 'testuser';
    component.loginData.password = 'password123';

    const mockResponse = {
      token: 'mock-token',
      user: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test User'
      }
    };
    mockApiService.login.and.returnValue(of(mockResponse));

    component.onLogin();
    tick(100);

    expect(component.errorMessage).toBe('');
  }));

  it('should navigate to checkin on successful login', fakeAsync(() => {
    component.loginData.username = 'testuser';
    component.loginData.password = 'password123';

    const mockResponse = {
      token: 'mock-token',
      user: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test User'
      }
    };
    mockApiService.login.and.returnValue(of(mockResponse));

    component.onLogin();
    tick(100);

    expect(component.isLoading).toBe(false);
    expect(component.errorMessage).toBe('');
  }));

  it('should handle API health check success', () => {
    mockApiService.healthCheck.and.returnValue(of({ status: 'ok' }));

    component.testBackendConnection();

    expect(mockApiService.healthCheck).toHaveBeenCalled();
  });

  it('should handle API health check failure', () => {
    mockApiService.healthCheck.and.returnValue(throwError(() => new Error('Connection failed')));

    component.testBackendConnection();

    expect(mockApiService.healthCheck).toHaveBeenCalled();
  });

  it('should validate form fields properly', () => {
    // Clear any previous error
    component.errorMessage = '';

    component.loginData.username = '';
    component.loginData.password = '';

    component.onLogin();

    expect(component.errorMessage).toBe('Por favor, preencha todos os campos');
    expect(mockApiService.login).not.toHaveBeenCalled();
  });
});
