import { ProductAssignDto } from './dto/product-assign.dto';
import { CommonResponse } from 'src/models/common-response';
import { ProductAssignAdapter } from './product-assign.adapter';
import { ProductAssignRepository } from './repo/product-assign.repo';
import { ProductAssignIdDto } from './dto/product-assign-id.dto';
import { ProductAssignEntity } from './entity/product-assign.entity';
export declare class ProductAssignService {
    private readonly productAssignRepository;
    private readonly productAssignAdapter;
    constructor(productAssignRepository: ProductAssignRepository, productAssignAdapter: ProductAssignAdapter);
    saveProductAssign(dto: ProductAssignDto): Promise<CommonResponse>;
    getProductAssign(dto: ProductAssignIdDto): Promise<CommonResponse>;
    deleteProductAssign(dto: ProductAssignIdDto): Promise<CommonResponse>;
    assignProduct(assignData: any): Promise<ProductAssignEntity>;
    markInHands(productAssignId: number, companyCode: string, unitCode: string): Promise<ProductAssignEntity>;
    uploadproductAssignPhoto(productAssignId: number, photo: Express.Multer.File): Promise<CommonResponse>;
}
