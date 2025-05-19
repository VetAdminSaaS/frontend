import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";  // Asegúrate de que la URL de la API esté en el entorno
import { StorageService } from "./storage.service";  // Este servicio es el que maneja el token
import { Facturas } from "../../shared/models/facturas.model";
@Injectable({
    providedIn: 'root',
})
export class FacturaService {
    private baseURL = `${environment.apiUrl}/v1/bills`;  // URL base de la API de facturas

    constructor(private http: HttpClient, private storageService: StorageService) {}
    getFacturas(page: number, limit: number, filters: string = ''): Observable<any> {
      let url = `${this.baseURL}?page=${page}&limit=${limit}`;
      
      if (filters.trim()) { 
          url += `&${filters}`;
      }
  
      return this.http.get<any>(url);
  }
  
  

    verFacturaODian(number: string, option: 'factura' | 'dian'): Observable<{ data: { bill: { public_url?: string, qr?: string } }, message: string, status: string }> {
      const accessToken = this.storageService.getAuthData();
      const headers = new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      });
      const url = `${this.baseURL}/show/${number}`;
  
      return this.http.get<{ data: { bill: { public_url?: string, qr?: string } }, message: string, status: string }>(url, { headers });
    }
      descargarFactura(number: string, format: 'pdf'): Observable<any> {
        const accessToken = this.storageService.getAuthData();
        const headers = new HttpHeaders({
          Authorization: `Bearer ${accessToken}`,
        });
      
        // Actualizamos la URL solo para la descarga de PDF
        const url = `${this.baseURL}/download-pdf/${number}`;
        return this.http.get(url, { headers });
      }
      
      eliminarFactura(reference_code:string): Observable<void>{
        const accessToken = this.storageService.getAuthData();
        const headers = new HttpHeaders({
          Authorization: `Bearer ${accessToken}`,
        });
        const url =  `${this.baseURL}/destroy/reference/${reference_code}`;
        return this.http.delete<void>(url, {headers})
      }
      
      
      
      
      
}
