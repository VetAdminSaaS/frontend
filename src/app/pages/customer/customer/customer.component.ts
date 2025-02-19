import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SidebarAdminComponent } from "../../../shared/components/sidebar-admin/sidebar-admin.component";
import { UsuarioStoreDTO } from '../../../shared/models/usuario.formulario.store.model';
import { usuariosStoreService } from '../../../core/services/usuarios.store';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [SidebarAdminComponent, ReactiveFormsModule], // <-- Agregar ReactiveFormsModule
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  usuarioForm: FormGroup;
  private usuariosStore = inject(usuariosStoreService);
  private fb = inject(FormBuilder);

  constructor() {
    this.usuarioForm = this.fb.group({
      identification: [''],
      names: [''],
      address: [''],
      email: [''],
      phone: [''],
      legalOrganizationId: [null],
      tributeId: [null],
      identificationDocumentId: [null],
      municipalityId: [null],
      company: [''],
      tradeName: [''],
      dv: [null]
    });
  }
  identificationTypes: { id: number, name: string }[] = [
    { id: 1, name: 'Registro civil' },
    { id: 2, name: 'Tarjeta de identidad' },
    { id: 3, name: 'Cédula de ciudadanía' },
    { id: 4, name: 'Tarjeta de extranjería' },
    { id: 5, name: 'Cédula de extranjería' },
    { id: 6, name: 'NIT' },
    { id: 7, name: 'Pasaporte' },
    { id: 8, name: 'Documento de identificación extranjero' },
    { id: 9, name: 'PEP' },
    { id: 10, name: 'NIT otro país' },
    { id: 11, name: 'NUIP' }
  ];
  
  // Función para obtener el nombre del tipo de identificación basado en el ID
  getIdentificationTypeName(id: number): string {
    const type = this.identificationTypes.find(t => t.id === id);
    return type ? type.name : 'Desconocido';
  }
  

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.usuariosStore.getUsuariosStore().subscribe({
      next: (user: UsuarioStoreDTO) => {
        this.usuarioForm.patchValue({
          identification: user.identification,
          names: user.names,
          address: user.address,
          email: user.email,
          phone: user.phone,
          legalOrganizationId: user.legalOrganizationId,
          tributeId: user.tributeId,
          identificationDocumentId: user.identificationDocumentId,
          municipalityId: user.municipalityId,
          company: user.company,
          tradeName: user.tradeName,
          dv: user.dv
        });
      },
      error: (err) => {
        console.error("Error al obtener los datos del usuario", err);
      }
    });
  }
}
