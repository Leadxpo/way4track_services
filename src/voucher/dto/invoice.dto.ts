import { PaymentStatus } from "src/product/dto/payment-status.enum";

export class InvoiceDto {
    fromDate?: string;
    toDate?: string;
    paymentStatus?: PaymentStatus;
    companyCode?: string;
    unitCode?: string
}       