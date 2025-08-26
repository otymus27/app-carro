import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RelatorioService {
  http = inject(HttpClient);

  // ✅ Endpoint para a geração de relatórios
  private apiUrl = 'http://localhost:8082/api/relatorios'; // ✅ Mude a URL para o seu backend

  constructor() {}

  gerarRelatorioCarros(
    formato: string,
    dataInicial?: string,
    dataFinal?: string
  ): Observable<Blob> {
    let params = new HttpParams().set('formato', formato);

    // Adiciona os filtros se eles existirem
    if (dataInicial) {
      params = params.set('dataInicial', dataInicial);
    }
    if (dataFinal) {
      params = params.set('dataFinal', dataFinal);
    }

    // A requisição precisa retornar um 'blob' para arquivos
    return this.http.get(`${this.apiUrl}/carros`, {
      responseType: 'blob',
      params: params,
    });
  }

  gerarRelatorioMarcas(
    formato: string,
    nome?: string, // ✅ Adicione os novos parâmetros
    sortField?: string,
    sortDir?: string
  ): Observable<Blob> {
    let params = new HttpParams().set('formato', formato);

    if (nome) {
      params = params.set('nome', nome);
    }

    // ✅ Adicione os parâmetros de ordenação
    if (sortField) {
      params = params.set('sortField', sortField);
    }
    if (sortDir) {
      params = params.set('sortDir', sortDir);
    }

    return this.http.get(`${this.apiUrl}/marcas`, {
      responseType: 'blob',
      params: params,
    });
  }
}
