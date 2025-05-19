import { Component, inject } from '@angular/core';
import { SidebarFactusComponent } from "../../../../shared/components/sidebar-factus/sidebar-factus.component";
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SucursalResponse } from '../../../../shared/models/sucursal-response.model';
import { SucursalRequest } from '../../../../shared/models/sucursal-request.model';
import { Sucursalesservice } from '../../../../core/services/sucursales.service';
import { ServiciosVeterinariosResponse } from '../../../../shared/models/serviciosVeterinarios-model';
import { ServiciosVeterinarios } from '../../../../core/services/serviciosveterinarios.service';

@Component({
  selector: 'app-sucursales',
  standalone: true,
  imports: [SidebarFactusComponent, NavbarComponent, CommonModule,FormsModule],
  templateUrl: './sucursales.component.html',
  styleUrl: './sucursales.component.scss'
})
export class SucursalesComponent {
 sucursales: SucursalResponse[] = [];
  sucursalesFiltradas: SucursalResponse[] = [];
  private sucursalesService = inject(Sucursalesservice);
  private serviciosVeterinariosService = inject(ServiciosVeterinarios);
  filtroNombreSucursal: string = '';
  modalAbierto: boolean = false;
  sucursalId: number | null = null; // Identificador de la categoría a actualizar
  sucursal: SucursalRequest = { nombre: '', descripcion: '', direccion: '', telefono: '', email: '', ciudad:'', provincia:'', distrito:'',referencia:'',    serviciosVeterinariosIds: []  };
  listaServicios: ServiciosVeterinariosResponse[] =[];
  ngOnInit(): void {
    this.loadCategorias();
    this.loadServicios();
  }

  private loadCategorias(): void {
    this.sucursalesService.getAllSucursales().subscribe({
      next: (data) => {
        this.sucursales = data;
        this.filtrarSucursales();
      }
    });
  }

  filtrarSucursales(): void {
    this.sucursalesFiltradas = this.sucursales.filter(categoria =>
      categoria.nombre.toLowerCase().includes(this.filtroNombreSucursal.toLowerCase())
    );
  }
 

  abrirModal(sucursal?: SucursalResponse): void {
    this.modalAbierto = true;

    if (sucursal) {
      // Editar categoría existente
      this.sucursalId= sucursal.id;
      this.sucursal = {
        nombre: sucursal.nombre,
        descripcion: sucursal.descripcion,
        direccion: sucursal.direccion,
        telefono: sucursal.telefono,
        email: sucursal.email,
        ciudad: sucursal.ciudad,
        provincia: sucursal.provincia,
        distrito:sucursal.distrito,
        referencia:sucursal.referencia,
        serviciosVeterinariosIds: sucursal.sucursales?.map(servicio => servicio.id) || [] 
        
      };
    } else {
      // Crear nueva categoría
      this.sucursalId = null;
      this.sucursal = { nombre: '', descripcion: '', direccion: '', telefono: '', email: '', ciudad:'', provincia:'', distrito:'',referencia:'',serviciosVeterinariosIds: [] };
      this.listaServicios;
    }
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.sucursalId= null;
    this.sucursal = { nombre: '', descripcion: '', direccion: '', telefono: '', email: '', ciudad:'', provincia:'', distrito:'',referencia:'',serviciosVeterinariosIds: []  };
  }
  

  guardarSucursal(): void {
    if (this.sucursalId) {
      // Actualizar categoría
      this.sucursalesService.actualizarSucursal(this.sucursalId, this.sucursal).subscribe(() => {
        this.loadCategorias();
        this.cerrarModal();
      });
    } else {
      // Crear nueva categoría
      this.sucursalesService.crearSucursal(this.sucursal).subscribe(() => {
        this.loadCategorias();
        this.cerrarModal();
      });
    }
  }
  toggleServicio(id: number) {
    const index = this.sucursal.serviciosVeterinariosIds.indexOf(id);
    if (index === -1) {
      this.sucursal.serviciosVeterinariosIds.push(id); // Agregar si no está seleccionado
    } else {
      this.sucursal.serviciosVeterinariosIds.splice(index, 1); // Remover si ya estaba seleccionado
    }
  }
  

  eliminarCategoria(id: number): void {
    this.sucursalesService.eliminarSucursal(id).subscribe(() => {
      this.loadCategorias();
    });
  }
  loadServicios(): void {
    this.serviciosVeterinariosService.getAllServices().subscribe({
      next:(data) =>{
        this.listaServicios =data;
      }
    })
  }
}
