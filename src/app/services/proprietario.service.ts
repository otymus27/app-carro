import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Proprietario } from '../models/proprietario';

@Injectable({
  providedIn: 'root'
})
export class ProprietarioService {

  private API = 'http://localhost:8081/api/proprietario'; // ajuste a URL do backend

  constructor(private http: HttpClient) {}

  listar(): Observable<Proprietario[]> {
    return this.http.get<Proprietario[]>(this.API);      
  }  

  buscarPorId(id: number): Observable<Proprietario> {
    return this.http.get<Proprietario>(`${this.API}/${id}`)
      .pipe(catchError(this.tratarErro));
  }

  cadastrar(proprietario: Partial<Proprietario>): Observable<Proprietario> {
    return this.http.post<Proprietario>(this.API, proprietario, { responseType: 'json' as 'json' })      
  } 

  atualizar(proprietario: Proprietario, id:number): Observable<string> {
    return this.http.patch<string>(this.API + "/"+id, proprietario, {responseType: 'text' as 'json'});
  }

  excluir(id:number): Observable<string> {
    return this.http.delete<string>(this.API + "/"+id, {responseType: 'text' as 'json'});
  }

  private tratarErro(error: HttpErrorResponse) {
    console.error('Ocorreu um erro:', error);
    return throwError(() => new Error(error.error?.mensagem || 'Erro ao processar requisição'));
  }
}
