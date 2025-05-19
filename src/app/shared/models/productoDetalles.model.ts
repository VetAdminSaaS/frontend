import { SucursalStock } from "./sucursalStock.model";
import { WithholdingTax } from "./withholdingTax.model";

export interface ProductoDetalles {
    id: number;
    code_reference: string;
    name: string;
    quantity: number;
    discount_rate: number;
    price: number;
    tax_rate: number;
    unit_measure_id: number;
    standardCodeId: number;
    isExcluded: number;
    tributeId: number;
    withholdingTaxes: WithholdingTax[];
    coverPath: string;
    selectedQuantity: number;
    createdAt: string;
    updatedAt: string;
    descripcion: string;
    categoryName: string;
    sucursalesStock: SucursalStock[];
    costoDespacho: number;
    tiposEntrega: TiposDeEntrega[]; 
}

export enum TiposDeEntrega {
    RETIRO_EN_TIENDA = 'RETIRO_EN_TIENDA',
    DESPACHO_A_DOMICILIO = 'DESPACHO_A_DOMICILIO'
}
