import { Component, inject } from '@angular/core';
import { SidebarFactusComponent } from "../../../../shared/components/sidebar-factus/sidebar-factus.component";
import { NavbarComponent } from "../../../../shared/components/navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmpleadoService } from '../../../../core/services/empleado.service';
import { EmpleadosDetails } from '../../../../shared/models/empledosDetails.model';
import { Empleados } from '../../../../shared/models/empleados.model';
import { Genero, TipoDocumentoIdentidad } from '../../../../shared/models/empleado-profile.model';
import { EmpleadoRegistration, TipoEmpleado } from '../../../../shared/models/empleado-registration.model';
import { EspecialidadResponse } from '../../../../shared/models/especialidadResponse.model';
import { ServiciosVeterinariosResponse } from '../../../../shared/models/serviciosVeterinarios-model';
import { Sucursalesservice } from '../../../../core/services/sucursales.service';
import { ServiciosVeterinarios } from '../../../../core/services/serviciosveterinarios.service';
import { SucursalResponse } from '../../../../shared/models/sucursal-response.model';
import { EspecialidadService } from '../../../../core/services/especialidad.service';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [SidebarFactusComponent, NavbarComponent, CommonModule, FormsModule],
  templateUrl: './empleados.component.html',
  styleUrl: './empleados.component.scss'
})
export class EmpleadosComponent {
  empleados: Empleados[] = [];
  empleadosFiltrados: EmpleadosDetails[] = [];
  filtroNombre: string = '';
  filtroEspecialidad: string = '';
  filtroSucursal: string = '';
  filtroServicio: string = '';
  showModal: boolean = false;
  listaEspecialidades: EspecialidadResponse[] = [];
  listaServicios: ServiciosVeterinariosResponse[] = [];
  empleadoId: number | null = null;

  sucursal: SucursalResponse[] = [];
  detallesEmpleados: EmpleadosDetails[] = [];
  servicios: ServiciosVeterinariosResponse[] = [];
  sucursales: SucursalResponse[]=[];
  empleadosRegistrar: EmpleadoRegistration = {
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    especialidadIds: [],
    tipoDocumentoIdentidad: TipoDocumentoIdentidad.DNI,
    numeroDocumentoIdentidad: '',
    genero: Genero.MASCULINO,
    fechaContratacion: new Date(),
    estado: false, 
    sucursalId: 1,
    serviciosIds: [], 
    TipoEmpleado: TipoEmpleado.VETERINARIO, 
};
  empleado: Empleados = {
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    direccion: '',
    profilePath: '',
    especialidadIds: [],
    created_At: new Date().toISOString(),
    updated_At: new Date().toISOString(), 
    sucursalId: 0, 
    tipoDocumentoIdentidad: TipoDocumentoIdentidad.DNI, 
    genero: Genero.FEMENINO, 
    telefono: '',
    estado: false,
    email: '',
    serviciosIds: [], 
    numeroDocumentoIdentidad: '',
    fechaContratacion: '',
    TipoEmpleado: TipoEmpleado.VETERINARIO, 
};
  private empleadoService = inject(EmpleadoService);
  private sucursalService = inject(Sucursalesservice);
  private serviciosService = inject(ServiciosVeterinarios);
  private especialidadService = inject(EspecialidadService);

  ngOnInit(): void {
    this.loadEmpleados();
    this.obtenerSucursales();
    this.cargarServicios();
   
    this.cargarEspecialidades();
  }
  loadEmpleados(): void {
    this.empleadoService.getAllEmpleados().subscribe({
      next: (data) => {
        console.log(data); // ✅ Verifica los datos que llegan desde el backend
        this.detallesEmpleados = data;
        this.filtrarEmpleados();
      }
    });
  }
  
  openModal(empleado?: EmpleadosDetails): void {
    this.showModal = true;

    if (empleado) {
        console.log('Empleado seleccionado:', empleado); 
    
        if (!this.sucursales || !this.listaEspecialidades || !this.listaServicios) {
            console.error("Error: Listas no inicializadas correctamente.");
            return;
        }

        const sucursalEncontrada = this.sucursales.find(s => s.nombre === empleado.sucursalName);
        const serviciosEncontrados = this.listaServicios
            .filter(s => empleado.nombreServicio?.includes(s.nombre)) 
            .map(s => s.id);

        const especialidadesEncontradas = this.listaEspecialidades
            .filter(e => empleado.especialidadesNombres?.includes(e.nombre)) // Usa ?. para evitar errores
            .map(e => e.id);

        // Asignar valores al empleado
        this.empleadoId = empleado.id;
        this.empleado = {
            nombre: empleado.nombre,
            apellido: empleado.apellido,
            fechaNacimiento: empleado.fechaNacimiento,
            direccion: empleado.direccion,
            profilePath: empleado.profilePath,
            created_At: empleado.createdAt,
            updated_At: empleado.updateAt,
            tipoDocumentoIdentidad: empleado.tipoDocumentoIdentidad || TipoDocumentoIdentidad.DNI, // Manejo de valores vacíos
            genero: empleado.genero || Genero.FEMENINO, // Manejo de valores vacíos
            telefono: empleado.telefono,
            estado: empleado.estado,
            email: empleado.email,
            sucursalId: sucursalEncontrada ? sucursalEncontrada.id : 0, 
            serviciosIds: serviciosEncontrados || [], // Evita que sea `undefined`
            numeroDocumentoIdentidad: empleado.numeroDocumentoIdentidad,
            fechaContratacion: empleado.fechaContratacion,
            especialidadIds: especialidadesEncontradas || [], 
            TipoEmpleado: empleado.tipoEmpleado || TipoEmpleado.VETERINARIO, 
        };
    } else {
        this.empleadoId = null;
        this.empleado = {
            nombre: '',
            apellido: '',
            fechaNacimiento: '',
            direccion: '',
            profilePath: '',
            created_At: '',
            updated_At: '',
            tipoDocumentoIdentidad: TipoDocumentoIdentidad.DNI,
            genero: Genero.FEMENINO,
            telefono: '',
            estado: false,
            email: '',
            sucursalId: 0,
            serviciosIds: [],
            numeroDocumentoIdentidad: '',
            fechaContratacion: '',
            especialidadIds: [],
            TipoEmpleado: TipoEmpleado.VETERINARIO,
        };
    }
}
get empleadoFormulario(): any {
  return this.empleadoId ? this.empleado : this.empleadosRegistrar;
}


  trackById(index: number, item: any): number {
    return item.id;
  }
  obtenerSucursales(): void {
    this.sucursalService.getAllSucursales().subscribe({
      next: (data) => {
        this.sucursales = data;
      }
    });
  }
  cargarServicios(): void {
    this.serviciosService.getAllServices().subscribe({
      next: (data) => {
        this.listaServicios = data;
      }
    });
  } 
  
  cargarEspecialidades():void {
    this.especialidadService.getAllEspecialidades().subscribe({
      next: (data) => {
        this.listaEspecialidades = data;
      }
    })
  }
  actualizarSeleccionServicios(servicioId: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
  
    if (checked) {
      if (!this.empleado.serviciosIds.includes(servicioId)) { // Solo agregar si no existe
        this.empleado.serviciosIds.push(servicioId);
      }
    } else {
      this.empleado.serviciosIds = this.empleado.serviciosIds.filter(id => id !== servicioId);
    }
  }
  actualizarSeleccionEspecialidad(especialidadId: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.empleado.especialidadIds.push(especialidadId);
    } else {
      this.empleado.especialidadIds = this.empleado.especialidadIds.filter(id => id !== especialidadId);
    }
  }

  filtrarEmpleados(): void {
    const filtro = this.filtroNombre?.trim().toLowerCase();
    
    if (!filtro) {
      this.empleadosFiltrados = [...this.detallesEmpleados]; // Restaura la lista original si el filtro está vacío.
      return;
    }
  
    this.empleadosFiltrados = this.detallesEmpleados.filter(empleado =>
      empleado.apellido?.toLowerCase().includes(filtro) ||
      empleado.nombre?.toLowerCase().includes(filtro)
    );
  }
  
 
  eliminarEmpleado(id: number): void {
    this.empleadoService.eliminarEmpleado(id).subscribe(() => {
      this.loadEmpleados();
    });
  }
  closeModal(): void {
    this.showModal = false;
    this.empleadoId = null;
    this.empleado = this.empleado;
  }
  guardarEmpleado(): void {
    if (this.empleadoId) {
      console.log("Datos enviados en actualización:", this.empleado); 
      this.empleadoService.updateEmpleadoByAdmin(this.empleadoId,this.empleado).subscribe({
        next: () => {
          alert("Empleado actualizado correctamente.");
          this.loadEmpleados();
          this.closeModal();
        },
        error: (err) => {
          console.error("Error al actualizar empleado:", err);
          alert("Hubo un error al actualizar el empleado.");
        }
      });
    } else {
      console.log("Datos enviados para la creacion:", this.empleado); 
      this.empleadoService.registerEmpleadobyAdmin(this.empleadosRegistrar).subscribe({
        next: () => {
          alert("Empleado creado correctamente.");
          sucursalId: this.sucursal
          this.loadEmpleados();
          this.closeModal();
        },
        error: (err) => {
          console.error("Error al crear empleado:", err);
          alert("Hubo un error al registrar el empleado.");
        }
      });
    }
}
}
