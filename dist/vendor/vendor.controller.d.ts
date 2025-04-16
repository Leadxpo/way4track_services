import { VendorService } from './vendor.service';
import { VendorDto } from './dto/vendor.dto';
import { VendorIdDto } from './dto/vendor-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { CommonReq } from 'src/models/common-req';
export declare class VendorController {
    private readonly vendorService;
    constructor(vendorService: VendorService);
    handleVendorDetails(dto: VendorDto, photo?: Express.Multer.File): Promise<CommonResponse>;
    deleteVendorDetails(dto: VendorIdDto): Promise<CommonResponse>;
    getVendorDetailsById(req: VendorIdDto): Promise<CommonResponse>;
    getVendorDetails(req: CommonReq): Promise<CommonResponse>;
    getVendorNamesDropDown(): Promise<CommonResponse>;
}
