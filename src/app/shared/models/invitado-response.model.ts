import { MesaResponse } from "./mesa-response.model";

export interface InvitadoResponse {
    id:number;
    nombre:string;
    selected?: boolean;  
    numeroMesa:number;

}