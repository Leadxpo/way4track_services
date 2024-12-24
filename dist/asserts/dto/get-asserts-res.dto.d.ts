import { AssetType } from "../entity/asserts-entity";
import { PaymentType } from "../enum/payment-type.enum";
export declare class GetAssertsResDto {
    id: number;
    branchId: number;
    branchName: string;
    assertsName: string;
    assertsAmount: number;
    assetType: AssetType;
    price: number;
    quantity: number;
    description: string;
    purchaseDate: Date;
    assetPhoto: string;
    voucherEntity: number;
    voucherId: string;
    paymentType: PaymentType;
    initialPayment?: number;
    numberOfEmi?: number;
    emiNumber?: number;
    emiAmount?: number;
    companyCode: string;
    unitCode: string;
    constructor(id: number, branchId: number, branchName: string, assertsName: string, assertsAmount: number, assetType: AssetType, price: number, quantity: number, description: string, purchaseDate: Date, assetPhoto: string, voucherEntity: number, voucherId: string, paymentType: PaymentType, companyCode: string, unitCode: string, initialPayment?: number, numberOfEmi?: number, emiNumber?: number, emiAmount?: number);
}
