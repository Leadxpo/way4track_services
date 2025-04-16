import { BranchRepository } from 'src/branch/repo/branch.repo';
import { CommonResponse } from 'src/models/common-response';
import { DataSource } from 'typeorm';
import { ProductAssignIdDto } from './dto/product-assign-id.dto';
import { ProductAssignDto } from './dto/product-assign.dto';
import { ProductAssignAdapter } from './product-assign.adapter';
import { ProductAssignRepository } from './repo/product-assign.repo';
import { CommonReq } from 'src/models/common-req';
import { SubDealerRepository } from 'src/sub-dealer/repo/sub-dealer.repo';
export declare class ProductAssignService {
    private readonly productAssignRepository;
    private readonly productAssignAdapter;
    private readonly branchRepo;
    private dataSource;
    private subRepo;
    private storage;
    private bucketName;
    constructor(productAssignRepository: ProductAssignRepository, productAssignAdapter: ProductAssignAdapter, branchRepo: BranchRepository, dataSource: DataSource, subRepo: SubDealerRepository);
    assignProductsByImei(imeiNumberFrom: string, imeiNumberTo: string, branchId?: number, staffId?: number, numberOfProducts?: number, simNumberFrom?: string, simNumberTo?: string, subDealerId?: number): Promise<void>;
    saveProductAssign(dto: ProductAssignDto, photoPath: string | null): Promise<CommonResponse>;
    updateProductAssign(dto: ProductAssignDto, photoPath: string | null): Promise<CommonResponse>;
    handleProductDetails(dto: ProductAssignDto, photo?: Express.Multer.File): Promise<CommonResponse>;
    getProductAssign(dto: ProductAssignIdDto): Promise<CommonResponse>;
    getAllProductAssign(dto: CommonReq): Promise<CommonResponse>;
    deleteProductAssign(dto: ProductAssignIdDto): Promise<CommonResponse>;
}
