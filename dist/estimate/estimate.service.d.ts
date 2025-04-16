import { ClientRepository } from 'src/client/repo/client.repo';
import { CommonResponse } from 'src/models/common-response';
import { ProductRepository } from 'src/product/repo/product.repo';
import { EstimateIdDto } from './dto/estimate-id.dto';
import { EstimateDto } from './dto/estimate.dto';
import { EstimateAdapter } from './estimate.adapter';
import { EstimateRepository } from './repo/estimate.repo';
import { CommonReq } from 'src/models/common-req';
import { DataSource } from 'typeorm';
export declare class EstimateService {
    private readonly estimateAdapter;
    private readonly estimateRepository;
    private readonly clientRepository;
    private readonly productRepository;
    private readonly dataSource;
    private storage;
    private bucketName;
    constructor(estimateAdapter: EstimateAdapter, estimateRepository: EstimateRepository, clientRepository: ClientRepository, productRepository: ProductRepository, dataSource: DataSource);
    updateEstimateDetails(dto: EstimateDto, estimatePdf?: string, invoicePath?: string): Promise<CommonResponse>;
    private handleFileUpload;
    private uploadFileToGCS;
    createEstimateDetails(dto: EstimateDto, estimatePdf: string | null, invoicePath?: string): Promise<CommonResponse>;
    uploadAndHandleEstimateDetails(dto: EstimateDto, files: {
        estimatePdf?: Express.Multer.File[];
        invoicePDF?: Express.Multer.File[];
    }): Promise<CommonResponse>;
    private getInvoiceCount;
    private generateInvoiceId;
    deleteEstimateDetails(dto: EstimateIdDto): Promise<CommonResponse>;
    getEstimateDetails(req: EstimateIdDto): Promise<CommonResponse>;
    getAllEstimateDetails(req: CommonReq): Promise<CommonResponse>;
}
