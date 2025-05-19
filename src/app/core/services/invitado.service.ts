import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { InvitadoRequest } from '../../shared/models/invitado-request.model';
import { InvitadoResponse } from '../../shared/models/invitado-response.model';

@Injectable({
  providedIn: 'root'
})
export class InvitadoService {
  private apiUrl = `${environment.localUrl}/invitados`;

  constructor(private http: HttpClient) {}


  getAll(): Observable<InvitadoResponse[]> {
    return this.http.get<InvitadoResponse[]>(`${this.apiUrl}`);
  }

  // ✅ Obtener un invitado por ID
  findById(id: number): Observable<InvitadoResponse> {
    return this.http.get<InvitadoResponse>(`${this.apiUrl}/${id}`);
  }

  // ✅ Crear un nuevo invitado
  create(invitado: InvitadoRequest): Observable<InvitadoResponse> {
    return this.http.post<InvitadoResponse>(`${this.apiUrl}`,invitado);
  }

  // ✅ Actualizar un invitado
  update(id: number, invitado: InvitadoRequest): Observable<InvitadoResponse> {
    return this.http.put<InvitadoResponse>(`${this.apiUrl}/${id}`, invitado);
  }

  // ✅ Eliminar un invitado
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
