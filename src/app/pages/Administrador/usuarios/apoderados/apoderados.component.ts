import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { SidebarFactusComponent } from "../../../../shared/components/sidebar-factus/sidebar-factus.component";
import { ApoderadoService } from '../../../../core/services/apoderado.service';
import { ApoderadoResponse } from '../../../../shared/models/apoderado-response.model';
import { ApoderadoRequest } from '../../../../shared/models/apoderado-request.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-apoderados',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NavbarComponent,
    SidebarFactusComponent,
    FormsModule
  ],
  templateUrl: './apoderados.component.html',
  styleUrl: './apoderados.component.scss'
})
export class ApoderadosComponent implements OnInit {
  // Datos y estado
  apoderados: ApoderadoResponse[] = [];
  filteredApoderados: ApoderadoResponse[] = [];
  apoderadoForm!: FormGroup;
  isEditing = false;
  isView = false;
  apoderadoId: number | null = null;
  showForm = false;
  showDeleteModal = false;
  apoderadoToDelete: number | null = null;
  searchTerm = '';
  
  // Paginación
  currentPage = 1;
  pageSize = 10;
  
  // Pestañas del formulario
  activeTab: 'personal' | 'contacto' | 'ubicacion' = 'personal';
  
  // Listas para el formulario
  tiposDocumento = ['DNI', 'Pasaporte', 'Carnet de Extranjería'];
  generos = ['MASCULINO', 'FEMENINO'];

  private apoderadoService = inject(ApoderadoService);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  actionType: 'eliminar' | 'suspender' = 'eliminar';

  ngOnInit(): void {
    this.initForm();
    this.obtenerApoderados();
  }

  initForm(): void {
    this.apoderadoForm = this.fb.group({
      // Información personal
      tipoDocumentoIdentidad: ['', Validators.required],
      numeroIdentificacion: ['', [Validators.required, Validators.pattern(/^[0-9]{8,12}$/)]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      genero: ['', Validators.required],
      fechaNacimiento: ['',Validators.required],
      
      // Información de contacto
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9,15}$/)]],
      direccion: ['', Validators.required],
      
      // Ubicación
      departamento: [''],
      provincia: [''],
      distrito: ['']
    });
  }

  obtenerApoderados(): void {
    this.apoderadoService.obtenerTodosLosApoderados().subscribe({
      next: (data) => {
        this.apoderados = data;
        this.filteredApoderados = [...data];
      },
      error: (err) => console.error('Error al obtener apoderados', err)
    });
  }

  mostrarFormulario(): void {
    this.showForm = true;
    this.isEditing = false;
    this.apoderadoId = null;
    this.apoderadoForm.reset();
    this.activeTab = 'personal';
  }

  crearApoderado(): void {
    this.isView = false;
    this.isEditing = false;
    if (!this.apoderadoForm.valid) {
      this.markFormGroupTouched(this.apoderadoForm);
      console.warn('Formulario no válido');
      return;
    }
  
    const apoderado: ApoderadoRequest = this.apoderadoForm.value;
    console.log('Datos a enviar:', apoderado);
  
    if (this.isEditing && this.apoderadoId) {
      console.log('Actualizando apoderado con ID:', this.apoderadoId);
      this.apoderadoService.actualizarApoderado(this.apoderadoId, apoderado).subscribe({
        next: (response) => {
          console.log('Apoderado actualizado correctamente:', response);
          this.obtenerApoderados();
          this.cancelarEdicion();
        },
        error: (err) => console.error('Error al actualizar apoderado:', err)
      });
    } else {
      console.log('Creando nuevo apoderado');
      this.apoderadoService.crearApoderadoByAdmin(apoderado).subscribe({
        next: (response) => {
          console.log('Apoderado creado correctamente:', response);
          this.obtenerApoderados();
          this.cancelarEdicion();
        },
        error: (err) => console.error('Error al crear apoderado:', err)
      });
    }
  }
  editarApoderado(apoderado: ApoderadoResponse): void {
    console.log('Editando apoderado:', apoderado);
    
    this.isEditing = true;
    this.apoderadoId = apoderado.id; 
    this.apoderadoForm.patchValue(apoderado);
    this.showForm = true;
    this.activeTab = 'personal';
  
    console.log('ID del apoderado en edición:', this.apoderadoId);
    console.log('Formulario cargado con datos:', this.apoderadoForm.value);
  }
  verDetalles(apoderado: ApoderadoResponse): void {
    console.log('Detalles del apoderado:', apoderado);
    this.apoderadoForm.patchValue(apoderado);
    this.showForm = true;
    this.isView= true;
    this.isEditing = false;
  }
  
  

  
  confirmarAccion(): void {
    if (!this.apoderadoToDelete) {
      console.warn('No hay apoderado seleccionado.');
      return;
    }
  
    if (this.actionType === 'eliminar') {
      this.eliminarApoderado();
    } else {
      this.suspenderCuenta(this.apoderadoToDelete);
    }
  }
 
  
  confirmarEliminacion(id: number): void {
    this.apoderadoToDelete = id;
    this.actionType = 'eliminar';
    this.showDeleteModal = true;
  }
  
  confirmarSuspension(id: number): void {
    this.apoderadoToDelete = id;
    this.actionType = 'suspender'; // ✅ Cambia el tipo de acción
    this.showDeleteModal = true;
  }
  
  
  suspenderCuenta(id: number): void {
    console.log('Suspendiendo cuenta del apoderado con ID:', id);
    
    this.authService.suspendeCuentaUsuario(id).subscribe({
      next: () => {
        console.log(`Cuenta del apoderado ${id} suspendida correctamente`);
        this.obtenerApoderados();
        this.resetModal();
      },
      error: (err) => console.error('Error al suspender cuenta', err)
    });
  }
  
  eliminarApoderado(): void {
    if (!this.apoderadoToDelete) {
      console.warn('No hay apoderado seleccionado para eliminar.');
      return;
    }
  
    console.log('Eliminando apoderado con ID:', this.apoderadoToDelete);
    
    this.apoderadoService.eliminarApoderado(this.apoderadoToDelete).subscribe({
      next: () => {
        console.log(`Apoderado ${this.apoderadoToDelete} eliminado correctamente`);
        this.obtenerApoderados();
        this.resetModal();
      },
      error: (err) => console.error('Error al eliminar apoderado', err)
    });
  }
  
  resetModal(): void {
    this.showDeleteModal = false;
    this.apoderadoToDelete = null;
  }
  
  cancelarEdicion(): void {
    this.isEditing = false;
    this.apoderadoId = null;
    this.apoderadoForm.reset();
    this.showForm = false;
    this.resetModal();
  }
  
  // Filtrado y búsqueda
  filterApoderados(): void {
    if (!this.searchTerm) {
      this.filteredApoderados = [...this.apoderados];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredApoderados = this.apoderados.filter(apoderado => 
      apoderado.nombre.toLowerCase().includes(term) ||
      apoderado.apellido.toLowerCase().includes(term) ||
      apoderado.numeroIdentificacion.toLowerCase().includes(term) ||
      apoderado.email.toLowerCase().includes(term)
    );
    
    this.currentPage = 1; // Resetear a la primera página al filtrar
  }

  // Paginación
  nextPage(): void {
    if (this.currentPage * this.pageSize < this.filteredApoderados.length) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Manejo de pestañas
  setActiveTab(tab: 'personal' | 'contacto' | 'ubicacion'): void {
    this.activeTab = tab;
  }

  // Utilidades
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Getters para la paginación
  get totalPages(): number {
    return Math.ceil(this.filteredApoderados.length / this.pageSize);
  }

  get paginatedApoderados(): ApoderadoResponse[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredApoderados.slice(startIndex, startIndex + this.pageSize);
  }
}