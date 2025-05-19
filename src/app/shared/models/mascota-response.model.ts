import { Especie } from "./mascota-request.model";

export interface MascotaResponse {
    id:number;
    nombreCompleto:string;
    raza:string;
    profilepath:string;
    especie: Especie;
    fechaNacimiento:string;
    peso:number;
    descripcion:string;
    esterilizado:boolean;
    apoderadosName:string ;
    createdAt:string;   
    updatedAt:string;
}
