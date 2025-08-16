import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Carro} from '../models/carro';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarroService {

  http = inject(HttpClient);

  API = 'http://localhost:8081/api/carro';
 

  constructor() { }

  listar(): Observable<Carro[]>{
    return this.http.get<Carro[]>(this.API );
  }

  excluir(id:number): Observable<string> {
    return this.http.delete<string>(this.API + '/delete/' + id, {responseType: 'text' as 'json'});
  }

  save(carro: Carro): Observable<string> {
    return this.http.post<string>(this.API + '/save', carro, {responseType: 'text' as 'json'});
  }

  update(carro: Carro, id:number): Observable<string> {
    return this.http.put<string>(this.API + '/update', carro, {responseType: 'text' as 'json'});
  }

  buscarPorId(id: number): Observable<Carro> {
    return this.http.get<Carro>(this.API + '/buscarPorId/' + id);
  }
}
