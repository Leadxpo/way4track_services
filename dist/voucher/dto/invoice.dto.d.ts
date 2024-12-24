import { PaymentStatus } from "src/product/dto/payment-status.enum";
export declare class InvoiceDto {
    fromDate?: string;
    toDate?: string;
    paymentStatus?: PaymentStatus;
    companyCode?: string;
    unitCode?: string;
}
