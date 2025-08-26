import { Component, inject } from '@angular/core';
import { RecuperarSenhaService } from '../../services/recuperar-senha.service';
import { RecuperarSenhaRequest } from '../../models/recuperar-senha-request';
import { CommonModule } from '@angular/common'; // ✅ Importe CommonModule
import { FormsModule } from '@angular/forms'; // ✅ Importe FormsModule

@Component({
  selector: 'app-reset-senha',
  imports: [
    CommonModule, // ✅ Adicione-o aqui
    FormsModule, // ✅ Adicione-o aqui
  ],
  templateUrl: './reset-senha.component.html',
  styleUrl: './reset-senha.component.scss',
})
export class ResetSenhaComponent {
  id: number | null = null;
  mensagem: string | null = null;
  private recuperarSenhaService = inject(RecuperarSenhaService);

  gerarSenha(): void {
    if (this.id !== null) {
      const dto: RecuperarSenhaRequest = { id: this.id };
      this.recuperarSenhaService.gerarSenhaProvisoria(this.id).subscribe({
        next: (response) => {
          this.mensagem = response.mensagem;
        },
        error: (err) => {
          this.mensagem = err.error.message;
        },
      });
    }
  }
}
