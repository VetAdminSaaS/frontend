import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { ProductoDetalles } from '../../models/productoDetalles.model';
import { ProductoService } from '../../../core/services/producto.service';
import { AuthService } from '../../../core/services/auth.service';
import { HomeService } from '../../../core/services/home.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { UnidadMedidaService } from '../../../core/services/unidad-Medida.service';
import { UnidadMedidaResponse } from '../../models/unidad-medida-response.model';
import { rangoNumericoService } from '../../../core/services/rango-numerico.service';

@Component({
  selector: 'app-producto-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto-details.component.html',
  styleUrls: ['./producto-details.component.scss']
})
export class ProductoDetailsComponent implements OnInit {
  producto!: ProductoDetalles 
  @Input() productoId!: number; 
  isProductAdded = false;

  private route = inject(ActivatedRoute);
  private productoService = inject(ProductoService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private homeService = inject(HomeService);
  private toastr = inject(ToastrService);
  private factusconexion = inject(rangoNumericoService);
  unidadMedidas: UnidadMedidaResponse[] = [];

  isAuthenticated = false;
  isCustomer: boolean = false;

  constructor() {}

  ngOnInit(): void {
    // Verificar si el usuario está autenticado y es cliente
    this.isAuthenticated = this.authService.isAuthenticated();
    this.isCustomer = this.authService.getUserRole() === 'CUSTOMER';
    this.cargarUnidadesMedida();

    // Cargar los detalles del producto si el productoId está disponible
    if (this.productoId) {
      this.loadProductoDetails(this.productoId);
    }

  }
  cargarUnidadesMedida(): void {
    this.factusconexion.getUnidadesMedida().subscribe(
      (data) => {
        this.unidadMedidas = data;
      },
      (error) => {
        console.error('Error al obtener unidades de medida', error);
      }
    );
  }

  getNombreUnidadMedida(unitMeasureId: number): string {
    const unidad = this.unidadMedidas.find((u) => u.id === unitMeasureId);
    return unidad ? unidad.name : '';
  }
    
  

  loadProductoDetails(productoId: number): void {
    this.homeService.getProductoDetallesPorId(productoId).subscribe({
      next: (data) => (this.producto = data),
      error: () => {
        this.toastr.error('Error al cargar los detalles del producto', 'Error');
      }
    });
  }
  goBackToStore(): void {
    this.router.navigate(['/store']);
  }

  // Método para agregar al carrito
  addToCart(): void {
    if (!this.isCustomer) {
      this.toastr.warning('Debe iniciar sesión como cliente para agregar al carrito', 'Advertencia');
      return;
    }

    if (this.producto) {
      const cartItem = {
        productoId: this.producto.id,
        coverPath: this.producto.coverPath,
        name: this.producto.name,
        code_reference: this.producto.code_reference,
        discount_rate: this.producto.discount_rate,
        unit_measure_id: this.producto.unit_measure_id,
        quantity: this.producto.selectedQuantity || 1, 
        price: this.producto.price,
        tax_rate: this.producto.tax_rate,
        standard_code_id: this.producto.standard_code_id,
        is_excluded: this.producto.is_excluded,
        tribute_id: this.producto.tribute_id,
        withholding_taxes: this.producto.withholding_taxes,
      };

      this.cartService.addToCart(cartItem);
      this.toastr.success(`${this.producto.name} agregado al carrito`, 'Éxito');
    }
  }
}