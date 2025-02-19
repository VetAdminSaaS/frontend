import { WithholdingTax } from "./withholdingTax.model";
export interface Productos {
    id: number;
    codeReference: string;  // Código único de referencia del producto
    name: string;  // Nombre del producto
    quantity: number;  // Cantidad disponible del producto
    discountRate: number;  // Tasa de descuento del producto
    price: number;  // Precio unitario del producto
    taxRate: number;  // Tasa de impuesto asociada al producto
    unitMeasureId: number;  // ID de la unidad de medida (por ejemplo, kg, unidad)
    standardCodeId: number;  // ID del código estándar (para clasificación)
    isExcluded: number;  // Indica si el producto está excluido de ciertas operaciones
    tributeId: number;  // ID del tipo de impuesto (por ejemplo, IVA)
    withholdingTaxes: WithholdingTax[];  // Impuestos retenidos asociados al producto
    coverPath: string;  // Ruta del producto en su cobertura o presentación principal
    selectedQuantity: number;  // Cantidad seleccionada por el usuario en el carrito o 
    
         
}

