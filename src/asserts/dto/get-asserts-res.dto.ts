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
    paymentType: PaymentType;
    cardNumber: string;
    amount: number;
    priceTotal: number;
    initialPayment: number;
    numberOfEmi: number;
    emiAmount: number;
    startingMonth: string;
    endingMonth: string;
    checkNumber: string;
    bank: string;
    bankName: string;
    branchBank: string;
    ifscCode: string;
    bankAccountNumber: string;
    upiId: string;
    assetPhoto: string;
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
        paymentType: PaymentType,
        cardNumber: string,
        amount: number,
        priceTotal: number,
        initialPayment: number,
        numberOfEmi: number,
        emiAmount: number,
        startingMonth: string,
        endingMonth: string,
        checkNumber: string,
        bank: string,
        bankName: string,
        branchBank: string,
        ifscCode: string,
        bankAccountNumber: string,
        upiId: string,
        assetPhoto: string
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
        this.paymentType = paymentType;
        this.cardNumber = cardNumber;
        this.amount = amount;
        this.priceTotal = priceTotal;
        this.initialPayment = initialPayment;
        this.numberOfEmi = numberOfEmi;
        this.emiAmount = emiAmount;
        this.startingMonth = startingMonth;
        this.endingMonth = endingMonth;
        this.checkNumber = checkNumber;
        this.bank = bank;
        this.bankName = bankName;
        this.branchBank = branchBank;
        this.ifscCode = ifscCode;
        this.bankAccountNumber = bankAccountNumber;
        this.upiId = upiId;
        this.assetPhoto = assetPhoto;
    }
}
