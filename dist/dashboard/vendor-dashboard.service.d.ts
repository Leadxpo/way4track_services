import { CommonResponse } from "src/models/common-response";
import { VendorDetail } from "src/vendor/dto/vendor-id.deatil";
import { VendorRepository } from "src/vendor/repo/vendor.repo";
export declare class VendorDashboardService {
    private vendorRepository;
    constructor(vendorRepository: VendorRepository);
    getVendorData(req: {
        fromDate?: Date;
        toDate?: Date;
        paymentStatus?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse>;
    getDetailVendorData(req: VendorDetail): Promise<CommonResponse>;
}
