import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ComentarioResponse } from '../../shared/models/comentario-response';
import { ComentarioRequest } from '../../shared/models/comentario-request.model';


@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  private apiUrl =`${environment.localUrl}/comentario`

  constructor(private http: HttpClient) { }

  getAllComentariosPorProducto(productoId:number): Observable<ComentarioResponse[]>{
    return this.http.get<ComentarioResponse[]>(`${this.apiUrl}/producto/${productoId}`)
  }
  crearComentario(productoId: number, comentarioRequest:ComentarioRequest): Observable<ComentarioRequest>{
    return this.http.post<ComentarioRequest>(`${this.apiUrl}/producto/${productoId}`,comentarioRequest)
  }
  promedioProductoRating(productoId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/producto/promedio/${productoId}`)
  }

}
