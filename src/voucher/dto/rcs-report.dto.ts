import { RegistrationType } from "src/ledger/entity/ledger.entity";
import { VoucherTypeEnum } from "../enum/voucher-type-enum";

export class RcsReportDto {
    supplierName: string;
    registrationType: RegistrationType;
    voucherType: VoucherTypeEnum;
    amount: number;
    taxRate: number;
    rcsTax: number;
    startDate: Date;
     endDate: Date
}
