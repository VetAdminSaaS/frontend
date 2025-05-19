import { TipoEmpleado } from "./empleado-registration.model";

export interface EmpleadoProfile {
    id:number;
    nombre:string;
    apellido:string;
    fechaNacimiento:string;
    direccion:string;
    profilePath:string;
    especialidadName:string[];
    sucursalName:string;
    tipoDocumentoIdentidad: TipoDocumentoIdentidad;
    genero: Genero;
    numeroDocumentoIdentidad:string;
    telefono:string;
    fechaContratacion:string;
    estado: boolean;
    email:string;
    role:ERole;
    nombreServicio:string[];
    tipoEmpleado: TipoEmpleado;



}
export enum TipoDocumentoIdentidad{
    DNI = 'DNI',
    PASAPORTE ='PASAPORTE',
    CARNET_EXTRANJERIA = 'CARNET_EXTRANJERIA',
}
export enum Genero{
    MASCULINO ='MASCULINO',
    FEMENINO = 'FEMENINO'
}
export enum ERole{
    ADMIN = 'ADMIN',
    EMPLEADO = 'EMPLEADO',
    CUSTOMER = 'CUSTOMER',
}