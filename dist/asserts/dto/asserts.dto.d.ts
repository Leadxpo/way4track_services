import { AssetType } from "../entity/asserts-entity";
import { PaymentType } from "../enum/payment-type.enum";
export declare class AssertsDto {
    id?: number;
    assertsName: string;
    assetPhoto?: string;
    assertsAmount: number;
    assetType: AssetType;
    quantity: number;
    branchId?: number;
    description?: string;
    purchaseDate: Date;
    voucherId?: number;
    paymentType: PaymentType;
    initialPayment?: number;
    numberOfEmi?: number;
    emiNumber?: number;
    emiAmount?: number;
    companyCode: string;
    unitCode: string;
}
