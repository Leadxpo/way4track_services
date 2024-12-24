import { VendorDto } from './dto/vendor.dto';
import { VendorIdDto } from './dto/vendor-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { VendorAdapter } from './vendor.adapter';
import { VendorRepository } from './repo/vendor.repo';
export declare class VendorService {
    private readonly vendorAdapter;
    private readonly vendorRepository;
    constructor(vendorAdapter: VendorAdapter, vendorRepository: VendorRepository);
    private generateVendorId;
    updateVendorDetails(dto: VendorDto): Promise<CommonResponse>;
    createVendorDetails(dto: VendorDto): Promise<CommonResponse>;
    handleVendorDetails(dto: VendorDto): Promise<CommonResponse>;
    deleteVendorDetails(dto: VendorIdDto): Promise<CommonResponse>;
    getVendorDetails(req: VendorIdDto): Promise<CommonResponse>;
    getVendorNamesDropDown(): Promise<CommonResponse>;
    uploadVendorPhoto(vendorId: number, photo: Express.Multer.File): Promise<CommonResponse>;
}
