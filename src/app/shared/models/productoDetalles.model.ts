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
    standard_code_id: number;
    is_excluded: number;
    tribute_id: number;
    withholding_taxes: WithholdingTax[];
    coverPath: string;
    selectedQuantity: number;
    createdAt: string;
    updatedAt: string;
    descripcion: string;
}
