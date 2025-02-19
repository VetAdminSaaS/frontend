import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private isCustomerConfirmedSubject = new BehaviorSubject<boolean>(false);
  isCustomerConfirmed$ = this.isCustomerConfirmedSubject.asObservable(); 
  private numberingRangeSubject = new BehaviorSubject<number | null>(null);
  numberingRange$ = this.numberingRangeSubject.asObservable();

  // ✅ Confirmar cliente
  confirmCustomer(): void {
    this.isCustomerConfirmedSubject.next(true);
  }
  setNumberingRangeId(id: number): void {
    this.numberingRangeSubject.next(id);
  }

  getNumberingRangeId(): number | null {
    return this.numberingRangeSubject.getValue();
  }
}
