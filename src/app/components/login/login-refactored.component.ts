import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { APP_CONSTANTS } from '../../constants/app.constants';
import { ValidationUtils } from '../../utils/validation.utils';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent implements OnInit {
  loginData = {
    username: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check if already logged in
    if (this.authService.isAuthenticated()) {
      this.authService.redirectToCheckin();
    }
  }

  onLogin(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const credentials = {
      username: ValidationUtils.sanitizeInput(this.loginData.username),
      password: this.loginData.password
    };

    this.apiService.login(credentials).subscribe({
      next: (response) => {
        this.handleLoginSuccess(response);
      },
      error: (error) => {
        console.error('❌ Erro no login:', error);
        this.handleLoginError(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private validateForm(): boolean {
    if (!ValidationUtils.isNotEmpty(this.loginData.username)) {
      this.errorMessage = 'Por favor, informe o nome de usuário';
      return false;
    }

    if (!ValidationUtils.isNotEmpty(this.loginData.password)) {
      this.errorMessage = 'Por favor, informe a senha';
      return false;
    }

    if (!ValidationUtils.isValidPassword(this.loginData.password)) {
      this.errorMessage = 'A senha deve ter pelo menos 6 caracteres';
      return false;
    }

    return true;
  }

  private handleLoginSuccess(response: any): void {
    this.successMessage = APP_CONSTANTS.MESSAGES.LOGIN_SUCCESS;

    // Save auth data
    this.authService.login(response.token, response.user.email);

    // Navigate to checkin page
    setTimeout(() => {
      this.authService.redirectToCheckin();
    }, 1000);
  }

  private handleLoginError(error: any): void {
    this.errorMessage = error.message || APP_CONSTANTS.MESSAGES.LOGIN_ERROR;
  }

  goToResetPassword(): void {
    this.router.navigate([APP_CONSTANTS.ROUTES.RESET_PASSWORD]);
  }

  goToCreateUser(): void {
    this.router.navigate([APP_CONSTANTS.ROUTES.CREATE_USER]);
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
