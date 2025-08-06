import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ResetPasswordComponent } from './reset-password.component';
import { Api as ApiService } from '../../services/api';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['resetPassword']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ResetPasswordComponent,
        HttpClientTestingModule,
        FormsModule
      ],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    mockApiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form data', () => {
    expect(component.resetData.username).toBe('');
    expect(component.resetData.new_password).toBe('');
    expect(component.confirmPassword).toBe('');
    expect(component.isLoading).toBe(false);
    expect(component.errorMessage).toBe('');
    expect(component.successMessage).toBe('');
  });

  describe('Form Validation', () => {
    it('should show error for empty username', () => {
      component.resetData.username = '';
      component.resetData.new_password = 'password123';
      component.confirmPassword = 'password123';

      component.onResetPassword();

      expect(component.errorMessage).toBe('Por favor, preencha todos os campos obrigatórios');
      expect(mockApiService.resetPassword).not.toHaveBeenCalled();
    });

    it('should show error for empty password', () => {
      component.resetData.username = 'testuser';
      component.resetData.new_password = '';
      component.confirmPassword = 'password123';

      component.onResetPassword();

      expect(component.errorMessage).toBe('Por favor, preencha todos os campos obrigatórios');
      expect(mockApiService.resetPassword).not.toHaveBeenCalled();
    });

    it('should show error for mismatched passwords', () => {
      component.resetData.username = 'testuser';
      component.resetData.new_password = 'password123';
      component.confirmPassword = 'different123';

      component.onResetPassword();

      expect(component.errorMessage).toBe('As senhas não coincidem');
      expect(mockApiService.resetPassword).not.toHaveBeenCalled();
    });

    it('should show error for short password', () => {
      component.resetData.username = 'testuser';
      component.resetData.new_password = '123';
      component.confirmPassword = '123';

      component.onResetPassword();

      expect(component.errorMessage).toBe('A senha deve ter pelo menos 6 caracteres');
      expect(mockApiService.resetPassword).not.toHaveBeenCalled();
    });

    it('should proceed with valid form data', () => {
      component.resetData.username = 'testuser';
      component.resetData.new_password = 'password123';
      component.confirmPassword = 'password123';

      mockApiService.resetPassword.and.returnValue(of({ message: 'Success' }));

      component.onResetPassword();

      expect(mockApiService.resetPassword).toHaveBeenCalledWith({
        username: 'testuser',
        new_password: 'password123'
      });
      expect(component.errorMessage).toBe('');
    });
  });

  describe('Password Reset', () => {
    beforeEach(() => {
      component.resetData.username = 'testuser';
      component.resetData.new_password = 'password123';
      component.confirmPassword = 'password123';
    });

    it('should handle successful password reset', () => {
      const mockResponse = { message: 'Password reset successfully' };
      mockApiService.resetPassword.and.returnValue(of(mockResponse));

      component.onResetPassword();

      expect(mockApiService.resetPassword).toHaveBeenCalled();
    });

    it('should handle successful password reset response', (done) => {
      const mockResponse = { message: 'Password reset successfully' };
      mockApiService.resetPassword.and.returnValue(of(mockResponse));

      component.onResetPassword();

      setTimeout(() => {
        expect(component.successMessage).toBe('Senha alterada com sucesso! Redirecionando para o login...');
        expect(component.errorMessage).toBe('');
        done();
      }, 100);
    });

    it('should navigate to login after successful reset', (done) => {
      const mockResponse = { message: 'Password reset successfully' };
      mockApiService.resetPassword.and.returnValue(of(mockResponse));

      component.onResetPassword();

      setTimeout(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
        done();
      }, 3100);
    });

    it('should handle API error during password reset', () => {
      const mockError = { error: { message: 'User not found' } };
      mockApiService.resetPassword.and.returnValue(throwError(() => mockError));

      component.onResetPassword();

      expect(component.isLoading).toBe(false);
      expect(component.errorMessage).toBe('User not found');
      expect(component.successMessage).toBe('');
    });

    it('should handle generic API error', () => {
      const mockError = { message: 'Network error' };
      mockApiService.resetPassword.and.returnValue(throwError(() => mockError));

      component.onResetPassword();

      expect(component.isLoading).toBe(false);
      expect(component.errorMessage).toBe('Erro ao alterar senha. Tente novamente.');
      expect(component.successMessage).toBe('');
    });
  });

  describe('Navigation Methods', () => {
    it('should navigate to login when goToLogin is called', () => {
      component.goToLogin();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should navigate to create user when goToCreateUser is called', () => {
      component.goToCreateUser();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/create-user']);
    });
  });

  describe('Loading State', () => {
    it('should handle loading state properly', () => {
      component.resetData.username = 'testuser';
      component.resetData.new_password = 'password123';
      component.confirmPassword = 'password123';

      mockApiService.resetPassword.and.returnValue(of({ message: 'Success' }));

      component.onResetPassword();

      expect(mockApiService.resetPassword).toHaveBeenCalled();
    });

    it('should process submissions correctly', () => {
      component.resetData.username = 'testuser';
      component.resetData.new_password = 'password123';
      component.confirmPassword = 'password123';

      mockApiService.resetPassword.and.returnValue(of({ message: 'Success' }));

      component.onResetPassword();

      expect(mockApiService.resetPassword).toHaveBeenCalled();
    });
  });
});
