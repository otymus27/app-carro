import { inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Proprietario } from '../models/proprietario';
import { Paginacao } from '../models/paginacao';

@Injectable({
  providedIn: 'root',
})
export class ProprietarioService {
  http = inject(HttpClient);

  API = 'http://localhost:8082/api/proprietario';

  constructor() {}

  listar(
    page: number = 0,
    size: number = 5,
    sortField: keyof Proprietario = 'id',
    sortDirection: 'asc' | 'desc' = 'asc',
    nome?: string,
    cpf?: string
  ): Observable<Paginacao<Proprietario>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortField', sortField) // envia o campo para ordenar
      .set('sortDir', sortDirection); // envia a direção de ordenação

      if (nome) params = params.set('nome', nome);
      if (cpf) params = params.set('cpf', cpf);

    return this.http.get<Paginacao<Proprietario>>(this.API, { params });
  }

  buscarPorId(id: number): Observable<Proprietario> {
    return this.http
      .get<Proprietario>(`${this.API}/${id}`)
      .pipe(catchError(this.tratarErro));
  }

  cadastrar(proprietario: Partial<Proprietario>): Observable<Proprietario> {
    return this.http.post<Proprietario>(this.API, proprietario, {
      responseType: 'json' as 'json',
    });
  }

  atualizar(proprietario: Proprietario, id: number): Observable<string> {
    return this.http.patch<string>(this.API + '/' + id, proprietario, {
      responseType: 'text' as 'json',
    });
  }

  excluir(id: number): Observable<string> {
    return this.http.delete<string>(this.API + '/' + id, {
      responseType: 'text' as 'json',
    });
  }

  private tratarErro(error: HttpErrorResponse) {
    console.error('Ocorreu um erro:', error);
    return throwError(
      () => new Error(error.error?.mensagem || 'Erro ao processar requisição')
    );
  }
}
