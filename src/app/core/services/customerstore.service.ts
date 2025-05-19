import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { PurchaseResponse } from "../../shared/models/purchase-response-model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CustomerStoreService {
     private apiUrl =`${environment.localUrl}/customer`

     constructor(private http: HttpClient) { }

     getLastSixPurchases(): Observable<PurchaseResponse[]> {
        return this.http.get<PurchaseResponse[]>(`${this.apiUrl}/last-six`);
     }




}