import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { StorageService } from './storage.service';

describe('AuthService', () => {
  let service: AuthService;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockStorageService: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const storageSpy = jasmine.createSpyObj('StorageService', [
      'isLoggedIn', 'setAuthToken', 'setUserEmail', 'setLoginStatus',
      'logout', 'getUserEmail', 'getAuthToken'
    ]);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy },
        { provide: StorageService, useValue: storageSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockStorageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true when user is authenticated', () => {
    mockStorageService.isLoggedIn.and.returnValue(true);

    const result = service.isAuthenticated();

    expect(result).toBe(true);
    expect(mockStorageService.isLoggedIn).toHaveBeenCalled();
  });

  it('should return false when user is not authenticated', () => {
    mockStorageService.isLoggedIn.and.returnValue(false);

    const result = service.isAuthenticated();

    expect(result).toBe(false);
  });

  it('should login user with token and email', () => {
    const token = 'mock-token';
    const email = 'test@test.com';

    service.login(token, email);

    expect(mockStorageService.setAuthToken).toHaveBeenCalledWith(token);
    expect(mockStorageService.setUserEmail).toHaveBeenCalledWith(email);
    expect(mockStorageService.setLoginStatus).toHaveBeenCalledWith(true);
  });

  it('should get auth token', () => {
    mockStorageService.getAuthToken.and.returnValue('mock-token');

    const token = service.getAuthToken();

    expect(token).toBe('mock-token');
    expect(mockStorageService.getAuthToken).toHaveBeenCalled();
  });

  it('should get current user email', () => {
    mockStorageService.getUserEmail.and.returnValue('test@test.com');

    const email = service.getCurrentUserEmail();

    expect(email).toBe('test@test.com');
    expect(mockStorageService.getUserEmail).toHaveBeenCalled();
  });

  it('should logout and navigate to login', () => {
    service.logout();

    expect(mockStorageService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalled();
  });

  it('should redirect to login', () => {
    service.redirectToLogin();

    expect(mockRouter.navigate).toHaveBeenCalled();
  });

  it('should redirect to checkin', () => {
    service.redirectToCheckin();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/checkin']);
  });

  it('should return null when no auth token exists', () => {
    mockStorageService.getAuthToken.and.returnValue(null);

    const token = service.getAuthToken();

    expect(token).toBeNull();
  });

  it('should return null when no user email exists', () => {
    mockStorageService.getUserEmail.and.returnValue(null);

    const email = service.getCurrentUserEmail();

    expect(email).toBeNull();
  });
});
