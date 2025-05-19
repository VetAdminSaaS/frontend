import { SucursalStock } from "./sucursalStock.model";
import { WithholdingTax } from "./withholdingTax.model";
export interface Productos {
    id: number;
    code_reference: string;  // Código único de referencia del producto
    name: string;  // Nombre del producto
    quantity: number;  // Cantidad disponible del producto
    discount_rate: number;  // Tasa de descuento del producto
    price: number;  // Precio unitario del producto
    tax_rate: number;  // Tasa de impuesto asociada al producto
    unit_measure_id: number;  // ID de la unidad de medida (por ejemplo, kg, unidad)
    standardCodeId: number;  // ID del código estándar (para clasificación)
    isExcluded: number;  // Indica si el producto está excluido de ciertas operaciones
    tributeId: number;  // ID del tipo de impuesto (por ejemplo, IVA)
    withholdingTaxes: WithholdingTax[];  // Impuestos retenidos asociados al producto
    coverPath: string;  // Ruta del producto en su cobertura o presentación principal
    selectedQuantity: number;  // Cantidad seleccionada por el usuario en el carrito o 
    updatedAt: string;
    createdAt: string;
    descripcion: string;
    categoryName:number;
    sucursales: SucursalStock[]; 
    tiposEntrega: TiposDeEntrega[];
    costoDespacho: number;
}
export enum TiposDeEntrega {
    RETIRO_EN_TIENDA = 'RETIRO_EN_TIENDA',
    DESPACHO_A_DOMICILIO = 'DESPACHO_A_DOMICILIO'
}


