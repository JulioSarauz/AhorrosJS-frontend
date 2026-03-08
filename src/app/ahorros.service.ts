import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Esto hace que el servicio esté disponible en toda la app
})
export class AhorrosService {
  private http = inject(HttpClient);
  guardarEnCelda(celda: string, texto: string): Observable<any> {
    const payload = {
      celda: celda,
      texto: texto
    };

    // Angular automáticamente añade los headers Content-Type y Accept
    return this.http.post(`${environment.apiUrl}/escribir-celda`, payload);
  }
}