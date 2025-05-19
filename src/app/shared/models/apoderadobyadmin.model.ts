import { Genero, TipoDocumentoIdentidad } from "./empleado-profile.model";

export interface ApoderadoByAdmin {
     nombre:string;
        apellido:string;
        tipoDocumentoIdentidad: TipoDocumentoIdentidad;
        numeroIdentificacion:string;
        direccion:string;
        email:string;
        telefono:string;
        provincia:string;
        distrito:string;
        departamento:string;
        genero:Genero;
     
}