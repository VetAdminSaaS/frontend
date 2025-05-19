import { Component, inject } from '@angular/core';
import { SidebarFactusComponent } from "../../../../shared/components/sidebar-factus/sidebar-factus.component";
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { ServiciosVeterinariosResponse } from '../../../../shared/models/serviciosVeterinarios-model';
import { ServiciosVeterinariosRequest } from '../../../../shared/models/servicioVeterinario-request.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiciosVeterinarios } from '../../../../core/services/serviciosveterinarios.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [SidebarFactusComponent, NavbarComponent, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.scss'
})
export class ServiciosComponent {
  modalAbierto: boolean = false;
  filtroNombreServicio: string = '';
  serviciosFiltrados: ServiciosVeterinariosResponse[] =[];
  servicios: ServiciosVeterinariosResponse[] =[];
  servicioId: number | null = null;
  servicio: ServiciosVeterinariosRequest= {nombre:'',descripcion:'',precio:0,disponible:true,coverPath:''}
  private serviciosService = inject(ServiciosVeterinarios);
  private toastr = inject(ToastrService);
  imagenSeleccionada: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
    isRetentionEnabled = false;
  retentionCode: string = '';
  retentionPercentage: number | null = null;
  isDragging = false;
  

  

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.serviciosService.getAllServices().subscribe({
      next: (data) => {
        this.servicios = data;
        this.filtrarServicios();
      }
    })
  }
  onRetentionCodeChange(event: Event): void {
    this.retentionCode = (event.target as HTMLInputElement).value;
  }
  onRetentionPercentageChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.retentionPercentage = value ? parseFloat(value) : null;
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result; // Vista previa en Base64
        this.servicio.coverPath = reader.result as string; // Guardar en el objeto servicio
      };
      reader.readAsDataURL(file);
    }
  }
  

  filtrarServicios(): void {
    this.serviciosFiltrados = this.servicios.filter(servicio =>
      servicio.nombre.toLowerCase().includes(this.filtroNombreServicio.toLowerCase())
    );
  }

  abrirModal(servicio?: ServiciosVeterinariosResponse): void {
    this.modalAbierto = true;
    if (servicio) {
      this.servicioId = servicio.id;
      this.servicio = { ...servicio };
    } else {
      this.servicioId = null;
      this.servicio = { nombre: '', descripcion: '', precio: 0, disponible: true, coverPath: '' };
    }
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.servicioId = null;
    this.servicio = { nombre: '', descripcion: '', precio: 0, disponible: true, coverPath: '' };
  }

  guardarServicio(): void {
    if (this.servicioId) {
      this.serviciosService.actualizarServicioVeterinario(this.servicioId, this.servicio).subscribe(() => {
        this.cargarServicios();
        this.toastr.success('Servicio actualizado correctamente', 'Éxito');
        this.cerrarModal();
      });
    } else{
      this.serviciosService.crearServicioVeterinario(this.servicio).subscribe(() => {
        this.cargarServicios();
        this.toastr.success('Servicio creado correctamente', 'Éxito');
        this.cerrarModal();
      });
    } 
  }

  eliminarServicio(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      this.serviciosService.eliminarServicioVeterinario(id).subscribe(() => {
        this.cargarServicios();
      });
    }
  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files?.[0];
    this.processFile(files);
    
}
processFile(file?: File) {
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
      this.servicio.coverPath = reader.result as string; 
    };
    reader.readAsDataURL(file);
  }
}
removeImage() {
  this.imagePreview = null;
  this.servicio.coverPath = ''; 

}
}


