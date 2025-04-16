import { VoucherTypeEnum } from '../enum/voucher-type-enum';
import { PaymentType } from 'src/asserts/enum/payment-type.enum';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { PaymentStatus } from 'src/product/dto/payment-status.enum';
import { ProductType } from 'src/product/dto/product-type.enum';
import { ClientEntity } from 'src/client/entity/client.entity';
import { VendorEntity } from 'src/vendor/entity/vendor.entity';
import { AssertsEntity } from 'src/asserts/entity/asserts-entity';
import { SubDealerEntity } from 'src/sub-dealer/entity/sub-dealer.entity';
import { AccountEntity } from 'src/account/entity/account.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { EstimateEntity } from 'src/estimate/entity/estimate.entity';
import { WorkAllocationEntity } from 'src/work-allocation/entity/work-allocation.entity';
import { AppointmentEntity } from 'src/appointment/entity/appointement.entity';
import { TechnicianWorksEntity } from 'src/technician-works/entity/technician-works.entity';
import { LedgerEntity } from 'src/ledger/entity/ledger.entity';
export declare enum DebitORCreditEnum {
    Debit = "Debit",
    Credit = "Credit"
}
export declare enum TypeEnum {
    Rectifications = "Rectifications",
    Renewables = "Renewables",
    Replacements = "Replacements",
    Product_Sales = "ProductSales",
    Service_Sales = "ServiceSales",
    Others = "Others"
}
export declare class VoucherEntity {
    id: number;
    name: string;
    quantity: number;
    upiId: string;
    checkNumber: string;
    cardNumber: string;
    fromAccount: AccountEntity;
    toAccount: AccountEntity;
    voucherId: string;
    technician: TechnicianWorksEntity[];
    branchId: BranchEntity;
    ledgerId: LedgerEntity;
    companyCode: string;
    unitCode: string;
    purpose: string;
    paymentType: PaymentType;
    voucherType: VoucherTypeEnum;
    generationDate: Date;
    dueDate: Date;
    expireDate: Date;
    shippingAddress: string;
    supplierLocation: string;
    buildingAddress: string;
    hsnCode: string;
    journalType: DebitORCreditEnum;
    SGST: number;
    CGST: number;
    voucherGST: string;
    IGST: number;
    TDS: number;
    TCS: number;
    amount: number;
    creditAmount: number;
    reminigAmount: number;
    product: ProductEntity;
    paymentStatus: PaymentStatus;
    productType: ProductType;
    vendorId: VendorEntity;
    clientId: ClientEntity;
    staffId: StaffEntity;
    paymentTo: StaffEntity;
    assert: AssertsEntity[];
    appointments: AppointmentEntity[];
    workAllocation: WorkAllocationEntity[];
    subDealer: SubDealerEntity;
    createdAt: Date;
    updatedAt: Date;
    invoiceId: string;
    estimate: EstimateEntity;
    paidAmount: number;
    productDetails: {
        type?: TypeEnum;
        productName: string;
        quantity: number;
        rate: number;
        totalCost: number;
        description?: string;
    }[];
    pendingInvoices: {
        invoiceId: string;
        paidAmount: number;
        amount: number;
        reminigAmount: number;
    }[];
}
