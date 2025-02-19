export interface PurchaseCreateUpdateRequest {
    total: number;
    items: PurchaseItemCreateUpdateRequest[];
    numberingRangeId: number;  
    customer: UsuarioStoreDTO; 
  }
  
import { UsuarioStoreDTO } from "./usuario.formulario.store.model";
import { WithholdingTax } from "./withholdingTax.model";

export interface PurchaseItemCreateUpdateRequest {
    productoId: number;
    name: string;
    quantity: number;
    price:number;
    coverPath: string;
    unit_measure_id: number;
    code_reference: string;
    discount_rate: number;
    tax_rate: number;
    standard_code_id: number;
    is_excluded: number;
    tribute_id: number;
    withholding_taxes: WithholdingTax[];
    

}