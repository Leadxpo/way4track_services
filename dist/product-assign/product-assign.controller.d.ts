import { ProductAssignDto } from './dto/product-assign.dto';
import { CommonResponse } from 'src/models/common-response';
import { ProductAssignIdDto } from './dto/product-assign-id.dto';
import { ProductAssignService } from './product-assign.service';
import { ProductAssignEntity } from './entity/product-assign.entity';
export declare class ProductAssignController {
    private readonly productAssignService;
    constructor(productAssignService: ProductAssignService);
    saveProductAssign(dto: ProductAssignDto): Promise<CommonResponse>;
    deleteProductAssign(dto: ProductAssignIdDto): Promise<CommonResponse>;
    getProductAssign(req: ProductAssignIdDto): Promise<CommonResponse>;
    assignProduct(assignData: any): Promise<ProductAssignEntity>;
    markInHands(productAssignId: number, companyCode: string, unitCode: string): Promise<ProductAssignEntity>;
    uploadPhoto(productAssignId: number, photo: Express.Multer.File): Promise<CommonResponse>;
}
