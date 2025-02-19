import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { StorageService } from "./storage.service";
import { catchError, Observable, throwError } from "rxjs";
import { error } from "console";
import { RangosNumeracion } from "../../shared/models/rangos-numeracion.model";
import { UnidadMedidaResponse } from "../../shared/models/unidad-medida-response.model";
import { Municipios } from "../../shared/models/municipios.model";
import { Facturas } from "../../shared/models/facturas.model";
import { TributosProductos } from "../../shared/models/tributos-productos.model";

@Injectable({
    providedIn: 'root',
})
export class rangoNumericoService {
    private baserURL = `${environment.localUrl}/factus`;

    constructor(private http: HttpClient, private storageService: StorageService) {}

    getRangosNumericos(): Observable<RangosNumeracion[]> {
    
        return this.http.get<RangosNumeracion[]>(`${this.baserURL}/rango-numerico`);
    }
    getUnidadesMedida(): Observable<UnidadMedidaResponse[]> {
        return this.http.get<UnidadMedidaResponse[]>(`${this.baserURL}/unidades-medida`);
    }
    getMunicipios(): Observable<Municipios[]> {
        return this.http.get<Municipios[]>(`${this.baserURL}/municipios`)
    }
    getTributos(): Observable<TributosProductos[]>{
        return this.http.get<TributosProductos[]>(`${this.baserURL}/tributos`)
    }
    getFacturas(page: number, limit: number, filters: string = ''): Observable<any> {
        let url = `${this.baserURL}/obtener/facturas?page=${page}&limit=${limit}`;
        
        if (filters.trim()) { // Solo añadir filtros si existen
            url += `&${filters}`;
        }
    
        return this.http.get<any>(url);
    }
    
      
    crearFactura(factura: Facturas, purchaseId: number): Observable<Facturas> {
        return this.http.post<Facturas>(`${this.baserURL}/crearFactura/${purchaseId}`, factura);
    }
    verFactura(number: string, option: 'factura'   | 'dian' ): Observable<{ data: { bill: { public_url?: string, qr?:string } }, message:string, status:string }> {
        const url = `${this.baserURL}/verFactura/${number}`;
        return this.http.get<{ data: { bill: { public_url?: string, qr?: string  }}, message:string, status:string }>(url);
    }
    descargarFactura(number: string): Observable<Blob> {
        const url = `${this.baserURL}/download-pdf/${number}`;
        
        return this.http.get(url, {
          responseType: 'blob' // 🔹 Recibir el PDF como archivo binario
        });
      }
      eliminarFactura(reference_code:string): Observable<void>{
        const url =  `${this.baserURL}/${reference_code}`;
        return this.http.delete<void>(url)
      }
      crearFacturaManual(factura: Facturas): Observable<Facturas> {
        return this.http.post<Facturas>(`${this.baserURL}/crearFacturaManual`, factura);
    }
    
      
      
 
      
      
    
    
}