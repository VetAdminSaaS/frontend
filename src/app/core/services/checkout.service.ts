import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { PaypalCaptureResponse, PaypalOrderResponse } from "../../shared/models/paypal-response.model";
import { Observable } from "rxjs";
import { PaymentStatusResponse } from "../../shared/models/PaymentStatusResponse.model";

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private baseURL = `${environment.localUrl}/checkout`;

  constructor(private http: HttpClient) {}

  // 🔹 Corregido: "cretePaypalOrder" → "createPaypalOrder"
  createPaypalOrder(purchaseId: number): Observable<PaypalOrderResponse> {
    const params = new HttpParams()
      .set('purchaseId', purchaseId)
      .set('returnUrl', environment.paypalReturnUrl)
      .set('cancelUrl', environment.paypalReturnUrl);

    return this.http.post<PaypalOrderResponse>(`${this.baseURL}/create`, null, { params });
  }

  capturePaypalOrder(orderId: string): Observable<PaypalCaptureResponse> {
    const params = new HttpParams().set('orderId', orderId);
    return this.http.post<PaypalCaptureResponse>(`${this.baseURL}/capture`, null, { params });
  }
  verificarEstadoCompra(purchaseId: number): Observable<PaymentStatusResponse> {
    return this.http.get<PaymentStatusResponse>(`${this.baseURL}/status/${purchaseId}`);
  }

}
