import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, MdbFormsModule,MdbRippleModule],
  templateUrl: './../login/login.html',
  styleUrl: './../login/login.scss',
})
export class Login {
  // A propriedade 'credentials' já está em uso, vamos mantê-la
  credentials = {
    username: '',
    password: ''
  };
  errorMessage: string | null = null;
  loading = false; // ✅ Propriedade para controlar o estado de carregamento

  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {}

  onSubmit(): void {
    this.errorMessage = null; // Limpa a mensagem de erro anterior
    this.loading = true; // Ativa o spinner

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        // A navegação já é tratada dentro do authService
        this.loading = false; // Desativa o spinner
      },
      error: (error) => {
        this.loading = false; // Desativa o spinner
        if (error.status === 401) {
          this.errorMessage = 'Credenciais inválidas. Verifique seu usuário e senha.';
        } else {
          this.errorMessage = 'Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.';
          console.error('Erro de login:', error);
        }
      }
    });
  }
}