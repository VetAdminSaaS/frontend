import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PurchaseItemCreateUpdateRequest } from '../../shared/models/purchase-create.update-request';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartKey = 'cartItems';
  private cartItemCount = new BehaviorSubject<number>(0); // BehaviorSubject para el contador

  // Observable para suscribirse a los cambios en el contador
  cartItemCount$ = this.cartItemCount.asObservable();

  

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  getCartItems(): PurchaseItemCreateUpdateRequest[] {
    if (!isPlatformBrowser(this.platformId)) return []; // Verifica si estamos en el navegador
    const items = localStorage.getItem(this.cartKey);
    return items ? JSON.parse(items) : [];
  }
 

  addToCart(item: PurchaseItemCreateUpdateRequest): void {
    if (!isPlatformBrowser(this.platformId)) return; // Evita errores en SSR

    const currentItems = this.getCartItems();
    const existingItemIndex = currentItems.findIndex(
      (i) => i.productoId === item.productoId
    );

    if (existingItemIndex !== -1) {
      currentItems[existingItemIndex].quantity += item.quantity;
      currentItems[existingItemIndex].price = item.price;
    } else {
      currentItems.push(item);
    }

    this.saveCartItems(currentItems); // Guarda los ítems en el almacenamiento
    this.cartItemCount.next(currentItems.length); // Notifica el cambio en el contador
  }


  removeFromCart(productoId: number): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const currentItems = this.getCartItems().filter(
      (item) => item.productoId !== productoId
    );
    this.saveCartItems(currentItems);
  }

  clearCart(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem(this.cartKey);
  }

  private saveCartItems(items: PurchaseItemCreateUpdateRequest[]): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(this.cartKey, JSON.stringify(items));
  }

  getCartTotal(): number {
    if (!isPlatformBrowser(this.platformId)) return 0;
    const items = this.getCartItems();
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }
}
