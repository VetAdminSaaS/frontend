import { Component, inject } from '@angular/core';
import { SidebarAdminComponent } from "../../../shared/components/sidebar-admin/sidebar-admin.component";
import { CommonModule } from '@angular/common';
import { UserProfile } from '../../../shared/models/usuarios-profile.model';
import { usuariosStoreService } from '../../../core/services/usuarios.store';
import { SidebarFactusComponent } from "../../../shared/components/sidebar-factus/sidebar-factus.component";
import { rangoNumericoService } from '../../../core/services/rango-numerico.service';
import { Municipios } from '../../../shared/models/municipios.model';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [ CommonModule, SidebarFactusComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent {
  user: UserProfile[] = [];
  municipios:Municipios[] =[];
  private usuariosProfile = inject(usuariosStoreService);
  private factusconexion = inject(rangoNumericoService);
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
  legalOrganization: { id:number; name: string}[] =[
    {id: 1, name: 'Persona Jurídica'},
    {id: 2, name:'Persona Natural'}
  ]
  tributo: {id: number; name: string}[] =[
    {id: 18, name: 'IVA'},
    {id: 21, name: 'No aplica'}
  ]
 
  ngOnInit(): void {
   this.loadUsuarios();
   this.loadMunicipios();

    
  }
  getIdentificationTypeName(id: number): string {
    const type = this.identificationTypes.find(t => t.id === id);
    return type ? type.name : 'Desconocido';
  }
  getLegalOrganization(id:number): string{
    const type = this.legalOrganization.find(t => t.id === id);
    return type ? type.name : 'Desconocido';
  }
  getTributo(id:number):string {
    const type = this.tributo.find(t=> t.id === id);
    return type ? type.name : 'Desconocido'
  }
  loadMunicipios(): void {
    this.factusconexion.getMunicipios().subscribe({
      next: (response) => {
        this.municipios = response; // Guarda los municipios en la variable
      },
      error: (err) => {
        console.error("Error al cargar municipios:", err);
      }
    });
  }

  getMunicipioNombre(id: number): string {
    const municipio = this.municipios.find(m => m.id === id);
    return municipio ? municipio.name : 'Desconocido';
  }

  
  
  
  loadUsuarios(): void {
    this.usuariosProfile.getUsuarios().subscribe ({
      next: (usuarios) => {
        this.user = usuarios;
      },
      error:(error) => {
        console.error('Error al cargar los usuarios:', error);
      }
    });
  }
}
