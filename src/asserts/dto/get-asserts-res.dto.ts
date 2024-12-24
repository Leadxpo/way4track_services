import { AssetType } from "../entity/asserts-entity";
import { PaymentType } from "../enum/payment-type.enum";

export class GetAssertsResDto {
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
    unitCode: string
    constructor(
        id: number,
        branchId: number,
        branchName: string,
        assertsName: string,
        assertsAmount: number,
        assetType: AssetType,
        price: number,
        quantity: number,
        description: string,
        purchaseDate: Date,
        assetPhoto: string,
        voucherEntity: number,
        voucherId: string,
        paymentType: PaymentType,
        companyCode: string,
        unitCode: string,
        initialPayment?: number,
        numberOfEmi?: number,
        emiNumber?: number,
        emiAmount?: number,

    ) {
        this.id = id;
        this.branchId = branchId;
        this.branchName = branchName;
        this.assertsName = assertsName;
        this.assertsAmount = assertsAmount;
        this.assetType = assetType;
        this.price = price;
        this.quantity = quantity;
        this.description = description;
        this.purchaseDate = purchaseDate;
        this.assetPhoto = assetPhoto;
        this.voucherId = voucherId;
        this.voucherId = voucherId;
        this.paymentType = paymentType;
        this.initialPayment = initialPayment;
        this.numberOfEmi = numberOfEmi;
        this.emiNumber = emiNumber;
        this.emiAmount = emiAmount;
        this.companyCode = companyCode
        this.unitCode = unitCode
    }
}
