import { Genero, TipoDocumentoIdentidad } from "./empleado-profile.model";

export interface EmpleadoRegistration {
    email:string;
    password:string;
    nombre:string;
    apellido:string;
    especialidadIds:number[];
    tipoDocumentoIdentidad: TipoDocumentoIdentidad;
    numeroDocumentoIdentidad:string;
    genero:Genero;
    fechaContratacion:Date;
    estado:boolean;
    sucursalId:number;
    serviciosIds:number[];
    TipoEmpleado: TipoEmpleado;
}
export enum TipoEmpleado {
    VETERINARIO = 'VETERINARIO',
    RECEPCIONISTA = 'RECEPCIONISTA',
    ASISTENTE_VETERINARIO = 'AUXILIAR',
    GROMMER = 'GROMMER',
    OTRO = 'OTRO'
}