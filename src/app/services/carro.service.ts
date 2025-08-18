import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Carro} from '../models/carro';
import {Observable} from 'rxjs';
import { CarroCreateDTO } from '../models/carro-create-dto';

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
    return this.http.delete<string>(this.API + "/"+id, {responseType: 'text' as 'json'});
  }
 
  cadastrar(carro: CarroCreateDTO): Observable<any> {
    return this.http.post<Carro>(this.API, carro, {responseType: 'text' as 'json'});
  }

  atualizar(carro: Carro, id: number): Observable<string> {
    return this.http.put<string>(`${this.API}/${id}`, carro, { responseType: 'text' as 'json' });
  }

  buscarPorId(id: number): Observable<Carro> {
    return this.http.get<Carro>(this.API + '/buscarPorId/' + id);
  }
}
