import { ProductEntity } from 'src/product/entity/product.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
export declare class VendorEntity {
    id: number;
    name: string;
    vendorId: string;
    vendorPhoneNumber: string;
    alternatePhoneNumber?: string;
    productType: string;
    vendorPhoto: string;
    startingDate: Date;
    emailId: string;
    aadharNumber: string;
    address: string;
    product: ProductEntity[];
    voucherId: VoucherEntity;
    companyCode: string;
    unitCode: string;
}
