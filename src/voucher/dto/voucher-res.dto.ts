import { PaymentType } from "src/asserts/enum/payment-type.enum";
import { RoleEnum } from "../enum/role-enum";
import { VoucherTypeEnum } from "../enum/voucher-type-enum";
import { PaymentStatus } from "src/product/dto/payment-status.enum";
import { ProductType } from "src/product/dto/product-type.enum";
import { DebitORCreditEnum } from "../entity/voucher.entity";
import { ProductDetailDto } from "./voucher.dto";

export class VoucherResDto {
    id: number;
    name: string;
    quantity?: number;
    branchId: number;
    branchName: string;
    supplierLocation:string;
    purpose: string;
    creditAmount: number;
    paymentType: PaymentType;
    clientId: string;
    clientName: string;
    ledgerId: number;
    ledgerName: string;
    staffId: string;
    staffName: string;
    toAccountId: number
    toAccount: string;
    fromAccountId: number;
    fromAccount: string;
    voucherType: VoucherTypeEnum;
    generationDate?: Date;
    expireDate?: Date;
    shippingAddress?: string;
    buildingAddress?: string;
    remainingAmount?: number;
    hsnCode?: string;
    GSTORTDS?: DebitORCreditEnum;
    SCST?: number;
    CGST?: number;
    amount?: number;
    subDealerId?: number;
    subDealerName?: string;
    vendorId?: number;
    vendorName?: string;
    voucherId: string;
    companyCode: string;
    unitCode: string;
    paymentStatus: PaymentStatus;
    productType: ProductType;
    product?: number
    productName?: string
    upiId?: string;
    checkNumber?: string;
    cardNumber?: string;
    // initialPayment?: number;
    // emiCount?: number;
    // emiNumber?: number;
    invoice?: number
    invoiceId?: string
    paymentTo?: string
    receiptPdfUrl?: string
    // products?: {
    //     name: string; quantity: number; amount: number
    // }[];
    dueDate: Date;
    productDetails?: ProductDetailDto[];
    constructor(
        id: number,
        name: string,
        branchId: number,
        branchName: string,
        supplierLocation:string,
        purpose: string,
        creditAmount: number,
        paymentType: PaymentType,
        clientId: string,
        clientName: string,
        ledgerId: number,
        ledgerName: string,
        staffId: string,
        staffName: string,
        toAccount: string,
        fromAccount: string,
        voucherType: VoucherTypeEnum,
        voucherId: string,
        companyCode: string,
        unitCode: string,
        paymentStatus: PaymentStatus,
        productType: ProductType,
        vendorId: number,
        vendorName: string,
        quantity?: number,
        generationDate?: Date,
        expireDate?: Date,
        shippingAddress?: string,
        buildingAddress?: string,
        remainingAmount?: number,
        hsnCode?: string,
        GSTORTDS?: DebitORCreditEnum,
        SCST?: number,
        CGST?: number,
        amount?: number,
        subDealerId?: number,
        subDealerName?: string,
        upiId?: string,
        checkNumber?: string,
        cardNumber?: string,
        // initialPayment?: number,
        // emiCount?: number,
        // emiNumber?: number,
        fromAccountId?: number,
        toAccountId?: number,
        product?: number,
        productName?: string,
        invoice?: number,
        invoiceId?: string,
        paymentTo?: string,
        receiptPdfUrl?: string,
        // products?: {
        //     name: string; quantity: number; amount: number
        // }[],
        dueDate?: Date,
        productDetails?: ProductDetailDto[]

    ) {
        this.id = id;
        this.name = name;
        this.branchId = branchId;
        this.branchName = branchName;
        this.supplierLocation = supplierLocation;
        this.purpose = purpose;
        this.creditAmount = creditAmount;
        this.paymentType = paymentType;
        this.clientId = clientId;
        this.clientName = clientName;
        this.ledgerId = ledgerId;
        this.ledgerName = ledgerName;
        this.staffId = staffId;
        this.staffName = staffName;
        this.toAccount = toAccount;
        this.fromAccount = fromAccount;
        this.voucherType = voucherType;
        this.voucherId = voucherId;
        this.companyCode = companyCode;
        this.unitCode = unitCode;
        this.paymentStatus = paymentStatus;
        this.productType = productType;
        this.vendorId = vendorId;
        this.vendorName = vendorName;
        this.quantity = quantity ?? 0;
        this.generationDate = generationDate ?? null;
        this.expireDate = expireDate ?? null;
        this.shippingAddress = shippingAddress ?? "";
        this.buildingAddress = buildingAddress ?? "";
        this.remainingAmount = remainingAmount ?? 0;
        this.hsnCode = hsnCode ?? "";
        this.GSTORTDS = GSTORTDS ?? null;
        this.SCST = SCST ?? 0;
        this.CGST = CGST ?? 0;
        this.amount = amount ?? 0;
        this.subDealerId = subDealerId ?? null;
        this.subDealerName = subDealerName ?? "";
        this.upiId = upiId ?? "";
        this.checkNumber = checkNumber ?? "";
        this.cardNumber = cardNumber ?? "";
        // this.initialPayment = initialPayment ?? 0;
        // this.emiCount = emiCount ?? 0;
        // this.emiNumber = emiNumber ?? 0;
        this.toAccountId = toAccountId
        this.fromAccountId = fromAccountId
        this.product = product
        this.productName = productName
        this.invoice = invoice;
        this.invoiceId = invoiceId;
        this.paymentTo = paymentTo
        this.receiptPdfUrl = receiptPdfUrl
        this.dueDate = dueDate
        this.productDetails = productDetails
    }
}
