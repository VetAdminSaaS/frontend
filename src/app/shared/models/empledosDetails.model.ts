import { Genero, TipoDocumentoIdentidad } from "./empleado-profile.model";
import { TipoEmpleado } from "./empleado-registration.model";

export interface EmpleadosDetails {
    id:number;
    nombre:string;
    apellido:string;
    fechaNacimiento:string;
    direccion:string;
    profilePath:string;
    especialidadesNombres:string[];
    createdAt:string;
    updateAt:string;
    sucursalName:string;
    tipoDocumentoIdentidad:TipoDocumentoIdentidad;
    numeroDocumentoIdentidad:string;
    genero:Genero;
    telefono:string;
    fechaContratacion:string;
    estado:boolean;
    email:string;
    nombreServicio:string[];
    tipoEmpleado: TipoEmpleado;
}