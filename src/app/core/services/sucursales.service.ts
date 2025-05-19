import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SucursalResponse } from '../../shared/models/sucursal-response.model';
import { SucursalRequest } from '../../shared/models/sucursal-request.model';


@Injectable({
  providedIn: 'root'
})
export class Sucursalesservice {
  private apiUrl =`${environment.localUrl}/sucursales`

  constructor(private http: HttpClient){}

  getAllSucursales(): Observable<SucursalResponse[]>{
    return this.http.get<SucursalResponse[]>(`${this.apiUrl}`)
  }
  getSucursalById(id:number): Observable<SucursalResponse>{
    return this.http.get<SucursalResponse>(`${this.apiUrl}/${id}`)
  }
  crearSucursal(categoria: SucursalRequest): Observable<SucursalRequest> {
    return this.http.post<SucursalRequest>(`${this.apiUrl}/crear`, categoria);
}
actualizarSucursal(id:number, categoria : SucursalRequest): Observable<SucursalResponse> {
  return this.http.put<SucursalResponse>(`${this.apiUrl}/actualizar/${id}`, categoria)
}
eliminarSucursal(id:number): Observable<void>{
  return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}` )
}

  

 
}
