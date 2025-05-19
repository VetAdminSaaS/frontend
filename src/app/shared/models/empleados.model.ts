import { Genero, TipoDocumentoIdentidad } from "./empleado-profile.model";
import { TipoEmpleado } from "./empleado-registration.model";

export interface Empleados {
 
    nombre:string;
    apellido:string;
    fechaNacimiento:string;
    direccion:string;
    profilePath:string;
    created_At:string;
    updated_At:string;
    tipoDocumentoIdentidad:TipoDocumentoIdentidad;
    genero: Genero;
    telefono:string;
    estado:boolean;
    email:string;
    sucursalId:number;
    serviciosIds:number[];
    numeroDocumentoIdentidad:string;
    fechaContratacion:string;
    especialidadIds:number[];
    TipoEmpleado: TipoEmpleado;

}