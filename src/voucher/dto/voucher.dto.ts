import { PaymentType } from "src/asserts/enum/payment-type.enum";
import { RoleEnum } from "../enum/role-enum";
import { VoucherTypeEnum } from "../enum/voucher-type-enum";
import { PaymentStatus } from "src/product/dto/payment-status.enum";
import { ProductType } from "src/product/dto/product-type.enum";

export class VoucherDto {
    id?: number;
    name: string;
    quantity: number;
    branchId: number;
    role: RoleEnum;
    purpose: string;
    creditAmount: number;
    paymentType: PaymentType;
    client?: number;
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
    vendorId?: number;
    initialPayment?: number;
    numberOfEmi?: number;
    emiNumber?: number;
    emiAmount?: number;
    ifscCode?: string;
    bankAccountNumber?: string;
    paymentStatus?: PaymentStatus;
    productType?: ProductType;
    companyCode: string;
    unitCode: string
    voucherId?: string
}
