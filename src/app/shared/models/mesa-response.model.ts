import { InvitadoResponse } from "./invitado-response.model";

export interface MesaResponse {
    id:number;
    numero:number;
    cantidad:number;
    imagenGenerada?:string;
    invitados: InvitadoResponse[];
    mostrarInvitados:boolean;


}