import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importe o HttpClient
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8082/login'; // ⚠️ Ajuste para a URL real do seu backend
  private readonly TOKEN_KEY = 'auth_token';

  // Injetando o HttpClient no construtor
  constructor(private http: HttpClient) {}

  /**
   * Envia as credenciais para o backend e salva o token da resposta.
   */
  public login(credentials: any): Observable<any> {
    // Faz a requisição POST para o endpoint de login do backend
    return this.http.post(`${this.API_URL}`, credentials).pipe(
      // 'tap' executa uma ação sem modificar o fluxo de dados
      tap((response: any) => {
        // ✅ Verifique se 'response.token' realmente contém o token JWT do seu backend
          console.log('Backend response after login:', response);
          if (response && response.accessToken) {
            this.setToken(response.accessToken);
            console.log('Token salvo:', this.getToken());
          } else {
            console.error('Token not found in login response!', response);
          }
      })
    );
  }

  // Métodos já existentes...
  public setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  public logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
