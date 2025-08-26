import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecuperarSenhaRequest } from '../models/recuperar-senha-request';
import { ResetSenhaRequest } from '../models/reset-senha-request';

@Injectable({
  providedIn: 'root',
})
export class RecuperarSenhaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8082/api/recuperar';

  // Endpoint para o ADMIN
  // ✅ Método que gera uma senha provisória com base no ID
  gerarSenhaProvisoria(id: number): Observable<any> {
    // A requisição POST espera um corpo. O corpo aqui é um DTO simples com o ID.
    // Isso evita o uso de DTOs complexos e mantém o código mais limpo.
    const body = { id };
    return this.http.post(`${this.apiUrl}/gerar-senha`, body);
  }

  // Endpoint para o usuário
  atualizarSenha(dto: ResetSenhaRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/redefinir-senha`, dto);
  }
}
