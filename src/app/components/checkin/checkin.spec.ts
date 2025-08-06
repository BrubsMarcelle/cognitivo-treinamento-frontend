import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { CheckinComponent } from './checkin.component';
import { Api } from '../../services/api';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';

describe('CheckinComponent', () => {
  let component: CheckinComponent;
  let fixture: ComponentFixture<CheckinComponent>;
  let mockApi: jasmine.SpyObj<Api>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockStorageService: jasmine.SpyObj<StorageService>;

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('Api', ['getCheckinStatus', 'doCheckin', 'getCheckins', 'getRanking']);
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'redirectToLogin', 'logout']);
    const storageSpy = jasmine.createSpyObj('StorageService', ['hasCheckinForDate', 'getCheckinForDate', 'setItem', 'removeItem', 'cleanOldCheckins', 'getItem']);

    await TestBed.configureTestingModule({
      imports: [
        CheckinComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: Api, useValue: apiSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: StorageService, useValue: storageSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckinComponent);
    component = fixture.componentInstance;
    mockApi = TestBed.inject(Api) as jasmine.SpyObj<Api>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockStorageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to login if user is not authenticated', () => {
    mockAuthService.isAuthenticated.and.returnValue(false);

    component.ngOnInit();

    expect(mockAuthService.redirectToLogin).toHaveBeenCalled();
  });

  it('should initialize checkin status when authenticated', () => {
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockApi.getCheckinStatus.and.returnValue(of({
      can_checkin: true,
      reason: '',
      message: '',
      today: '2025-08-05',
      is_weekend: false,
      already_checked_in: false
    }));
    mockApi.getCheckins.and.returnValue(of([]));
    mockApi.getRanking.and.returnValue(of([]));

    component.ngOnInit();

    expect(mockApi.getCheckinStatus).toHaveBeenCalled();
    expect(mockApi.getRanking).toHaveBeenCalled();
  });

  it('should perform checkin successfully', fakeAsync(() => {
    component.canCheckIn = true;
    component.isLoading = false;

    const mockResponse = {
      id: 1,
      userId: 1,
      timestamp: '2025-08-05T10:00:00Z',
      points: 10
    };

    mockApi.doCheckin.and.returnValue(of(mockResponse));
    mockApi.getRanking.and.returnValue(of([]));

    component.doCheckin();
    tick();

    expect(component.checkinSuccess).toBe(true);
    expect(component.canCheckIn).toBe(false);
    expect(component.isLoading).toBe(false);
  }));

  it('should handle checkin error gracefully', fakeAsync(() => {
    component.canCheckIn = true;
    component.isLoading = false;

    mockApi.doCheckin.and.returnValue(throwError(() => new Error('Network error')));

    component.doCheckin();
    tick();

    expect(component.checkinSuccess).toBe(true); // Falls back to offline success
    expect(component.canCheckIn).toBe(false);
  }));

  it('should not allow checkin when loading', () => {
    component.canCheckIn = true;
    component.isLoading = true;

    component.doCheckin();

    expect(mockApi.doCheckin).not.toHaveBeenCalled();
  });

  it('should not allow checkin when already checked in', () => {
    component.canCheckIn = false;
    component.isLoading = false;

    component.doCheckin();

    expect(mockApi.doCheckin).not.toHaveBeenCalled();
  });

  it('should reset checkin status', () => {
    mockStorageService.getItem.and.returnValue('{"timestamp":"2025-08-05T10:00:00Z"}');

    component.resetTodayCheckin();

    expect(mockStorageService.removeItem).toHaveBeenCalled();
    expect(component.canCheckIn).toBe(true);
    expect(component.checkinSuccess).toBe(false);
  });

  it('should format time correctly', () => {
    component.currentTime = new Date('2025-08-05T10:30:45');

    const formattedTime = component.formattedTime;

    expect(formattedTime).toContain('10');
    expect(formattedTime).toContain('30');
  });

  it('should track users by id', () => {
    const user = { id: 1, name: 'Test User', email: 'test@test.com', department: 'IT', position: 'Dev', startDate: '2025-01-01', totalPoints: 100, totalCheckins: 5, currentStreak: 3 };

    const result = component.trackByUserId(0, user);

    expect(result).toBe(1);
  });
});
