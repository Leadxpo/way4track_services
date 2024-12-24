import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
export declare class SubDealerEntity {
    id: number;
    name: string;
    subDealerPhoto: string;
    subDealerId: string;
    password: string;
    subDealerPhoneNumber: string;
    alternatePhoneNumber?: string;
    gstNumber: string;
    startingDate: Date;
    emailId: string;
    aadharNumber: string;
    address: string;
    voucherId: VoucherEntity;
    companyCode: string;
    unitCode: string;
}
