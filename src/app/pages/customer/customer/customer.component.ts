import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarAdminComponent } from "../../../shared/components/sidebar-admin/sidebar-admin.component";
import { UsuarioStoreDTO } from '../../../shared/models/usuario.formulario.store.model';
import { usuariosStoreService } from '../../../core/services/usuarios.store';
import { CommonModule, NgIf } from '@angular/common';
import { UserProfile } from '../../../shared/models/usuarios-profile.model';
import { Municipios } from '../../../shared/models/municipios.model';
import { rangoNumericoService } from '../../../core/services/rango-numerico.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [SidebarAdminComponent, ReactiveFormsModule, FormsModule, NgIf,CommonModule], // <-- Agregar ReactiveFormsModule
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  municipios: Municipios[]=[]; 
  usuarioForm: FormGroup;
  editMode: boolean = false; // Controla el modo de edición
  private usuariosStore = inject(usuariosStoreService);
  private fb = inject(FormBuilder);
  private rangosNumericosService = inject(rangoNumericoService);
  usuarioMunicipioNombre: string = '';
  private toastr = inject(ToastrService);
  private router = inject(Router);  
  private authService = inject(AuthService);

  constructor() {

    this.usuarioForm = this.fb.group({
      id: [null], // ID del usuario (necesario para actualizar)
      identification: [''],
      names: [''],
      address: [''],
      email: [''],
      phone: [''],
      legalOrganizationId: [null],
      tributeId: [null],
      identificationDocumentId: [null],
      municipalityId: [''],
      company: [''],
      tradeName: [''],
      dv: [null]
    });
  }

  // Tipos de identificación disponibles
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

  // Obtener el nombre del tipo de identificación basado en el ID
  getIdentificationTypeName(id: number): string {
    const type = this.identificationTypes.find(t => t.id === id);
    return type ? type.name : 'Desconocido';
  }

  ngOnInit(): void {
    this.loadUserData();
    this.loadMunicipios();
  }

  loadUserData(): void {
    this.usuariosStore.getUsuariosStore().subscribe({
      next: (user: UsuarioStoreDTO) => {
        if (user && user.userId) {

          this.usuarioForm.patchValue({ ...user, id: user.userId });

          // Buscar el nombre del municipio después de cargar los datos del usuario
          this.buscarNombreMunicipio(user.municipalityId);
        } else {
          this.toastr.error("Error al cargar los datos del usuario, Intentalo nuevamente mas tarde", 'Error');
        }
      },
      error: (err) => {
        this.toastr.error("Error al cargar los datos del usuario, Intentalo nuevamente mas tarde", 'Error');
      }
    });
  }
  loadMunicipios(): void {
    this.rangosNumericosService.getMunicipios().subscribe({
      next: (data) => {
        this.municipios = data;

        // Buscar el nombre del municipio después de cargar la lista de municipios
        const municipalityId = this.usuarioForm.value.municipalityId;
        this.buscarNombreMunicipio(municipalityId);
      },
      error: (error) => {
        this.toastr.error("Error al cargar los datos del usuario, Intentalo nuevamente mas tarde", 'Error')
      }
    });
  }
  buscarNombreMunicipio(municipalityId: number): void {
    if (this.municipios.length > 0 && municipalityId) {
      const municipio = this.municipios.find(m => m.id === municipalityId);
      this.usuarioMunicipioNombre = municipio ? municipio.name : 'Municipio no encontrado';
    }
  } 
  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

actualizarUsuario(): void {
 

  if (this.usuarioForm.valid) {
    const userId = this.usuarioForm.value.id;

    if (!userId) {  
      this.toastr.error("Error no se puede actualizar los datos del usuario, Intentalo nuevamente mas tarde", 'Error')
      return;
    }

    

    this.usuariosStore.updateUsuario(userId, this.usuarioForm.value).subscribe({
      next: () => {
        this.toastr.success("Usuario Actualizado correctamente", 'Éxito')
        this.editMode = false;
      },
      error: (err) => {
        this.toastr.error("Error al actualizar el perfil, Intentalo nuevamente mas tarde", 'Error')
      }
    });
  }
}

suspenderCuenta(id: number): void {
  this.authService.suspendeCuentaUsuario(id).subscribe({
    next: (response) => {
      console.log('Cuenta suspendida', response);
      this.toastr.success("Cuenta suspendida correctamente",'Éxito')
      this.router.navigate(['customer/cuenta-suspendida']);
 

  
    },
    error: (err) => {
      console.log('Error al suspender la cuenta', err);
      this.toastr.error("Error al suspender la cuenta, Inténtalo nuevamente más tarde", 'Error');
    }
  });
}
}
