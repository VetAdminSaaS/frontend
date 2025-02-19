import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { PurchaseCreateUpdateRequest } from "../../shared/models/purchase-create.update-request";
import { Observable } from "rxjs";
import { PurchaseResponse } from "../../shared/models/purchase-response-model";
import { PurchaseList } from "../../shared/models/purchase-list.model";

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private baseURL = `${environment.localUrl}/purchases`;

  constructor(private http: HttpClient) {} // Se usa inyección en el constructor para consistencia

  createPurchase(purchase: PurchaseCreateUpdateRequest): Observable<PurchaseResponse> {
    return this.http.post<PurchaseResponse>(this.baseURL, purchase);
  }

  confirmPurchase(id: number): Observable<PurchaseResponse> {
    return this.http.put<PurchaseResponse>(`${this.baseURL}/confirm/${id}`, {});
  }

  getPurchaseStatus(purchaseId: number): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/${purchaseId}`);
  }

  getPurchaseById(id: number): Observable<PurchaseResponse> {
    return this.http.get<PurchaseResponse>(`${this.baseURL}/${id}`);
  }
  updatePurchase(id: number, updateData: Partial<PurchaseCreateUpdateRequest>): Observable<PurchaseResponse> {
    return this.http.put<PurchaseResponse>(`${this.baseURL}/${id}`, updateData);
  }
  getPurchaseByUser(): Observable<PurchaseList[]> {
    return this.http.get<PurchaseList[]>(`${this.baseURL}/user`);
  }
  getAllPurchase(): Observable<PurchaseList[]>{
    return this.http.get<PurchaseList[]>(`${this.baseURL}`);
  }
  getTotalPaid():Observable<any>{
    return this.http.get<any>(`${this.baseURL}/total-paid`);
  }
  getFacturasTotal(): Observable<any>{
    return this.http.get<any>(`${this.baseURL}/facturas`);
  }
  getVentasDelMes(): Observable<any>{
    return this.http.get<any>(`${this.baseURL}/sales/this-month`); 
  }
  getPorcentaDelMes(): Observable<any>{
    return this.http.get<any>(`${this.baseURL}/sales-comparison`);
  }
  
}
