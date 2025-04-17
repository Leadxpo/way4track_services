import { Body, Controller, Post } from '@nestjs/common';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { CommonReq } from 'src/models/common-req';
import { CommonResponse } from 'src/models/common-response';
import { ReviewService } from './reviews.service';
import { ReviewDto } from './dto/reviews.dto';

@Controller('review')
export class ReviewController {
    constructor(private readonly service: ReviewService) { }

    @Post('handleReviewDetails')
    async handleReviewDetails(@Body() dto: ReviewDto): Promise<CommonResponse> {
        try {
            if (dto.id) {
                dto.id = Number(dto.id);
            }
            return await this.service.handleReviewDetails(dto);
        } catch (error) {
            console.error('Error saving review details:', error);
            return new CommonResponse(false, 500, 'Error saving review details');
        }
    }

    @Post('deleteReviewDetails')
    async deleteReviewDetails(@Body() dto: HiringIdDto): Promise<CommonResponse> {
        try {
            return await this.service.deleteReviewDetails(dto);
        } catch (error) {
            console.error('Error deleting review details:', error);
            return new CommonResponse(false, 500, 'Error deleting review details');
        }
    }

    @Post('getReviewDetails')
    async getReviewDetails(): Promise<CommonResponse> {
        try {
            return await this.service.getReviewDetails();
        } catch (error) {
            console.error('Error fetching review details:', error);
            return new CommonResponse(false, 500, 'Error fetching review details');
        }
    }

    @Post('getReviewDetailsById')
    async getReviewDetailsById(@Body() dto: HiringIdDto): Promise<CommonResponse> {
        try {
            return await this.service.getReviewDetailsById(dto);
        } catch (error) {
            console.error('Error fetching review details by ID:', error);
            return new CommonResponse(false, 500, 'Error fetching review details by ID');
        }
    }

    @Post('getReviewDropdown')
    async getReviewDropdown(): Promise<CommonResponse> {
        try {
            return await this.service.getReviewDropdown();
        } catch (error) {
            console.error('Error fetching review dropdown:', error);
            return new CommonResponse(false, 500, 'Error fetching review dropdown');
        }
    }
}
