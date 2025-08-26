import { AssetType } from "../entity/asserts-entity";
import { PaymentType } from "../enum/payment-type.enum";

export class GetAssertsResDto {
    id: number;
    branchId: number;
    createdBy: number;
    createdByName: string;
    branchName: string;
    assertsName: string;
    assertsAmount: number;
    assetType: AssetType;
    taxableAmount: number;
    quantity: number;
    description: string;
    purchaseDate: Date;
    assetPhoto: string;
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
        createdBy: number,
        createdByName: string,
        branchName: string,
        assertsName: string,
        assertsAmount: number,
        taxableAmount: number,
        assetType: AssetType,
        quantity: number,
        description: string,
        purchaseDate: Date,
        assetPhoto: string,
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
        this.createdBy = createdBy;
        this.createdByName = createdByName;
        this.branchName = branchName;
        this.assertsName = assertsName;
        this.assertsAmount = assertsAmount;
        this.assetType = assetType;
        this.taxableAmount = taxableAmount;
        this.quantity = quantity;
        this.description = description;
        this.purchaseDate = purchaseDate;
        this.assetPhoto = assetPhoto;
        this.paymentType = paymentType;
        this.initialPayment = initialPayment;
        this.numberOfEmi = numberOfEmi;
        this.emiNumber = emiNumber;
        this.emiAmount = emiAmount;
        this.companyCode = companyCode
        this.unitCode = unitCode
    }
}
