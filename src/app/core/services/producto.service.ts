import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Productos } from "../../shared/models/productos.model";
import { environment } from "../../../environments/environment";
import { ProductoDetalles } from "../../shared/models/productoDetalles.model";
import { TipoEntregaResponse } from "../../shared/models/tipoEntrega-Response.model";
import { PageableResponse } from "../../shared/models/pageable.response.model";

@Injectable({
  providedIn  : 'root',
})
export class ProductoService {
    private apiUrl = `${environment.localUrl}/productos`

    constructor(private http: HttpClient) {}

    getProductos(): Observable<ProductoDetalles[]> {
      return this.http.get<ProductoDetalles[]>(`${this.apiUrl}/listar`);
    }
    crearProductos(producto: Productos): Observable<Productos> {
      return this.http.post<Productos>(`${this.apiUrl}/crear`, producto);
    }
    getTotalProductos(): Observable<any>{
      return this.http.get<any>(`${this.apiUrl}/total`);
    }
    actualizarProductos(id: number, producto: Productos): Observable<ProductoDetalles>{
      return this.http.put<ProductoDetalles>(`${this.apiUrl}/actualizar/${id}`, producto);
    }
    eliminarProducto(id:number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
    }
    getTiposEntrega(productoId: number): Observable<TipoEntregaResponse> {
      return this.http.get<TipoEntregaResponse>(`${this.apiUrl}/${productoId}/tipos-entrega`);
    }
    paginateProductos(page: number, size: number): Observable<PageableResponse<ProductoDetalles>> {
      const params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString());
  
      return this.http.get<PageableResponse<ProductoDetalles>>(`${this.apiUrl}/page`, {params});
    }
    

    }
