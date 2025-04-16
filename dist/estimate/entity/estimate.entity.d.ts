import { ClientEntity } from "src/client/entity/client.entity";
import { ClientStatusEnum } from "src/client/enum/client-status.enum";
import { ProductEntity } from "src/product/entity/product.entity";
import { VendorEntity } from "src/vendor/entity/vendor.entity";
import { VoucherEntity } from "src/voucher/entity/voucher.entity";
import { WorkAllocationEntity } from "src/work-allocation/entity/work-allocation.entity";
import { BaseEntity } from "typeorm";
export declare enum GSTORTDSEnum {
    GST = "GST",
    TDS = "TDS"
}
export declare class EstimateEntity extends BaseEntity {
    id: number;
    clientId: ClientEntity;
    vendorId: VendorEntity;
    buildingAddress: string;
    estimateDate: Date;
    estimateId: string;
    invoiceId: string;
    expireDate: string;
    productOrService: string;
    description: string;
    amount: number;
    quantity: number;
    products: ProductEntity[];
    invoice: VoucherEntity[];
    work: WorkAllocationEntity[];
    workId: WorkAllocationEntity[];
    productDetails: {
        type?: string;
        productId?: number;
        productName: string;
        quantity: number;
        costPerUnit: number;
        totalCost: number;
        hsnCode: string;
    }[];
    companyCode: string;
    unitCode: string;
    GSTORTDS: GSTORTDSEnum;
    status: ClientStatusEnum;
    SCST: number;
    CGST: number;
    estimatePdfUrl: string;
    invoicePdfUrl: string;
    receiptPdfUrl: string;
}
