import { SucursalStock } from "./sucursalStock.model";

export interface SucursalResponse {
    id:number;
    nombre:string;
    descripcion:string;
    direccion:string;
    telefono:string;
    email:string;
    ciudad:string;
    provincia:string;
    distrito:string;
    referencia:string;
    sucursales: SucursalStock[]; 
    nombreServicio: string[]; 


}