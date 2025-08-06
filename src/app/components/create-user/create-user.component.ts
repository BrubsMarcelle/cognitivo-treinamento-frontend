import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Api } from '../../services/api';
import { CreateUserRequest } from '../../models';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {
  userData: CreateUserRequest = {
    username: '',
    email: '',
    password: '',
    nome: ''
  };

  confirmPassword = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private apiService: Api, private router: Router) {}

  onCreateUser(): void {
    this.onSubmit();
  }

  onSubmit(): void {

    if (this.isValidForm()) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const createUserPayload = {
        username: this.userData.username,
        password: this.userData.password
      };

      this.apiService.createUser(createUserPayload).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.successMessage = 'Usuário criado com sucesso! Redirecionando...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error: any) => {
          console.error('❌ Erro ao criar usuário:', error);
          this.isLoading = false;
          this.errorMessage = error?.error?.message || 'Erro ao criar usuário';
        }
      });
    } else {
      console.log('❌ Formulário inválido, não enviando requisição');
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToResetPassword(): void {
    this.router.navigate(['/reset-password']);
  }

  private isValidForm(): boolean {

    if (!this.userData.username || !this.userData.password) {
      this.errorMessage = 'Por favor, preencha nome de usuário e senha';
      return false;
    }

    if (this.userData.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem';
      return false;
    }

    console.log('✅ Formulário válido!');
    return true;
  }
}
