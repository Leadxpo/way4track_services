import { BranchEntity } from 'src/branch/entity/branch.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { PaymentType } from '../enum/payment-type.enum';
export declare enum AssetType {
    OFFICE_ASSET = "office asset",
    TRANSPORT_ASSET = "transport asset"
}
export declare class AssertsEntity {
    id: number;
    assertsName: string;
    assetPhoto: string;
    assertsAmount: number;
    assetType: AssetType;
    quantity: number;
    branchId: BranchEntity;
    description: string;
    purchaseDate: Date;
    voucherId: VoucherEntity;
    paymentType: PaymentType;
    initialPayment: number;
    numberOfEmi: number;
    emiNumber: number;
    emiAmount: number;
    companyCode: string;
    unitCode: string;
}
