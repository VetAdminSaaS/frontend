import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { ApoderadoByAdmin } from "../../shared/models/apoderadobyadmin.model";
import { ApoderadoRequest } from "../../shared/models/apoderado-request.model";
import { ApoderadoResponse } from "../../shared/models/apoderado-response.model";

@Injectable({
  providedIn: 'root',
})
export class ApoderadoService {
  private apiUrl = `${environment.localUrl}/apoderado`;

  constructor(private http: HttpClient) {}

  // Crear un apoderado (normal)
  crearApoderado(apoderado: ApoderadoRequest): Observable<ApoderadoResponse> {
    return this.http.post<ApoderadoResponse>(`${this.apiUrl}`, apoderado);
  }

  // Obtener apoderado por ID
  obtenerApoderadoPorId(id: number): Observable<ApoderadoResponse> {
    return this.http.get<ApoderadoResponse>(`${this.apiUrl}/${id}`);
  }

  // Obtener todos los apoderados
  obtenerTodosLosApoderados(): Observable<ApoderadoResponse[]> {
    return this.http.get<ApoderadoResponse[]>(`${this.apiUrl}`);
  }

  // Actualizar un apoderado
  actualizarApoderado(id: number, apoderado: ApoderadoRequest): Observable<ApoderadoResponse> {
    return this.http.put<ApoderadoResponse>(`${this.apiUrl}/${id}`, apoderado);
  }

  // Eliminar un apoderado
  eliminarApoderado(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Crear apoderado desde un administrador
  crearApoderadoByAdmin(apoderado: ApoderadoByAdmin): Observable<ApoderadoResponse> {
    return this.http.post<ApoderadoResponse>(`${this.apiUrl}/crear`, apoderado);
  }
}
