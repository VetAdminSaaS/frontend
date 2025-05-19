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
import { PurchaseItemCreateUpdateRequest } from '../../models/purchase-create.update-request';
import { Productos, TiposDeEntrega } from '../../models/productos.model';
import { ComentariosComponent } from "../comentarios/comentarios.component";
import { TipoEntregaResponse } from '../../models/tipoEntrega-Response.model';
import { FichaProductoComponent } from "../ficha-producto/ficha-producto.component";

@Component({
  selector: 'app-producto-details',
  standalone: true,
  imports: [CommonModule, ComentariosComponent, FichaProductoComponent],
  templateUrl: './producto-details.component.html',
  styleUrls: ['./producto-details.component.scss']
})
export class ProductoDetailsComponent implements OnInit {
  producto!: ProductoDetalles;
  @Input() productoId!: number; 
  isProductAdded = false;
  isAdmin = false;
  total: number = 0;
  discount_rate: number =0;

  private route = inject(ActivatedRoute);
  private productoService = inject(ProductoService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private homeService = inject(HomeService);
  private toastr = inject(ToastrService);
  private factusconexion = inject(rangoNumericoService);
  unidadMedidas: UnidadMedidaResponse[] = [];
  selectedQuantity: number = 1; 

  isAuthenticated = false;
  isCustomer: boolean = false;
  tiposEntrega: TiposDeEntrega[] = [];
  TiposDeEntrega = TiposDeEntrega; 
  opcionEntregaSeleccionada: TiposDeEntrega | null = null; 




  constructor() {}

  ngOnInit(): void {
    // Verificar si el usuario está autenticado y es cliente
    this.isAuthenticated = this.authService.isAuthenticated();
    this.isCustomer = this.authService.getUserRole() === 'CUSTOMER';
    this.isAdmin = this.authService.getUserRole() ==='ADMIN';
    this.cargarUnidadesMedida();
    this.loadSucursalesProductoStock(this.productoId);

    // Cargar los detalles del producto si el productoId está disponible
    if (this.productoId) {
      this.loadProductoDetails(this.productoId);
    }

  }
  seleccionarEntrega(opcion: TiposDeEntrega) {
    this.opcionEntregaSeleccionada = opcion;
  }
  loadSucursalesProductoStock(productoId: number): void {
    this.productoService.getTiposEntrega(productoId).subscribe({
      next: (data: TipoEntregaResponse) => {
        this.tiposEntrega = data.tiposEntrega;  // Ahora sí accedemos correctamente
      },
      error: (err) => {
        console.error("Error al obtener tipos de entrega:", err);
        this.tiposEntrega = [];
      }
    });
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
  calcularTotal(): number {
    if (!this.producto) return 0; // Evita errores si el producto no está definido
  
    const precioBase = this.producto.price || 0;
    const descuento = this.producto.discount_rate || 0; // Si no hay descuento, se asume 0
    const cantidad = this.producto.selectedQuantity || 1;
  
    const precioConDescuento = precioBase - (precioBase * (descuento / 100));
    let total = precioConDescuento * cantidad;
  
    // Si el usuario ha seleccionado "Despacho a Domicilio", sumamos el costo del despacho
    if (this.opcionEntregaSeleccionada === TiposDeEntrega.DESPACHO_A_DOMICILIO) {
      total += this.producto.costoDespacho || 0; 
    }
  
    return total;
  }
  
  
  
    
  

  loadProductoDetails(productoId: number): void {
    this.homeService.getProductoDetallesPorId(productoId).subscribe({
      next: (data) => {
        this.producto = { ...data, selectedQuantity: 1 }; // Asegura que siempre tenga un valor inicial
      },
      error: () => {}
    });
  }
  
  
  goBackToStore(): void {
    this.router.navigate(['/store']);
  }
  goBack(): void{
    this.router.navigate(['/administrador/products/view']);
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
  


  // Método para agregar al carrito
  addToCart(producto: ProductoDetalles): void {
    if (!this.isCustomer) {
      this.toastr.warning('Debe iniciar sesión como cliente para agregar al carrito', 'Advertencia');
      return;
    }
      const cartItem: PurchaseItemCreateUpdateRequest  = {
        productoId: producto.id,
        coverPath: producto.coverPath,
        name: producto.name,
        code_reference: producto.code_reference,
        discount_rate: producto.discount_rate,
        unit_measure_id:producto.unit_measure_id,
        quantity:producto.selectedQuantity || 1, 
        price: producto.price,
        tax_rate: producto.tax_rate,
        standard_code_id: producto.standardCodeId,
        is_excluded: producto.isExcluded,
        tribute_id: producto.tributeId,
        withholding_taxes:producto.withholdingTaxes,
        costoDespacho: producto.costoDespacho,
        selectedQuantity: producto.selectedQuantity,
        stock: producto.quantity,
      };

      this.cartService.addToCart(cartItem);
      this.toastr.success(`${this.producto.name} agregado al carrito`, 'Éxito');
      console.log("Datos enviados", cartItem);
    
  }
  
}