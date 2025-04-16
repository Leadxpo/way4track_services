import { VendorDto } from './dto/vendor.dto';
import { VendorIdDto } from './dto/vendor-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { VendorAdapter } from './vendor.adapter';
import { VendorRepository } from './repo/vendor.repo';
import { CommonReq } from 'src/models/common-req';
export declare class VendorService {
    private readonly vendorAdapter;
    private readonly vendorRepository;
    private storage;
    private bucketName;
    constructor(vendorAdapter: VendorAdapter, vendorRepository: VendorRepository);
    private generateVendorId;
    updateVendorDetails(dto: VendorDto, filePath: string | null): Promise<CommonResponse>;
    createVendorDetails(dto: VendorDto, filePath: string | null): Promise<CommonResponse>;
    handleVendorDetails(dto: VendorDto, photo?: Express.Multer.File): Promise<CommonResponse>;
    deleteVendorDetails(dto: VendorIdDto): Promise<CommonResponse>;
    getVendorDetailsById(req: VendorIdDto): Promise<CommonResponse>;
    getVendorDetails(req: CommonReq): Promise<CommonResponse>;
    getVendorNamesDropDown(): Promise<CommonResponse>;
}
