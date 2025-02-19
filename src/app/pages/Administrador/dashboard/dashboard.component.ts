import { Component, inject } from '@angular/core';
import { SidebarAdminComponent } from "../../../shared/components/sidebar-admin/sidebar-admin.component";
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import { SidebarFactusComponent } from "../../../shared/components/sidebar-factus/sidebar-factus.component";
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PurchaseService } from '../../../core/services/purchase.service';
import { ProductoService } from '../../../core/services/producto.service';
import { response } from 'express';
import { usuariosStoreService } from '../../../core/services/usuarios.store';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ NavbarComponent, SidebarFactusComponent,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  totalProduct: number=0;
  totalUsuarios: number=0;
  totalFacturas: number=0;
  totalPaid: number = 0;
  isCustomer: boolean = false;
  isAuthenticated: boolean = false;
  isAdmin:boolean = false;
  ventasMes: number =0;
  porcentaje: number=0;
  esCrecimiento: boolean = true;
  customerName: string | null = '';
  private authService = inject(AuthService);
  private router = inject(Router);
  private purchaseService = inject(PurchaseService);
  private productoService = inject(ProductoService);
  private usuariosService = inject(usuariosStoreService);

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.isAdmin = this.authService.getUserRole() ==='ADMIN';
    this.loadUserData();
    this.ObtenerTotalPaid();
    this.ObtenerTotalProductos();
    this.ObtenerTotalUsuarios();
    this.ObtenerTotalFacturas();
    this.ObtenerTotalVentasMes();
    this.ObtenerPorcentajeDeVenta();
  }


private loadUserData(): void {
  this.isAuthenticated = this.authService.isAuthenticated();
    this.isCustomer = this.authService.getUserRole() === 'CUSTOMER';
    this.isAdmin = this.authService.getUserRole() ==='ADMIN';
    const customer = this.authService.getUser();
    this.customerName = customer ? customer.names : null;
}
ObtenerTotalPaid(): void {
  this.purchaseService.getTotalPaid().subscribe({
    next: (response) => {
      this.totalPaid = response; 
    },
    error: (err) => {
      console.error("Error al obtener el total pagado:", err);
    }
  });
}
ObtenerPorcentajeDeVenta(): void {
  this.purchaseService.getPorcentaDelMes().subscribe({
    next: (response) => {
      this.porcentaje = response.porcentaje_crecimiento;
      this.esCrecimiento = this.porcentaje > 0;
    },
    error: (err) => {
      console.error("Error no se puede obtener el porcentaje", err);
    }
  });
}



ObtenerTotalVentasMes():void {
  this.purchaseService.getVentasDelMes().subscribe({
    next: (response) => {
      this.ventasMes = response
    },
    error: (err) => {
      console.error("Error", err);
    }
  })
}

ObtenerTotalFacturas(): void{
  this.purchaseService.getFacturasTotal().subscribe({
    next: (response) => {
      this.totalFacturas = response;
    },
    error: (err) => {
      console.error("Error", err);
    }
  });
}
ObtenerTotalProductos():void {
  this.productoService.getTotalProductos().subscribe({
    next: (response) => {
      this.totalProduct = response;
    },
    error: (err) => {
      console.error("Error al obtener la cantida de productos:", err);
    }
  });
}
ObtenerTotalUsuarios(): void{
  this.usuariosService.getTotalUsuarios().subscribe({
    next:(response) =>{
      this.totalUsuarios = response;
    },
    error: (err) => {
      console.error("Error al obtener la cantidad de usuarios", err);
    }
  });
}
}
