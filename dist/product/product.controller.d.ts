import { ProductService } from './product.service';
import { CommonResponse } from 'src/models/common-response';
import { ProductDto } from './dto/product.dto';
import { ProductIdDto } from './dto/product.id.dto';
import { CommonReq } from 'src/models/common-req';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    bulkUpload(file: Express.Multer.File, productDto: ProductDto): Promise<CommonResponse>;
    deleteProductDetails(dto: ProductIdDto): Promise<CommonResponse>;
    getproductDetails(req: ProductIdDto): Promise<CommonResponse>;
    getAllproductDetails(req: CommonReq): Promise<CommonResponse>;
    getSearchDetailProduct(req: ProductIdDto): Promise<CommonResponse>;
    getProductNamesDropDown(): Promise<CommonResponse>;
    getDetailProduct(req: CommonReq): Promise<CommonResponse>;
    productAssignDetails(req: {
        branchName?: string;
        subDealerId?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
}
