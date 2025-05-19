import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MesaService } from '../../../../core/services/mesa.service';
import { MesaResponse } from '../../../../shared/models/mesa-response.model';
import { MesaRequest } from '../../../../shared/models/mesa-request.model';
import { SidebarFactusComponent } from "../../../../shared/components/sidebar-factus/sidebar-factus.component";
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mesa',
  standalone: true,
   imports: [SidebarFactusComponent, NavbarComponent,CommonModule,ReactiveFormsModule],
  templateUrl: './mesa.component.html',
  styleUrls: ['./mesa.component.scss']
})
export class MesaComponent implements OnInit {
  mesas: MesaResponse[] = [];
  mesaForm: FormGroup;
  isEditing: boolean = false;
  selectedMesaId: number | null = null;
  isModalOpen: boolean = false; 

  constructor(
    private fb: FormBuilder,
    private mesaService: MesaService
  ) {
    this.mesaForm = this.fb.group({
      numero: ['', Validators.required],
      cantidad: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadMesas();
  }

  // Cargar todas las mesas
  loadMesas(): void {
    this.mesaService.getAllMesas().subscribe({
      next: (data) => this.mesas = data,
      error: (err) => console.error('Error cargando mesas:', err)
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
  // Guardar o actualizar una mesa
  saveMesa(): void {
    if (this.mesaForm.invalid) {
      console.error('Formulario inválido');
      return;
    }

    const mesaData: MesaRequest = this.mesaForm.value;

    if (this.isEditing && this.selectedMesaId !== null) {
      // Actualizar mesa
      this.mesaService.updateMesa(this.selectedMesaId, mesaData).subscribe({
        next: () => {
          this.resetForm();
          this.loadMesas();
        },
        error: (err) => console.error('Error actualizando mesa:', err)
      });
    } else {
      // Crear mesa
      this.mesaService.createMesa(mesaData).subscribe({
        next: () => {
          this.resetForm();
          this.loadMesas();
        },
        error: (err) => console.error('Error creando mesa:', err)
      });
    }
  }

  // Editar una mesa
  editMesa(mesa: MesaResponse): void {
    this.isEditing = true;
    this.selectedMesaId = mesa.id;
    this.mesaForm.patchValue({
      numero: mesa.numero,
      cantidad: mesa.cantidad
    });
  }

  // Eliminar una mesa
  deleteMesa(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta mesa?')) {
      this.mesaService.deleteMesa(id).subscribe({
        next: () => this.loadMesas(),
        error: (err) => console.error('Error eliminando mesa:', err)
      });
    }
  }

  // Resetear el formulario
  resetForm(): void {
    this.mesaForm.reset();
    this.isEditing = false;
    this.selectedMesaId = null;
  }
}