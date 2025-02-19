import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { ProductoDetalles } from "../../shared/models/productoDetalles.model";
@Injectable({
    providedIn: 'root',
})
export class HomeService {
    private apiUrl = `${environment.localUrl}/productos`;
    constructor(private http: HttpClient) {}

    getProductoDetallesPorId(id:number): Observable<ProductoDetalles> {
        return this.http.get<ProductoDetalles>(`${this.apiUrl}/${id}`);
    }
}