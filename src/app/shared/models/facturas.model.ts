
import { BillingPeriod } from "./billing-period.model";
import { RangosNumeracion } from "./rangos-numeracion.model";
import { PurchaseItemCreateUpdateRequest } from "./purchase-create.update-request";
import { UsuarioStoreDTO } from "./usuario.formulario.store.model";
export interface Facturas {
    numbering_range_id: number;
    reference_code: string;
    observation: string;
    payment_form: number;
    payment_due_date: Date;
    payment_method_code: number;
    billing_period: BillingPeriod;
    customer: UsuarioStoreDTO;
    items: PurchaseItemCreateUpdateRequest[];  
}
