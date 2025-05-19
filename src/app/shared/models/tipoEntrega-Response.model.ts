import { TiposDeEntrega } from "./productos.model";

export interface TipoEntregaResponse {
    productoId:number;
    tiposEntrega: TiposDeEntrega[];
    costoDespacho:number;
}