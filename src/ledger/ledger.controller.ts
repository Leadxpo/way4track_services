import { Body, Controller, Post } from '@nestjs/common';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { CommonReq } from 'src/models/common-req';
import { CommonResponse } from 'src/models/common-response';
import { LedgerService } from './ledger .service';
import { LedgerDto } from './dto/ledger.dto';

@Controller('ledger')
export class LedgerController {
    constructor(private readonly ledgerService: LedgerService) { }

    @Post('handleLedgerDetails')
    async handleLedgerDetails(@Body() dto: LedgerDto) {
        try {
            if (dto.id) {
                dto.id = Number(dto.id);
            }
            return this.ledgerService.handleLedgerDetails(dto);

        } catch (error) {
            console.error('Error in save vendor details:', error);
            return new CommonResponse(false, 500, 'Error saving vendor details');
        }
    }

    @Post('getLedgerDetails')
    async getLedgerDetails() {
        try {
            return this.ledgerService.getLedger();
        } catch (error) {
            console.error('Error in get vendor details:', error);
            return new CommonResponse(false, 500, 'Error fetching vendor details');
        }
    }

    @Post('getLedgerDetailsById')
    async getLedgerDetailsById(@Body() dto: LedgerDto) {
        try {
            return this.ledgerService.getLedgerDetailsById(dto);
        } catch (error) {
            console.error('Error in get vendor details:', error);
            return new CommonResponse(false, 500, 'Error fetching vendor details');
        }
    }


    @Post('updateStatus')
    async updateStatus(@Body() dto: LedgerDto): Promise<CommonResponse> {
        return this.ledgerService.updateStatus(dto);
    }

    @Post('getLedgerDataTable')
    async getLedgerDataTable(@Body() req: {
        group?: string;
        ledgerName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<CommonResponse> {
        try {
            return await this.ledgerService.getLedgerDataTable(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }
}
