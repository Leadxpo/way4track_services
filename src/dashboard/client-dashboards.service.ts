
import { Injectable } from "@nestjs/common";
import { ClientDetailDto } from "src/client/dto/detail.client.dto";
import { ClientRepository } from "src/client/repo/client.repo";
import { CommonReq } from "src/models/common-req";
import { CommonResponse } from "src/models/common-response";

@Injectable()
export class ClientDashboardService {

    constructor(
        private clientRepository: ClientRepository,
    ) { }
    async getClientData(req: CommonReq): Promise<CommonResponse> {
        const clientData = await this.clientRepository.getClientData(req)
        if (!clientData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", clientData)
        }

    }

    async getDetailClientData(req: ClientDetailDto): Promise<CommonResponse> {
        const clientData = await this.clientRepository.getDetailClientData(req)
        if (!clientData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", clientData)
        }

    }
}