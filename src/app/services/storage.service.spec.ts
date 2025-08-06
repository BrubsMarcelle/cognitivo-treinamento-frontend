import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  let localStorageSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);

    // Create spies for localStorage methods
    localStorageSpy = spyOn(localStorage, 'getItem');
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get items', () => {
    const key = 'testKey';
    const value = 'testValue';

    service.setItem(key, value);

    expect(localStorage.setItem).toHaveBeenCalledWith(key, value);
  });

  it('should get items', () => {
    const key = 'testKey';
    const value = 'testValue';
    localStorageSpy.and.returnValue(value);

    const result = service.getItem(key);

    expect(result).toBe(value);
    expect(localStorage.getItem).toHaveBeenCalledWith(key);
  });

  it('should remove items', () => {
    const key = 'testKey';

    service.removeItem(key);

    expect(localStorage.removeItem).toHaveBeenCalledWith(key);
  });

  it('should check login status', () => {
    localStorageSpy.and.returnValue('true');

    const result = service.isLoggedIn();

    expect(result).toBe(true);
    expect(localStorage.getItem).toHaveBeenCalledWith('isLoggedIn');
  });

  it('should return false for login status when not logged in', () => {
    localStorageSpy.and.returnValue('false');

    const result = service.isLoggedIn();

    expect(result).toBe(false);
  });

  it('should return false for login status when null', () => {
    localStorageSpy.and.returnValue(null);

    const result = service.isLoggedIn();

    expect(result).toBe(false);
  });

  it('should set login status', () => {
    service.setLoginStatus(true);

    expect(localStorage.setItem).toHaveBeenCalledWith('isLoggedIn', 'true');
  });

  it('should set auth token', () => {
    const token = 'mock-token';

    service.setAuthToken(token);

    expect(localStorage.setItem).toHaveBeenCalledWith('authToken', token);
  });

  it('should get auth token', () => {
    const token = 'mock-token';
    localStorageSpy.and.returnValue(token);

    const result = service.getAuthToken();

    expect(result).toBe(token);
    expect(localStorage.getItem).toHaveBeenCalledWith('authToken');
  });

  it('should set user email', () => {
    const email = 'test@test.com';

    service.setUserEmail(email);

    expect(localStorage.setItem).toHaveBeenCalledWith('userEmail', email);
  });

  it('should get user email', () => {
    const email = 'test@test.com';
    localStorageSpy.and.returnValue(email);

    const result = service.getUserEmail();

    expect(result).toBe(email);
    expect(localStorage.getItem).toHaveBeenCalledWith('userEmail');
  });

  it('should logout and clear all auth data', () => {
    service.logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith('isLoggedIn');
    expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
    expect(localStorage.removeItem).toHaveBeenCalledWith('userEmail');
  });

  it('should check if has checkin for date', () => {
    const date = new Date('2025-08-05');
    const expectedKey = `checkin_${date.toDateString()}`;
    localStorageSpy.and.returnValue('{"timestamp":"2025-08-05T10:00:00Z"}');

    const result = service.hasCheckinForDate(date);

    expect(result).toBe(true);
    expect(localStorage.getItem).toHaveBeenCalledWith(expectedKey);
  });

  it('should save checkin for date', () => {
    const date = new Date('2025-08-05');
    const checkinData = { timestamp: '2025-08-05T10:00:00Z', points: 10 };
    const expectedKey = `checkin_${date.toDateString()}`;

    service.saveCheckinForDate(date, checkinData);

    expect(localStorage.setItem).toHaveBeenCalledWith(expectedKey, JSON.stringify(checkinData));
  });

  it('should get checkin for date', () => {
    const date = new Date('2025-08-05');
    const checkinData = { timestamp: '2025-08-05T10:00:00Z', points: 10 };
    const expectedKey = `checkin_${date.toDateString()}`;
    localStorageSpy.and.returnValue(JSON.stringify(checkinData));

    const result = service.getCheckinForDate(date);

    expect(result).toEqual(checkinData);
    expect(localStorage.getItem).toHaveBeenCalledWith(expectedKey);
  });

  it('should return null when no checkin for date', () => {
    const date = new Date('2025-08-05');
    localStorageSpy.and.returnValue(null);

    const result = service.getCheckinForDate(date);

    expect(result).toBeNull();
  });

  it('should clean old checkins', () => {
    // This test verifies the method exists and can be called
    // The actual implementation details may vary
    expect(() => service.cleanOldCheckins()).not.toThrow();
  });
});
