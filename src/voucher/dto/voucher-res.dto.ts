import { PaymentType } from "src/asserts/enum/payment-type.enum";
import { RoleEnum } from "../enum/role-enum";
import { VoucherTypeEnum } from "../enum/voucher-type-enum";

export class VoucherResDto {
    id?: number;
    name: string;
    quantity: number;
    branchId: number;
    branchName: string;
    role: RoleEnum;
    purpose: string;
    creditAmount: number;
    paymentType: PaymentType;
    client: number;
    clientName: string;
    paymentTo: string;
    debitAmount: number;
    transferredBy: string;
    bankFrom: string;
    bankTo: string;
    voucherType: VoucherTypeEnum;
    generationDate?: Date;
    expireDate?: Date;
    shippingAddress?: string;
    buildingAddress?: string;
    ledgerAmount?: number;
    balanceAmount?: number;
    total?: number;
    hsnCode?: string;
    GST?: number;
    SCST?: number;
    CGST?: number;
    amount?: number;
    subDealerId?: number;
    subDealerName?: string;
    vendorId?: number;
    vendorName?: string;
    voucherId: string;
    companyCode: string;
    unitCode: string
    // New fields
    initialPayment?: number;      // Initial Payment
    emiCount?: number;            // Number of EMI installments
    emiNumber?: number;           // EMI number
    emiAmount?: number;           // EMI amount
    ifscCode?: string;            // IFSC code for bank transfer
    bankAccountNumber?: string;   // Bank account number for transactions
}
