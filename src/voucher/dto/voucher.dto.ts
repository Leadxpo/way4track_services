
import { PaymentType } from "src/asserts/enum/payment-type.enum";
import { RoleEnum } from "../enum/role-enum";
import { VoucherTypeEnum } from "../enum/voucher-type-enum";
import { PaymentStatus } from "src/product/dto/payment-status.enum";
import { ProductType } from "src/product/dto/product-type.enum";
import { GSTORTDSEnum } from "../entity/voucher.entity";

export class VoucherDto {
    id?: number;
    name: string;
    quantity?: number;
    branchId: number;
    role: RoleEnum;
    purpose: string;
    creditAmount: number;
    amount?: number; // nullable if not always provided
    remainingAmount?: number; // Fixed the typo "reminingAmount"
    paymentType: PaymentType;
    clientId: number;
    staffId: number;
    accountNumber: number; // assuming this is the account number from the account entity
    voucherType: VoucherTypeEnum;
    generationDate?: Date;
    expireDate?: Date;
    shippingAddress?: string;
    buildingAddress?: string;
    hsnCode?: string;
    GSTORTDS?: GSTORTDSEnum;
    SCST?: number;
    CGST?: number;
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
    unitCode: string;
    voucherId?: string;
    fromAccount?: string
    toAccount?: string;
    createdAt?: Date;
    updatedAt?: Date;
    upiId?: string;
    checkNumber?: string;
    cardNumber?: string;
}
