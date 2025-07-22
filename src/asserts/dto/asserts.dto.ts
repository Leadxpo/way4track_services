import { AssetType } from "../entity/asserts-entity";
import { PaymentType } from "../enum/payment-type.enum";

export class AssertsDto {
    id?: number;
    assetPhoto?: string;
    assertsName: string;
    assertsAmount: number;
    taxableAmount: number;
    purchaseDate: Date;
    paymentType: PaymentType;
    assetType: AssetType;
    branchId?: number;
    description?: string;
    companyCode: string;
    unitCode: string
    quantity: number
}
