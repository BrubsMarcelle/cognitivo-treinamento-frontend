import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../services/api';
import { ResetPasswordRequest } from '../../models';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  resetData: ResetPasswordRequest = {
    username: '',
    new_password: ''
  };

  confirmPassword = '';
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private apiService: Api, private router: Router) {}

  onResetPassword() {
    if (!this.resetData.username || !this.resetData.new_password) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios';
      return;
    }

    if (this.resetData.new_password !== this.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem';
      return;
    }

    if (this.resetData.new_password.length < 6) {
      this.errorMessage = 'A senha deve ter pelo menos 6 caracteres';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.apiService.resetPassword(this.resetData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.successMessage = 'Senha alterada com sucesso! Redirecionando para o login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message || 'Erro ao alterar senha. Tente novamente.';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToCreateUser() {
    this.router.navigate(['/create-user']);
  }
}
