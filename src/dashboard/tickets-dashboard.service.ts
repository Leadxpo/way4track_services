
import { Injectable } from "@nestjs/common";
import { CommonResponse } from "src/models/common-response";
import { TicketsRepository } from "src/tickets/repo/tickets.repo";

@Injectable()
export class TicketsDashboardService {

    constructor(
        private TicketsRepositort: TicketsRepository,
    ) { }
    async totalTickets(): Promise<CommonResponse> {
        const data = await this.TicketsRepositort.totalTickets()
        if (!data) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", data)
        }

    }
}