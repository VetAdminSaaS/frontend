import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarAdminComponent } from '../../../shared/components/sidebar-admin/sidebar-admin.component';
import { DireccionEnvioResponse } from '../../../shared/models/direccion-envio-response.model';
import { DireccionEnvioRequest } from '../../../shared/models/direccion-envio-request.model';
import { Direccionservice } from '../../../core/services/direccion.service';
import { FormsModule } from '@angular/forms';
import e from 'express';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-direcciones',
  standalone: true,
  imports: [SidebarAdminComponent, CommonModule, FormsModule],
  templateUrl: './direcciones.component.html',
  styleUrl: './direcciones.component.scss'
})
export class DireccionesComponent {
  direcciones: DireccionEnvioResponse[] = [];
  private direccionService = inject(Direccionservice);
  mostrandoFormulario = false;
  direccion: DireccionEnvioRequest = { nombre: '', direccion: '', ciudad: '',codigoPostal: '',referencia:'', telefono: '', piso:1, provincia:'', distrito:''};
  editando = false;
  direccionId: number |null = null;
  private Toastr = inject(ToastrService);

  ngOnInit(): void {
    this.loadDireccionByUsuario();
  }

  private loadDireccionByUsuario(): void {
    this.direccionService.getAllDireccionByUsuario().subscribe({
      next: (data) => {
        this.direcciones = data;
        this.direccionId;

      },
      error: (error) => {
        console.error("Error al cargar direcciones:", error);
      }
    });
  }
  abrirFormulario(direccion?: DireccionEnvioResponse): void {
    this.mostrandoFormulario = true;
    this.editando = !!direccion;
    
    if (direccion) {
      this.direccionId = direccion.id; // Guardar el ID para edición
      this.direccion = { ...direccion };
   // Verifica que el ID sea correcto
    } else {
      this.direccionId = null; // Resetear el ID en creación
      this.direccion = { nombre: '', direccion: '', ciudad: '', codigoPostal: '', referencia: '', telefono: '', piso: 1, provincia:'',distrito:'' };
    }
  }
  

  cerrarFormulario(): void {
    this.mostrandoFormulario = false;
    this.direccion = {nombre: '', direccion: '', ciudad: '',  codigoPostal: '', referencia:'', telefono: '', piso:1,provincia:'',distrito:'' };
    this.editando = false;
  }

  guardarDireccion(): void {
    console.log("Datos enviados:", this.direccion);
  
    if (this.direccionId) { 
      this.direccionService.actualizarDireccionByUsuario(this.direccionId, this.direccion)
        .subscribe(() => {
          this.loadDireccionByUsuario();
          this.cerrarFormulario(); 
          this.Toastr.success("Dirección Actualizada correctamente",'Éxito')
        }, error => {
          console.error("Error al actualizar dirección:", error);
        });
  
    } else {
      this.direccionService.crearDireccionByUsuario(this.direccion)
        .subscribe(() => {
          this.loadDireccionByUsuario();
          this.cerrarFormulario(); 
          this.Toastr.success("Dirección Creada correctamente",'Éxito')
        }, error => {
          console.error("Error al crear dirección:", error);
          this.Toastr.error("Hubo un problema al crear la dirección",'Error')
        });
    }
  }
  
  

  eliminarDireccion(id: number): void {
    
    this.direccionService.eliminarDireccionByUsuario(id).subscribe(() => {
      this.loadDireccionByUsuario();
    });
  }
}
