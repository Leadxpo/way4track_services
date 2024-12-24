import { VendorService } from './vendor.service';
import { VendorDto } from './dto/vendor.dto';
import { VendorIdDto } from './dto/vendor-id.dto';
import { CommonResponse } from 'src/models/common-response';
export declare class VendorController {
    private readonly vendorService;
    constructor(vendorService: VendorService);
    handleVendorDetails(dto: VendorDto): Promise<CommonResponse>;
    deleteVendorDetails(dto: VendorIdDto): Promise<CommonResponse>;
    getVendorDetails(req: VendorIdDto): Promise<CommonResponse>;
    getVendorNamesDropDown(): Promise<CommonResponse>;
    uploadPhoto(vendorId: number, photo: Express.Multer.File): Promise<CommonResponse>;
}
