import { AssetType } from "../entity/asserts-entity";
import { PaymentType } from "../enum/payment-type.enum";

export class AssertsDto {
    id?: number;
    assetPhoto?: string;
    assetType: AssetType;
    branchId?: number;
    description?: string;
    voucherId: number;
    companyCode: string;
    unitCode: string
    quantity: number
}
