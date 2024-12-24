import { CommonResponse } from 'src/models/common-response';
import { ProductRepository } from './repo/product.repo';
import { VendorRepository } from 'src/vendor/repo/vendor.repo';
import { VoucherRepository } from 'src/voucher/repo/voucher.repo';
export declare class ProductService {
    private readonly productRepository;
    private readonly vendorRepository;
    private readonly voucherRepository;
    constructor(productRepository: ProductRepository, vendorRepository: VendorRepository, voucherRepository: VoucherRepository);
    bulkUploadProducts(file: Express.Multer.File): Promise<CommonResponse>;
    uploadProductPhoto(productId: number, photo: Express.Multer.File): Promise<CommonResponse>;
}
