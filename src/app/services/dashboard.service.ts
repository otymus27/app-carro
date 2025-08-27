import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Opcional: interface para tipar os dados que virão do backend
export interface DashboardMetrics {
  totalCarros: number;
  totalUsuarios: number;
  totalProprietarios: number;
  totalMarcas: number;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  // ✅ Ajuste para a URL real do seu backend
  private apiUrl = 'http://localhost:8082/api/dashboard/metrics';

  constructor() {}

  getMetrics(): Observable<DashboardMetrics> {
    return this.http.get<DashboardMetrics>(this.apiUrl);
  }
}
