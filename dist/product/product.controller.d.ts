import { ProductService } from './product.service';
import { CommonResponse } from 'src/models/common-response';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    bulkUpload(file: Express.Multer.File): Promise<CommonResponse>;
    uploadPhoto(productId: number, photo: Express.Multer.File): Promise<CommonResponse>;
}
