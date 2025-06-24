
import { PaymentType } from "src/asserts/enum/payment-type.enum";
import { RegistrationType } from "../entity/ledger.entity";
import { VoucherTypeEnum } from "src/voucher/enum/voucher-type-enum";
import { BranchEntity } from "src/branch/entity/branch.entity";


export class LedgerDto {
    id?: number
    name: string;
    state: string;
    country: string
    panNumber?: string;
    registrationType: RegistrationType;
    gstUinNumber?: string;
    clientId?: string
    vendorId?: number
    subDealerId?: number
    groupId?: number
    group: string
    tdsDeductable?: boolean;
    tcsDeductable: boolean;
    companyCode: string;
    unitCode: string;
    vouchers?: VoucherDto[]; 
}

export interface VoucherDto {
    id: number;
    amount: number;
    createdAt: string;
    branchName: BranchEntity;
    paymentType: PaymentType;
    voucherType: VoucherTypeEnum;

}
