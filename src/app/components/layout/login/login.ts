import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, MdbFormsModule],
  templateUrl: './../login/login.html',
  styleUrl: './../login/login.scss',
})
export class Login {
  // Objeto para armazenar as credenciais do formulário
  credentials = {
    username: '',
    password: '',
  };

  // Injetando o Router e o AuthService no construtor
  constructor(private authService: AuthService, private router: Router) {}

  // Ação que será chamada ao clicar no botão "Entrar"
  onSubmit(): void {
    // Chama o método login do AuthService, passando o objeto de credenciais
    this.authService.login(this.credentials).subscribe(
      () => {
        // Se o login for bem-sucedido (o token foi salvo pelo AuthService)
        console.log('Login bem-sucedido!');
        // Redireciona o usuário para a página protegida (ex: dashboard)
        this.router.navigate(['/admin/home']);

        console.log(this.credentials);
      },
      (error) => {
        // Se houver um erro na requisição (ex: 401 Unauthorized)
        console.error('Login falhou:', error);
        // Exibe uma mensagem de erro para o usuário
        alert('Usuário ou senha inválidos.');
        // Opcional: limpa o formulário após a tentativa falha
        this.credentials.password = '';
      }
    );
  }
}
