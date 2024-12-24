import { Body, Controller, Post } from '@nestjs/common';
import { EstimateDto } from './dto/estimate.dto';
import { CommonResponse } from 'src/models/common-response';
import { EstimateService } from './estimate.service';
import { EstimateIdDto } from './dto/estimate-id.dto';

@Controller('estimate')
export class EstimateController {
    constructor(private readonly estimateService: EstimateService) { }

    @Post('handleEstimateDetails')
    async handleEstimateDetails(@Body() dto: EstimateDto): Promise<CommonResponse> {
        try {
            return await this.estimateService.handleEstimateDetails(dto);
        } catch (error) {
            console.error('Error in save estimate details in service:', error);
            return new CommonResponse(false, 500, 'Error saving estimate details');
        }
    }

    @Post('deleteEstimateDetails')
    async deleteEstimateDetails(@Body() dto: EstimateIdDto): Promise<CommonResponse> {
        try {
            return await this.estimateService.deleteEstimateDetails(dto);
        } catch (error) {
            console.error('Error in delete estimate details in service:', error);
            return new CommonResponse(false, 500, 'Error deleting estimate details');
        }
    }

    @Post('getEstimateDetails')
    async getEstimateDetails(@Body() req: EstimateIdDto): Promise<CommonResponse> {
        try {
            return await this.estimateService.getEstimateDetails(req);
        } catch (error) {
            console.error('Error in get estimate details in service:', error);
            return new CommonResponse(false, 500, 'Error fetching estimate details');
        }
    }
}
