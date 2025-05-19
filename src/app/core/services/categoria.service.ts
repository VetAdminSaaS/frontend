import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CategoriaResponse } from '../../shared/models/categoria-response.model';
import { Observable } from 'rxjs';
import { CategoriaRequest } from '../../shared/models/categoria-request.model';

@Injectable({
  providedIn: 'root'
})
export class Categoriaservice {
  private apiUrl =`${environment.localUrl}/categorias`

  constructor(private http: HttpClient){}

  getAllCategorias(): Observable<CategoriaResponse[]>{
    return this.http.get<CategoriaResponse[]>(`${this.apiUrl}`)
  }
  getCategoriaById(id:number): Observable<CategoriaResponse>{
    return this.http.get<CategoriaResponse>(`${this.apiUrl}/${id}`)
  }
  crearCategoria(categoria: CategoriaRequest): Observable<CategoriaRequest> {
    return this.http.post<CategoriaRequest>(`${this.apiUrl}/crear`, categoria);
}
actualizarCategoria(id:number, categoria : CategoriaRequest): Observable<CategoriaResponse> {
  return this.http.put<CategoriaResponse>(`${this.apiUrl}/actualizar/${id}`, categoria)
}
eliminarCategoria(id:number): Observable<void>{
  return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}` )
}

  

 
}
