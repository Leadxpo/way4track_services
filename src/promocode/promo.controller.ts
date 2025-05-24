import { Controller, Post, Body } from '@nestjs/common';
import { PromocodeDto } from './dto/promo.dto';
import { CommonResponse } from 'src/models/common-response';
import { PromocodeService } from './promo.services';

@Controller('promocode')
export class PromocodeController {
    constructor(private readonly promocodeService: PromocodeService) { }

    @Post('handlePromocodeDetails')
    async handlePromocodeDetails(@Body() dto: PromocodeDto): Promise<CommonResponse> {
        try {
            if (dto.id) {
                dto.id = Number(dto.id);
            }
            return await this.promocodeService.handlePromocodeDetails(dto);
        } catch (error) {
            console.error('Error in save ticket details in service:', error);
            return new CommonResponse(false, 500, 'Error saving ticket details');
        }
    }

    @Post('deletePromocodeDetails')
    async deletePromocodeDetails(@Body() dto: {id:number;companyCode: string;unitCode: string}): Promise<CommonResponse> {
        try {
            return await this.promocodeService.deletePromocodeDetails(dto);
        } catch (error) {
            console.error('Error in delete ticket details in service:', error);
            return new CommonResponse(false, 500, 'Error deleting ticket details');
        }
    }

    @Post('getPromocodeDetailsById')
    async getPromocodeDetailsById(@Body() dto: {id:number;companyCode: string;unitCode: string}): Promise<CommonResponse> {
        try {
            return await this.promocodeService.getPromocodeDetailsById(dto);
        } catch (error) {
            console.error('Error in get ticket details in service:', error);
            return new CommonResponse(false, 500, 'Error fetching ticket details');
        }
    }

    @Post('getPromocodeDetails')
    async getPromocodeDetails(@Body() req: { promocode?: string; companyCode: string; unitCode: string }) {
        try {
            return this.promocodeService.getPromocodeDetails(req);
        } catch (error) {
            console.error('Error in delete vendor details:', error);
            return new CommonResponse(false, 500, 'Error deleting vendor details');
        }
    }
}
