import { ProductAssignEntity } from 'src/product-assign/entity/product-assign.entity';
import { VendorEntity } from 'src/vendor/entity/vendor.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { BaseEntity } from 'typeorm';
export declare class ProductEntity extends BaseEntity {
    id: number;
    productName: string;
    productPhoto: string;
    emiNumber: string;
    dateOfPurchase: Date;
    imeiNumber: string;
    categoryName: string;
    price: number;
    productDescription: string;
    vendorId: VendorEntity;
    voucherId: VoucherEntity;
    productAssign: ProductAssignEntity[];
    companyCode: string;
    unitCode: string;
}
