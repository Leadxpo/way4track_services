import { AssetType } from "../entity/asserts-entity";

export class AssertsDto {
    id?: number;
    voucherId: string;
    assertsName?: string;
    assetPhoto?: string;
    assertsAmount?: number;
    assetType?: AssetType;
    quantity: number;
    branchId?: number;
    description?: string;
    purchaseDate: Date;
    initialPayment?: number;
    numberOfEmi?: number;
    emiAmount?: number;
    paymentType?: string;
}
