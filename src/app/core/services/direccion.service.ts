import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DireccionEnvioResponse } from '../../shared/models/direccion-envio-response.model';
import { DireccionEnvioRequest } from '../../shared/models/direccion-envio-request.model';


@Injectable({
  providedIn: 'root'
})
export class Direccionservice {
  private apiUrl =`${environment.localUrl}/direccion/envio`
  constructor(private http: HttpClient){}

  getAllDireccionByUsuario():Observable<DireccionEnvioResponse[]>{
    return this.http.get<DireccionEnvioResponse[]>(`${this.apiUrl}`)
  }
  getDireccionById(id:number): Observable<DireccionEnvioResponse>{
    return this.http.get<DireccionEnvioResponse>(`${this.apiUrl}/${id}`)
  }
  crearDireccionByUsuario(direccion: DireccionEnvioRequest): Observable<DireccionEnvioRequest>{
    return this.http.post<DireccionEnvioRequest>(`${this.apiUrl}`,direccion)

  }
  actualizarDireccionByUsuario(id:number, direccion:DireccionEnvioRequest): Observable<DireccionEnvioResponse>{
    return this.http.put<DireccionEnvioResponse>(`${this.apiUrl}/${id}`,direccion)
  }
  eliminarDireccionByUsuario(id:number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`)
  }
}