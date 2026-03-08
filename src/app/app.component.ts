import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AhorrosService } from './ahorros.service'; // <-- Importamos el servicio

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>💰 Registro de Ahorros</h2>
      
      <div class="form-group">
        <label>Mes:</label>
        <select [(ngModel)]="mesSeleccionado">
          <option *ngFor="let m of meses" [value]="m.nombre">{{ m.nombre }}</option>
        </select>
      </div>

      <div class="form-group">
        <label>Año:</label>
        <select [(ngModel)]="anioSeleccionado">
          <option *ngFor="let a of anos" [value]="a">{{ a }}</option>
        </select>
      </div>

      <div class="form-group">
        <label>Valor a ahorrar ($):</label>
        <input type="number" [(ngModel)]="valorAhorro" placeholder="Ej. 150">
      </div>

      <button (click)="enviarDatos()" [disabled]="cargando">
        {{ cargando ? 'Guardando...' : 'Guardar en Google Sheets' }}
      </button>

      <p class="mensaje" *ngIf="mensaje" [ngClass]="{'error': esError}">
        {{ mensaje }}
      </p>
    </div>
  `,
  styles: [`
    .container { max-width: 400px; margin: 50px auto; font-family: sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 8px; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; font-weight: bold; }
    select, input { width: 100%; padding: 8px; box-sizing: border-box; }
    button { width: 100%; padding: 10px; background-color: #0F9D58; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
    button:disabled { background-color: #aaa; }
    .mensaje { margin-top: 15px; padding: 10px; border-radius: 4px; text-align: center; }
    .error { background-color: #f8d7da; color: #721c24; }
    p:not(.error) { background-color: #d4edda; color: #155724; }
  `]
})
export class AppComponent {
  // Inyectamos nuestro nuevo servicio
  private ahorrosService = inject(AhorrosService);
  
  meses = [
    { nombre: 'Enero', celda: 'B2' },
    { nombre: 'Febrero', celda: 'B3' },
    { nombre: 'Marzo', celda: 'B4' },
    { nombre: 'Abril', celda: 'B5' },
    { nombre: 'Mayo', celda: 'B6' },
    { nombre: 'Junio', celda: 'B7' },
    { nombre: 'Julio', celda: 'B8' },
    { nombre: 'Agosto', celda: 'B9' },
    { nombre: 'Septiembre', celda: 'B10' },
    { nombre: 'Octubre', celda: 'B11' },
    { nombre: 'Noviembre', celda: 'B12' },
    { nombre: 'Diciembre', celda: 'B13' }
  ];
  
  anos = [2024, 2025, 2026, 2027];
  
  mesSeleccionado = 'Enero';
  anioSeleccionado = 2026;
  valorAhorro: number | null = null;
  
  cargando = false;
  mensaje = '';
  esError = false;

  enviarDatos() {
    if (!this.valorAhorro) {
      this.mostrarMensaje('Por favor ingresa un valor.', true);
      return;
    }

    this.cargando = true;
    this.mensaje = '';

    const mesObj = this.meses.find(m => m.nombre === this.mesSeleccionado);
    const celdaDestino = mesObj ? mesObj.celda : 'A1';
    
    // El texto que armamos (Ej: "$150 (Año: 2026)")
    const textoAGuardar = `$${this.valorAhorro} (Año: ${this.anioSeleccionado})`;

    // Usamos el servicio pasándole exactamente los dos parámetros del cURL
    this.ahorrosService.guardarEnCelda(celdaDestino, textoAGuardar).subscribe({
      next: (res) => {
        this.cargando = false;
        this.mostrarMensaje(`¡Guardado exitosamente en la celda ${celdaDestino}!`, false);
        this.valorAhorro = null;
      },
      error: (err) => {
        this.cargando = false;
        console.error(err);
        this.mostrarMensaje('Error al conectar con el servidor.', true);
      }
    });
  }

  mostrarMensaje(msg: string, isError: boolean) {
    this.mensaje = msg;
    this.esError = isError;
    setTimeout(() => this.mensaje = '', 5000);
  }
}