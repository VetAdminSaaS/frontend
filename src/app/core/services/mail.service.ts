import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Mailservice {
  private apiUrl =`${environment.localUrl}/mail`

  constructor(private http: HttpClient){}
  
  enviarRecuperarContrasenaEmail(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/sendMail`, { email });
  }
  recuperarContraseña(newContrasena: string, token: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reset/${token}`, { newContrasena }).pipe(
      catchError(error => {
        console.error('Error al restablecer contraseña:', error);
        return throwError(() => new Error('No se pudo restablecer la contraseña.'));
      })
    );
  }
  
}