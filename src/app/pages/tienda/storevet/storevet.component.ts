import { Component, inject, Input } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CarouselTiendaComponent } from '../../../shared/components/carousel-tienda/carousel-tienda.component';
import { Productos } from '../../../shared/models/productos.model';
import { PurchaseItemCreateUpdateRequest } from '../../../shared/models/purchase-create.update-request';
import { ProductoService } from '../../../core/services/producto.service';
import { CartService } from '../../../core/services/cart.service';
import { ProductoDetalles } from '../../../shared/models/productoDetalles.model';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { EncabezadoComponent } from "../../../shared/components/encabezado/encabezado.component";
import { ToastrService } from 'ngx-toastr';
import { HomeService } from '../../../core/services/home.service';

@Component({
  selector: 'app-storevet',
  standalone: true,
  imports: [CarouselTiendaComponent, CommonModule, FormsModule, EncabezadoComponent],
  templateUrl: './storevet.component.html',
  styleUrl: './storevet.component.scss'
})
export class StorevetComponent {
  @Input() producto!: ProductoDetalles;
  private productoService = inject(ProductoService)
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService)
  private homeService = inject(HomeService);

  productos: ProductoDetalles[] = [];
  filteredProductos: ProductoDetalles[] = [];
  loading = true;
  searchQuery = '';
  isCustomer = false;
  showSnack = false;
  snackMessage = '';
  cartItemCount = 0;

  constructor() {} // Eliminamos la inyección por constructor

  ngOnInit(): void {
    this.loadProductos();
    this.isCustomer = this.authService.getUserRole() === 'CUSTOMER';
    
  }

  loadProductos(): void {
    this.productoService.getProductos().subscribe(
      (data) => {
        this.productos = data.map((producto) => ({
          ...producto,
          selectedQuantity: 1,
        }));
        this.filteredProductos = this.productos;
        this.loading = false;
      },
      (error) => {
        console.error('Error al cargar los productos:', error);
        this.loading = false;
      }
    );
  }


  searchProductos(): void {
    this.filteredProductos = this.productos.filter(producto =>
      producto.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      producto.code_reference.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  increaseQuantity(producto: ProductoDetalles): void {
    if (producto.selectedQuantity < producto.quantity) {
      producto.selectedQuantity++;
    }
  }

  decreaseQuantity(producto: ProductoDetalles): void {
    if (producto.selectedQuantity > 1) {
      producto.selectedQuantity--;
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
      is_excluded:producto.isExcluded,
      tribute_id:producto.tributeId,
      withholding_taxes:producto.withholdingTaxes,
      price: producto.price,
      costoDespacho:producto.costoDespacho,
      selectedQuantity: producto.selectedQuantity,
      stock: producto.quantity,
    };

    this.cartService.addToCart(cartItem);
    
    this.showSnackBar(`${producto.name} agregado al carrito`);
    console.log('Producto agregado al carrito: ', cartItem);
   
  }
  clearSearch() {
    this.searchQuery = '';
    this.searchProductos();
  }

  showSnackBar(message: string): void {
    this.snackMessage = message;
    this.showSnack = true;

    setTimeout(() => {
      this.showSnack = false;
    }, 3000);
  }
  getTotalStock(producto: ProductoDetalles): number {
    if (!producto.sucursalesStock || producto.sucursalesStock.length === 0) {
      return 0; // Si no hay sucursales, el stock es 0
    }
    
    return producto.sucursalesStock.reduce((total, sucursal) => total + (sucursal.quantity || 0), 0);
  }
  
  viewDetails(producto: ProductoDetalles) {
    if (!producto || !producto.id) {
      console.error('Producto no definido o sin ID');
      return;
    }

    const routePath = this.isCustomer
      ? '/store/producto-details'
      : '/store/producto-details';

    this.router.navigate([routePath, producto.id]);
  }
  
  

}

