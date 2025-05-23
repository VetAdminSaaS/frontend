import { BillingPeriod } from "./billing-period.model";
import { UsuarioStoreDTO } from "./usuario.formulario.store.model";

export interface PurchaseResponse {
id: number;
total: number;
createdAt: string;
paymentStatus: PaymentStatus;
customer: UsuarioStoreDTO;
items: PurchaseItemResponse[];
numberingRangeId: number;
referenceCode: string;
payment_form:number;
payment_method_code:number;
billing_period: BillingPeriod[];
shipmentStatus: ShipmentStatus;
}
export enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED'
}
export enum ShipmentStatus {
    COMPRA_RECIBIDA = 'COMPRA_RECIBIDA',
    COMPRA_CONFIRMADA = 'COMPRA_CONFIRMADA',
    COMPRA_LISTA_PARA_RETIRAR = 'COMPRA_LISTA_PARA_RETIRAR',
    COMPRA_ENTREGADA = 'COMPRA_ENTREGADA',
}

export interface PurchaseItemResponse {
    productoId: number;
    name: string;
    quantity: number;
    price: number;
    coverPath?: string;
    code_reference: string;
    unit_measure_id: number;
    discount_rate: number;
    tax_rate: number;
    standard_code_id: number;
    is_excluded: number;
    tribute_id: number;
    withholdingTaxes?: any[];
}
