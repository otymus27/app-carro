import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Marca } from '../models/marca';

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

  listar(): Observable<Marca[]> {
    return this.http.get<Marca[]>(this.API);
  }

  listarPaginado(page: number, size: number): Observable<any> {
    let params = new HttpParams().set('page', page).set('size', size);

    return this.http.get<any>(this.API, { params });
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
