import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { MesaRequest } from '../../shared/models/mesa-request.model';
import { MesaResponse } from '../../shared/models/mesa-response.model';
import { InvitadoResponse } from '../../shared/models/invitado-response.model';

@Injectable({
  providedIn: 'root'
})
export class MesaService {
  private apiUrl = `${environment.localUrl}/mesa`;

  constructor(private http: HttpClient) {}

  // Obtener todas las mesas
  getAllMesas(): Observable<MesaResponse[]> {
    return this.http.get<MesaResponse[]>(this.apiUrl);
  }

  // Obtener una mesa por ID
  getMesaById(id: number): Observable<MesaResponse> {
    return this.http.get<MesaResponse>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva mesa
  createMesa(mesa: MesaRequest): Observable<MesaRequest> {
    return this.http.post<MesaRequest>(this.apiUrl, mesa);
  }

  // Actualizar una mesa
  updateMesa(id: number, mesa: MesaRequest): Observable<MesaResponse> {
    return this.http.put<MesaResponse>(`${this.apiUrl}/${id}`, mesa);
  }

  // Eliminar una mesa
  deleteMesa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Asignar un invitado a una mesa
 // Asignar un invitado a una mesa
asignarMesa(invitadoId: number, mesaId: number): Observable<InvitadoResponse> {
  return this.http.put<InvitadoResponse>(`${this.apiUrl}/invitados/${invitadoId}/asignar-mesa/${mesaId}`, {});
}


  obtenerNombresInvitadosPorMesa(numero: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${numero}/invitados`);
  }
  retirarDeMesa(nombre: string): Observable<InvitadoResponse> {
    // Usamos el nombre en la URL en lugar del ID
    return this.http.put<InvitadoResponse>(`${this.apiUrl}/retirar/${nombre}`, {});  
  }
  
  
  
}
