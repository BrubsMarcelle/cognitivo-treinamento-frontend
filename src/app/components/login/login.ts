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
export class Login implements OnInit {
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

  ngOnInit() {
    // Test backend connectivity on initialization
    this.testBackendConnection();
  }

  testBackendConnection() {
    this.apiService.healthCheck().subscribe({
      next: (response) => {
        // Backend connected successfully
      },
      error: (error) => {
        // Backend not accessible - error already logged in service
      }
    });
  }

  onLogin() {
    if (!this.loginData.username || !this.loginData.password) {
      this.errorMessage = 'Por favor, preencha todos os campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Create credentials object in the format expected by the API
    const credentials = {
      username: this.loginData.username,
      password: this.loginData.password
    };

    // First, try login via API
    this.apiService.login(credentials).subscribe({
      next: (response) => {
        this.successMessage = 'Login realizado com sucesso!';

        // Save token and user data
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('tokenType', 'Bearer');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', response.user.email);
        localStorage.setItem('userName', response.user.name);
        localStorage.setItem('userId', response.user.id.toString());

        this.isLoading = false;

        // Wait a bit to show success message
        setTimeout(() => {
          this.router.navigate(['/checkin']);
        }, 1000);
      },
      error: (error) => {
        console.error('Erro no login via API:', error);

        // Try fallback login
        this.tryFallbackLogin(credentials);
      }
    });
  }

  private tryFallbackLogin(credentials: any) {
    // Fallback login logic for offline mode
    const validCredentials = [
      { username: 'admin', password: '123456' },
      { username: 'user', password: 'password' },
      { username: 'test', password: 'test123' }
    ];

    const isValid = validCredentials.some(cred =>
      cred.username === credentials.username && cred.password === credentials.password
    );

    if (isValid) {
      this.successMessage = 'Login realizado com sucesso! (Modo offline)';

      // Save fallback auth data
      localStorage.setItem('authToken', 'fallback-token-' + Date.now());
      localStorage.setItem('tokenType', 'Bearer');
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', credentials.username + '@local.com');
      localStorage.setItem('userName', credentials.username);
      localStorage.setItem('userId', '1');

      this.isLoading = false;

      setTimeout(() => {
        this.router.navigate(['/checkin']);
      }, 1000);
    } else {
      this.isLoading = false;
      this.errorMessage = 'Credenciais inválidas. Tente: admin/123456, user/password ou test/test123';
    }
  }

  goToResetPassword() {
    this.router.navigate(['/reset-password']);
  }

  goToCreateUser() {
    this.router.navigate(['/create-user']);
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
