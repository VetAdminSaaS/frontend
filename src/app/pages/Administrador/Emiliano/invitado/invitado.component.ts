import { Component, inject, OnInit } from '@angular/core';
import { SidebarFactusComponent } from "../../../../shared/components/sidebar-factus/sidebar-factus.component";
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { InvitadoResponse } from '../../../../shared/models/invitado-response.model';
import { InvitadoService } from '../../../../core/services/invitado.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invitado',
  standalone: true,
  imports: [
    SidebarFactusComponent,
    NavbarComponent,
    CommonModule,
    ReactiveFormsModule, // ✅ Importar ReactiveFormsModule
  ],
  templateUrl: './invitado.component.html',
  styleUrl: './invitado.component.scss'
})
export class InvitadoComponent implements OnInit {
  invitados: InvitadoResponse[] = [];
  invitadoForm!: FormGroup;
  isEditing: boolean = false;
  selectedInvitadoId: number | null = null;
  isModalOpen: boolean = false; // Controla la visibilidad del modal


  // Inyectar servicios
  private invitadoService = inject(InvitadoService);
  private fb = inject(FormBuilder);

  ngOnInit() {
    this.getInvitados();
    this.invitadoForm = this.fb.group({
      nombre: ['', Validators.required]
    });
  }
  openModal() {
    this.isModalOpen = true;
  }

  // Cierra el modal
  closeModal() {
    this.isModalOpen = false;
    this.resetForm(); // Opcional: Limpia el formulario al cerrar
  }

  // Obtener todos los invitados
  getInvitados() {
    this.invitadoService.getAll().subscribe({
      next: (data) => {
        this.invitados = data;
      },
      error: (err) => console.error('Error obteniendo invitados:', err) // ✅ Manejo de errores
    });
  }

  // Crear o actualizar invitado
  saveInvitado() {
    if (this.invitadoForm.invalid) {
      console.error('Formulario inválido'); // ✅ Validar formulario antes de enviar
      return;
    }

    const invitadoData = this.invitadoForm.value;

    if (this.isEditing && this.selectedInvitadoId !== null) {
      // Actualizar invitado
      this.invitadoService.update(this.selectedInvitadoId, invitadoData).subscribe({
        next: () => {
          this.resetForm();
          this.getInvitados();
        },
        error: (err) => console.error('Error actualizando invitado:', err) // ✅ Manejo de errores
      });
    } else {
      // Crear invitado
      this.invitadoService.create(invitadoData).subscribe({
        next: () => {
          this.resetForm();
          this.getInvitados();
        },
        error: (err) => console.error('Error creando invitado:', err) // ✅ Manejo de errores
      });
    }
  }

  // Cargar datos para edición
  editInvitado(invitado: InvitadoResponse) {
    this.isEditing = true;
    this.selectedInvitadoId = invitado.id;
    this.invitadoForm.patchValue({ nombre: invitado.nombre });
    this.openModal();
  }

  // Eliminar invitado
  deleteInvitado(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este invitado?')) {
      this.invitadoService.delete(id).subscribe({
        next: () => {
          this.getInvitados();
        },
        error: (err) => console.error('Error eliminando invitado:', err) // ✅ Manejo de errores
      });
    }
  }

  // Resetear formulario
  resetForm() {
    this.invitadoForm.reset();
    this.isEditing = false;
    this.selectedInvitadoId = null;
  }
}