import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div class="d-flex justify-content-center align-items-center" style="height: 100vh;">
      <div class="card p-4 shadow-sm" style="width: 350px;">
        <h3 class="card-title text-center">Login</h3>
        <p class="text-center">Simule o login para acessar o sistema.</p>
        <button class="btn btn-primary w-100" (click)="login()">Entrar</button>
      </div>
    </div>
  `,
  // Lembre-se de adicionar `Router` e `AuthService` nas importações se estiver usando módulos
})
export class Login {

  constructor(
    private authService: AuthService, 
    private router: Router
  ) { }

  login() {
    // Simula uma validação de credenciais
    // Você pode adicionar um formulário aqui
    this.authService.login();
    this.router.navigate(['/admin']);
  }
}
