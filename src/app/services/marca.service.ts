import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Marca } from '../models/marca';
import { Paginacao } from '../models/paginacao';

export interface ResponseMsg {
  mensagem: string;
}

@Injectable({
  providedIn: 'root',
})
export class MarcaService {
  http = inject(HttpClient);

  API = 'http://localhost:8081/api/marca';

  constructor() {}


  // Listar marcas com paginação
  listar(page: number = 0, size: number = 5): Observable<Paginacao<Marca>> {
    return this.http.get<Paginacao<Marca>>(`${this.API + '/paginado/'}?page=${page}&size=${size}`);
  }

  excluir(id: number): Observable<string> {
    return this.http.delete<string>(this.API + '/' + id, {
      responseType: 'text' as 'json',
    });
  }

  save(marca: Partial<Marca>): Observable<Marca> {
    return this.http.post<Marca>(this.API, marca, {
      responseType: 'text' as 'json',
    });
  }

  update(marca: Marca, id: number): Observable<string> {
    return this.http.put<string>(this.API + '/' + id, marca, {
      responseType: 'text' as 'json',
    });
  }

  buscarPorId(id: number): Observable<Marca> {
    return this.http.get<Marca>(this.API + '/' + id);
  }
}
