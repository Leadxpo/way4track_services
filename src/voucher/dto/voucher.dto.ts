
import { PaymentType } from "src/asserts/enum/payment-type.enum";
import { RoleEnum } from "../enum/role-enum";
import { VoucherTypeEnum } from "../enum/voucher-type-enum";
import { PaymentStatus } from "src/product/dto/payment-status.enum";
import { ProductType } from "src/product/dto/product-type.enum";
import { DebitORCreditEnum, TypeEnum } from "../entity/voucher.entity";

export class VoucherDto {
    id?: number;
    name: string;
    quantity?: number;
    branchId: number;
    // role: RoleEnum;
    purpose: string;
    creditAmount: number;
    amount?: number; // nullable if not always provided
    reminigAmount?: number; // Fixed the typo "reminingAmount"
    paymentType: PaymentType;
    clientId: string;
    staffId: number;
    paymentTo: string; // staff name
    accountNumber?: number; // assuming this is the account number from the account entity
    voucherType: VoucherTypeEnum;
    generationDate?: Date;
    dueDate: Date;
    expireDate?: Date;
    shippingAddress?: string;
    buildingAddress?: string;
    hsnCode?: string;
    journalType: DebitORCreditEnum;
    SGST?: number;
    CGST?: number;
    IGST?: number;
    subDealerId?: number;
    ifscCode?: string;
    bankAccountNumber?: string;
    paymentStatus?: PaymentStatus;
    productType?: ProductType;
    companyCode: string;
    unitCode: string;
    voucherId?: string;
    fromAccount?: number
    toAccount?: number;
    createdAt?: Date;
    updatedAt?: Date;
    upiId?: string;
    checkNumber?: string;
    cardNumber?: string;
    product?: number;
    invoiceId?: string
    amountPaid?: number
    receiptPdfUrl?: string
    productDetails?: ProductDetailDto[];
    // invoice?: number
    ledgerId?: number
    pendingInvoices?: PendingInvoice[]
    supplierLocation?: string;
    voucherGST?: string;
    estimate?: number
    paidAmount?: number;
    TCS?: number;
    TDS?: number;
    calculateProductWise?: boolean
}

export class ProductDetailDto {
    type?: TypeEnum;
    productName: string;
    quantity: number;
    rate: number;
    totalCost: number;
    description?: string;
}

export class PendingInvoice {
    invoiceId: string;
    paidAmount: number;
    amount: number
    reminigAmount: number
}