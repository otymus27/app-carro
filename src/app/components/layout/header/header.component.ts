import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router'; // Importe o Router
import { AuthService } from '../../../services/auth.service'; // Importe o AuthService

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  constructor(
    private authService: AuthService, // Injete o AuthService
    private router: Router // Injete o Router
  ) {}

  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }

  // ✅ Método de logout
  logout() {
    this.authService.logout(); // Chama o método de logout do serviço
    this.router.navigate(['/login']); // Redireciona para a tela de login
  }
}