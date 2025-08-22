import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'auth_token';

  constructor() { }

  /**
   * Simula o login e salva um token no localStorage.
   * Futuramente, esta função fará uma requisição HTTP para o backend.
   */
  public login(): void {
    // Para simular, salvamos um token de teste.
    // Futuramente, a resposta do backend (res.token) será usada aqui.
    const dummyToken = 'jwt_token_simulado_12345';
    localStorage.setItem(this.TOKEN_KEY, dummyToken);
  }

  /**
   * Remove o token de autenticação do localStorage para efetuar o logout.
   */
  public logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Retorna o token salvo no localStorage.
   */
  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Verifica se o usuário está autenticado, checando a existência do token.
   */
  public isLoggedIn(): boolean {
    return !!this.getToken();
  }
}