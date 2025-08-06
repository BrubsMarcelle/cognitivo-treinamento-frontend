import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CreateUserComponent } from './create-user.component';
import { Api as ApiService } from '../../services/api';

describe('CreateUserComponent', () => {
  let component: CreateUserComponent;
  let fixture: ComponentFixture<CreateUserComponent>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['createUser']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        CreateUserComponent,
        HttpClientTestingModule,
        FormsModule
      ],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUserComponent);
    component = fixture.componentInstance;
    mockApiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form data', () => {
    expect(component.userData.username).toBe('');
    expect(component.userData.password).toBe('');
    expect(component.confirmPassword).toBe('');
    expect(component.isLoading).toBe(false);
    expect(component.errorMessage).toBe('');
    expect(component.successMessage).toBe('');
  });

  describe('Form Validation', () => {
    it('should show error for empty username', () => {
      component.userData.username = '';
      component.userData.password = 'password123';
      component.confirmPassword = 'password123';

      component.onSubmit();

      expect(component.errorMessage).toBe('Por favor, preencha nome de usuário e senha');
      expect(mockApiService.createUser).not.toHaveBeenCalled();
    });

    it('should show error for empty password', () => {
      component.userData.username = 'testuser';
      component.userData.password = '';
      component.confirmPassword = 'password123';

      component.onSubmit();

      expect(component.errorMessage).toBe('Por favor, preencha nome de usuário e senha');
      expect(mockApiService.createUser).not.toHaveBeenCalled();
    });

    it('should show error for mismatched passwords', () => {
      component.userData.username = 'testuser';
      component.userData.password = 'password123';
      component.confirmPassword = 'different123';

      component.onSubmit();

      expect(component.errorMessage).toBe('As senhas não coincidem');
      expect(mockApiService.createUser).not.toHaveBeenCalled();
    });

    it('should proceed with valid form data', () => {
      component.userData.username = 'testuser';
      component.userData.password = 'password123';
      component.confirmPassword = 'password123';

      mockApiService.createUser.and.returnValue(of({ message: 'Success' }));

      component.onSubmit();

      expect(mockApiService.createUser).toHaveBeenCalled();
      expect(component.errorMessage).toBe('');
    });
  });

  describe('User Creation', () => {
    beforeEach(() => {
      component.userData.username = 'testuser';
      component.userData.password = 'password123';
      component.confirmPassword = 'password123';
    });

    it('should create user successfully', () => {
      const mockResponse = { message: 'User created successfully' };
      mockApiService.createUser.and.returnValue(of(mockResponse));

      component.onSubmit();

      expect(mockApiService.createUser).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123'
      });
      expect(component.errorMessage).toBe('');
    });

    it('should handle successful user creation response', (done) => {
      const mockResponse = { message: 'User created successfully' };
      mockApiService.createUser.and.returnValue(of(mockResponse));

      component.onSubmit();

      setTimeout(() => {
        expect(component.successMessage).toBe('Usuário criado com sucesso! Redirecionando...');
        expect(component.errorMessage).toBe('');
        done();
      }, 100);
    });

    it('should navigate to login after successful creation', (done) => {
      const mockResponse = { message: 'User created successfully' };
      mockApiService.createUser.and.returnValue(of(mockResponse));

      component.onSubmit();

      setTimeout(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
        done();
      }, 2100);
    });

    it('should handle API error during user creation', () => {
      const mockError = { error: { message: 'Username already exists' } };
      mockApiService.createUser.and.returnValue(throwError(() => mockError));

      component.onSubmit();

      expect(component.errorMessage).toBe('Username already exists');
      expect(component.successMessage).toBe('');
    });

    it('should handle generic API error', () => {
      const mockError = { message: 'Network error' };
      mockApiService.createUser.and.returnValue(throwError(() => mockError));

      component.onSubmit();

      expect(component.errorMessage).toBe('Erro ao criar usuário');
      expect(component.successMessage).toBe('');
    });

    it('should not submit invalid form', () => {
      component.userData.username = '';
      component.userData.password = 'password123';
      component.confirmPassword = 'password123';

      component.onSubmit();

      expect(mockApiService.createUser).not.toHaveBeenCalled();
      expect(component.isLoading).toBe(false);
    });
  });

  describe('Form Methods', () => {
    it('should call onSubmit when onCreateUser is called', () => {
      spyOn(component, 'onSubmit');

      component.onCreateUser();

      expect(component.onSubmit).toHaveBeenCalled();
    });

    it('should navigate to login when goToLogin is called', () => {
      component.goToLogin();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('Loading State', () => {
    it('should handle loading state properly', () => {
      component.userData.username = 'testuser';
      component.userData.password = 'password123';
      component.confirmPassword = 'password123';

      mockApiService.createUser.and.returnValue(of({ message: 'Success' }));

      component.onSubmit();

      expect(mockApiService.createUser).toHaveBeenCalled();
    });

    it('should process submissions correctly', () => {
      component.userData.username = 'testuser';
      component.userData.password = 'password123';
      component.confirmPassword = 'password123';

      mockApiService.createUser.and.returnValue(of({ message: 'Success' }));

      component.onSubmit();

      expect(mockApiService.createUser).toHaveBeenCalled();
    });
  });
});
