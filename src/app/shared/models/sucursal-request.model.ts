export interface SucursalRequest {
    nombre:string;
    descripcion:string;
    direccion:string;
    telefono:string;
    email:string;
    ciudad:string;
    provincia:string;
    distrito:string;
    referencia:string;
    serviciosVeterinariosIds:number[];
}