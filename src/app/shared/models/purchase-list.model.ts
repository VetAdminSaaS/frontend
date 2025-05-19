import { PaymentStatus, PurchaseItemResponse } from "./purchase-response-model";

export interface PurchaseList {
    id:number;
    total: number;
    createdAt: string;
    paymentStatus: PaymentStatus;
    names:string;
    items: PurchaseItemResponse;
    numeberingRangeId:number;
    number:number;
    coverPath:string;
}