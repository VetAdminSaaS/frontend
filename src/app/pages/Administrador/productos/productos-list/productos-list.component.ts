import { SidebarFactusComponent } from "../../../../shared/components/sidebar-factus/sidebar-factus.component";
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { Component, inject, Input } from "@angular/core";
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Productos } from "../../../../shared/models/productos.model";
import { PurchaseItemCreateUpdateRequest } from "../../../../shared/models/purchase-create.update-request";
import { ProductoService } from "../../../../core/services/producto.service";
import { CartService } from "../../../../core/services/cart.service";
import { ProductoDetalles } from "../../../../shared/models/productoDetalles.model";
import { AuthService } from "../../../../core/services/auth.service";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-productos-list',
  standalone: true,
  imports: [SidebarFactusComponent, NavbarComponent, CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './productos-list.component.html',
  styleUrl: './productos-list.component.scss'
})
export class ProductosListComponent {
  @Input() producto!: ProductoDetalles;
  private productoService = inject(ProductoService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  productos: ProductoDetalles[] = [];
  filteredProductos: ProductoDetalles[] = [];
  loading = true;
  searchQuery = '';
  isCustomer = false;
  showSnack = false;
  snackMessage = '';
  totalElements = 0;
  totalPages = 0;
  pageSize = 15; // Asegúrate de que coincida con el backend
  pageIndex = 0;

  constructor() {}

  ngOnInit(): void {
    this.loadProductos(this.pageIndex, this.pageSize);
    this.isCustomer = this.authService.getUserRole() === 'CUSTOMER';
  }

  loadProductos(page: number, size: number): void {
    this.loading = true;
    
    this.productoService.paginateProductos(page, size).subscribe(
      (data) => {
        this.productos = data.content.map((producto) => ({
          ...producto,
          selectedQuantity: 1,
          categoriaNombre: '',
        }));
        this.filteredProductos = this.productos;
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
        this.pageIndex = data.number; // Actualizar el índice con la respuesta del backend
        this.loading = false;
      },
      (error) => {
        console.error('Error al cargar los productos:', error);
        this.loading = false;
      }
    );
  }

  cambiarPagina(direccion: number): void {
    const nuevaPagina = this.pageIndex + direccion;
    if (nuevaPagina >= 0 && nuevaPagina < this.totalPages) {
      this.pageIndex = nuevaPagina; // Actualiza `pageIndex` antes de la solicitud
      this.loadProductos(this.pageIndex, this.pageSize);
    }
  }

  
    searchProductos(): void {
      this.filteredProductos = this.productos.filter(producto =>
        producto.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        producto.code_reference.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
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
    viewDetails(producto: ProductoDetalles) {
      if (!producto || !producto.id) {
        console.error('Producto no definido o sin ID');
        return;
      }
      
  
      const routePath = this.isCustomer
        ? '/store/producto-details'
        : '/store/producto-details';
  
      this.router.navigate([routePath, producto.id]);
      console.log(producto);
    }
    updateProducto(productoId: number):void {
      this.router.navigate(['administrador/products/actualizar', productoId]);

    }
    deleteProducto(id: number): void {
      if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        this.productoService.eliminarProducto(id).subscribe({
          next: () => {
            this.toastr.success('Producto eliminado correctamente', 'Eliminado', {
              timeOut: 3000,
              positionClass: 'toast-top-right'
            });
    
            // Verificar si la página actual se quedó sin elementos
            const esUltimoElementoEnPagina = this.productos.length === 1;
            const esPaginaCero = this.pageIndex === 0;
    
            if (esUltimoElementoEnPagina && !esPaginaCero) {
              this.pageIndex--; // Retrocede de página si la actual quedó vacía
            }
    
            this.loadProductos(this.pageIndex, this.pageSize);
          },
          error: (err) => {
            this.toastr.error('Error al eliminar el producto', 'Error', {
              timeOut: 3000,
              positionClass: 'toast-top-right'
            });
            console.error('Error eliminando producto:', err);
          }
        });
      }
    }
    
    navegar(): void {
      this.router.navigate(['/administrador/products/create']);
    }
  }
    
    

