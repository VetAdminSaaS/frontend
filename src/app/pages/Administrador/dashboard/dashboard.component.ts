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
import { ServiciosVeterinariosRequest } from '../../../shared/models/servicioVeterinario-request.model';
import { ServiciosVeterinariosResponse } from '../../../shared/models/serviciosVeterinarios-model';
import { ServiciosVeterinarios } from '../../../core/services/serviciosveterinarios.service';
import { Sucursalesservice } from '../../../core/services/sucursales.service';
import { SucursalResponse } from '../../../shared/models/sucursal-response.model';
import { EspecialidadService } from '../../../core/services/especialidad.service';
import { EspecialidadRequest } from '../../../shared/models/especialidad-request.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EspecialidadResponse } from '../../../shared/models/especialidadResponse.model';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ NavbarComponent, SidebarFactusComponent,CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  totalProduct: number=0;
  totalUsuarios: number=0;
  totalFacturas: number=0;
  totalPaid: number = 0;
  sucursales: SucursalResponse[] =[];
  servicios: ServiciosVeterinariosResponse[] =[];
  servicio: ServiciosVeterinariosRequest= {nombre:'',descripcion:'',precio:0,disponible:true,coverPath:''}
  isCustomer: boolean = false;
  isAuthenticated: boolean = false;
  isAdmin:boolean = false;
  ventasMes: number =0;
  porcentaje: number=0;
  esCrecimiento: boolean = true;
  customerName: string | null = '';
  especialidades: EspecialidadResponse[] =[];
  showModal = false;
  especialidadId: number | null = null;
  isEditMode = false;
  paginaActual = 0;
  totalPaginas = 1;
  paginaActualServicios = 0;
  totalPaginasServicios = 1;
  especialidadForm: EspecialidadRequest = { nombre: '' };
  private authService = inject(AuthService);
  private router = inject(Router);
  private purchaseService = inject(PurchaseService);
  private productoService = inject(ProductoService);
  private usuariosService = inject(usuariosStoreService);
  private serviciosService = inject(ServiciosVeterinarios);
  private sucursalesService = inject(Sucursalesservice);
  private especialidadService = inject(EspecialidadService);

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
    this.cargarServicios();
    this.cargarSucursales();
    this.cargarEspecialidad();
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

cargarServicios():void {
  this.serviciosService.paginateServicio(this.paginaActualServicios, 4).subscribe({
    next:(data) => {
      this.servicios = data.content;
      this.totalPaginasServicios = data.totalPages;
    }
  })
}
cargarSucursales(): void {
  this.sucursalesService.getAllSucursales().subscribe({
    next: (data) => {
      this.sucursales = data;
    }
  })

}
cargarEspecialidad(): void {
  this.especialidadService.paginateEspecialidad(this.paginaActual, 9).subscribe({
    next: (data) => {
      this.especialidades = data.content;  // Lista de especialidades
      this.totalPaginas = data.totalPages; // Actualizamos el total de páginas
    }
  });
}
cambiarPagina(nuevaPagina: number): void {
  if (nuevaPagina >= 0 && nuevaPagina < this.totalPaginas) {
    this.paginaActual = nuevaPagina;
    this.cargarEspecialidad();
  }
}
cambiarPaginaServicios(nuevaPaginaServicios: number): void {
  if (nuevaPaginaServicios >= 0 && nuevaPaginaServicios < this.totalPaginasServicios) {
    this.paginaActualServicios = nuevaPaginaServicios;
    this.cargarServicios(); // ✅ Ahora sí ejecutamos la función
  }
}




ObtenerTotalVentasMes(): void {
  this.purchaseService.getVentasDelMes().subscribe({
    next: (response) => {
      this.ventasMes = response.actual;
      const ventasAnteriores = response.anterior;

      // Calcular el porcentaje de crecimiento o decrecimiento
      if (ventasAnteriores > 0) {
        this.porcentaje = ((this.ventasMes - ventasAnteriores) / ventasAnteriores) * 100;
        this.esCrecimiento = this.porcentaje >= 0;
      } else {
        this.porcentaje = this.ventasMes > 0 ? 100 : 0; // Si antes era 0 y ahora hay ventas, es 100% crecimiento
        this.esCrecimiento = this.ventasMes > 0;
      }
    },
    error: (err) => {
      console.error("Error", err);
    }
  });
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


openEditModal(especialidad?: EspecialidadResponse): void {
  this.isEditMode = !!especialidad; // Si hay especialidad, estamos en modo edición
  this.showModal = true; // Mostrar el modal

  if (especialidad) {
    this.especialidadId = especialidad.id;
    this.especialidadForm = {
      nombre: especialidad.nombre,
    };
  } else {
    this.especialidadId = null;
    this.especialidadForm = { nombre: '' }; // Asegurar que haya un objeto válido
  }
}




// Cerrar modal
closeModal(): void {
  this.showModal = false;
  this.especialidadId = null;
  this.especialidadForm
}

guadarEspecialidad():void {
  if(this.especialidadId) {
    this.especialidadService.actualizarEspecialidad(this.especialidadId, this.especialidadForm).subscribe(()=> {
      this.cargarEspecialidad();
      this.closeModal();
    });
  }else {
    this.especialidadService.crearEspecialidad(this.especialidadForm).subscribe(()=> {
      this.cargarEspecialidad();
      this.closeModal();
    })
  }
}


// Eliminar una especialidad
deleteEspecialidad(id: number): void {
  if (confirm('¿Estás seguro de eliminar esta especialidad?')) {
    this.especialidadService.eliminarEspecialidad(id).subscribe(() => {
      this.cargarEspecialidad();
    });
  }
}
}
