
import { Injectable } from "@nestjs/common";
import { CommonResponse } from "src/models/common-response";
import { VendorDetail } from "src/vendor/dto/vendor-id.deatil";
import { VendorRepository } from "src/vendor/repo/vendor.repo";

@Injectable()
export class VendorDashboardService {

    constructor(
        private vendorRepository: VendorRepository,
    ) { }
    async getVendorData(): Promise<CommonResponse> {
        const VendorData = await this.vendorRepository.getvendorData()
        if (!VendorData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VendorData)
        }

    }

    async getDetailVendorData(req: VendorDetail): Promise<CommonResponse> {
        const VendorData = await this.vendorRepository.getDetailvendorData(req)
        if (!VendorData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VendorData)
        }

    }
}