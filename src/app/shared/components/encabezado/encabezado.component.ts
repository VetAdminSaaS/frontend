import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PurchaseItemCreateUpdateRequest } from '../../models/purchase-create.update-request';
import { CartService } from '../../../core/services/cart.service';
import { ProductoDetalles } from '../../models/productoDetalles.model';
import { Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-encabezado',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './encabezado.component.html',
  styleUrl: './encabezado.component.scss'
})
export class EncabezadoComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  isCustomer: boolean = false;
  isAdmin: boolean = false;
  discount_rate: number =0;
  filteredProductos: ProductoDetalles[] = [];
  loading = true;
  searchQuery = '';
  
  cartItemCount = 0;
  isDropdownOpen = false;
  customerName: string | null = '';
  isCartDrawerOpen = false;
  cartItems: PurchaseItemCreateUpdateRequest[] = [];
  totalPrice = 0;
  showSnack = false;
  private cartService = inject(CartService);
  productos: ProductoDetalles[] = [];
  snackMessage = '';
  isMobileMenuOpen = false;
  showMobileSearch: boolean = false;
  item: PurchaseItemCreateUpdateRequest[] =[];



  private authService = inject(AuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  isCartEmpty: boolean = true; 

  ngOnInit(): void {
    // Verifica la autenticación y el rol del usuario
    this.isAuthenticated = this.authService.isAuthenticated();
    this.isCustomer = this.authService.getUserRole() === 'CUSTOMER';
    this.isAdmin = this.authService.getUserRole() === 'ADMIN';
    const customer = this.authService.getUser();
    this.customerName = customer ? customer.names : null;

    // Inicializa el carrito
    this.cartItems = this.cartService.getCartItems();
    this.cartItemCount = this.cartItems.length;
    this.calculateTotal();
    this.isCartEmpty = this.cartItems.length === 0;

    // Suscríbete a los cambios en el contador del carrito
    this.cartService.cartItemCount$
      .pipe(takeUntil(this.destroy$)) // Se desuscribe cuando el componente se destruye
      .subscribe((count) => {
        this.cartItemCount = count; // Actualiza el contador
        this.cartItems = this.cartService.getCartItems(); // Actualiza la lista de ítems
        this.calculateTotal(); // Recalcula el total
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next(); // Emite un valor para desuscribirse
    this.destroy$.complete(); // Completa el Subject
  }

  calculateTotal() {
    this.totalPrice = this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    this.discount_rate = this.calculateDiscount(); 
  }
  searchProductos(): void {
    this.filteredProductos = this.productos.filter(producto =>
      producto.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      producto.code_reference.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
  clearSearch(): void {
    this.searchQuery = '';
    this.searchProductos();
    this.showMobileSearch = false;
  }
  

  goToCart(): void {
    if (this.isCustomer) {
      this.router.navigate(['/store/cart']);
    }
  }
  
  calculateDiscount(): number {
    return this.cartItems.reduce((totalDiscount, item) => {
      const itemDiscount = (item.price * (item.discount_rate / 100)) * item.quantity;
      return totalDiscount + itemDiscount;
    }, 0);
  }
  removeFromCart(item: PurchaseItemCreateUpdateRequest): void {
    this.cartService.removeFromCart(item.productoId);
    this.cartItems = this.cartService.getCartItems();
    this.cartItemCount = this.cartItems.length;
    this.calculateTotal();
  }

  toggleDropdown() {
    if (this.isCustomer) {
      this.isDropdownOpen = !this.isDropdownOpen;
    } else {
      this.router.navigate(['administrador/dashboard']);
    }
  }
  
  openCartDrawer() {
    this.isCartDrawerOpen = true;
  }
  verProducto(producto: any): void {

    this.searchQuery = '';
    this.filteredProductos = [];
    this.router.navigate(['/productos', producto.id]);
    
   
  }
  increaseQuantity(item: PurchaseItemCreateUpdateRequest):void {
    if(item.selectedQuantity < item.quantity) {
      item.selectedQuantity++;
    }
  }
  decreaseQuantity(item: PurchaseItemCreateUpdateRequest):void {
    if(item.selectedQuantity > 1) {
      item.selectedQuantity--;
    }
  }

  addToCart(producto: ProductoDetalles): void {
    const cartItem: PurchaseItemCreateUpdateRequest = {
      productoId: producto.id,
      coverPath: producto.coverPath,
      name: producto.name,
      code_reference: producto.code_reference,
      unit_measure_id: producto.unit_measure_id,
      quantity: producto.selectedQuantity,
      discount_rate: producto.discount_rate,
      tax_rate: producto.tax_rate,
      standard_code_id: producto.standardCodeId,
      is_excluded: producto.isExcluded,
      tribute_id: producto.tributeId,
      withholding_taxes: producto.withholdingTaxes,
      price: producto.price,
      costoDespacho: producto.costoDespacho,
      selectedQuantity: producto.selectedQuantity, 
      stock: producto.quantity,
    };

    this.cartService.addToCart(cartItem);
    this.cartItemCount = this.cartService.getCartItems().length;
    this.showSnackBar(`${producto.name} agregado al carrito`);
    this.calculateTotal();
  }

  showSnackBar(message: string): void {
    this.snackMessage = message;
    this.showSnack = true;

    setTimeout(() => {
      this.showSnack = false;
    }, 3000);
  }

  closeCartDrawer() {
    this.isCartDrawerOpen = false;
  }

  logout(): void {
    this.authService.logout();

    if (this.router.url === '/store') {
      window.location.reload();
    } else {
      this.router.navigate(['/store']);
    }
  }
}