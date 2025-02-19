import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Productos } from "../../shared/models/productos.model";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn  : 'root',
})
export class ProductoService {
    private apiUrl = `${environment.localUrl}/productos`

    constructor(private http: HttpClient) {}

    getProductos(): Observable<Productos[]> {
      return this.http.get<Productos[]>(`${this.apiUrl}/listar`);
    }
    crearProductos(producto: Productos): Observable<Productos> {
      return this.http.post<Productos>(`${this.apiUrl}/crear`, producto);
    }
    getTotalProductos(): Observable<any>{
      return this.http.get<any>(`${this.apiUrl}/total`);
    }
    

    }
