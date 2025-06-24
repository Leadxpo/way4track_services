import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonResponse } from 'src/models/common-response';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { CommonReq } from 'src/models/common-req';
import { ErrorResponse } from 'src/models/error-response';
import { ReviewRepository } from './repo/reviews.repo';
import { ReviewDto } from './dto/reviews.dto';
import { ReviewEntity } from './entity/reviews-entity';
import { ReviewAdapter } from './reviews.adapter';

@Injectable()
export class ReviewService {
    constructor(
        private readonly repo: ReviewRepository,
        private readonly adapter: ReviewAdapter
    ) { }

    async handleReviewDetails(dto: ReviewDto): Promise<CommonResponse> {
        try {
            let entity: ReviewEntity;
            if (dto.id) {
                entity = await this.repo.findOne({ where: { id: dto.id } });
                if (!entity) return new CommonResponse(false, 404, 'Review not found');
                Object.assign(entity, this.adapter.toEntity(dto));
                await this.repo.save(entity);
                return new CommonResponse(true, 200, 'Review updated');
            } else {
                entity = this.adapter.toEntity(dto);
                await this.repo.save(entity);
                return new CommonResponse(true, 201, 'Review created');
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async deleteReviewDetails(dto: HiringIdDto): Promise<CommonResponse> {
        try {
            const existing = await this.repo.findOne({ where: { id: dto.id } });
            if (!existing) return new CommonResponse(false, 404, 'Review not found');
            await this.repo.delete({ id: dto.id });
            return new CommonResponse(true, 200, 'Review deleted');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getReviewDetails(): Promise<CommonResponse> {
        try {
            const data = await this.repo.find({relations:['clientId','deviceId','orderId']});
            return new CommonResponse(true, 200, 'Review list fetched', data);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getReviewDetailsById(dto: HiringIdDto): Promise<CommonResponse> {
        try {
            const entity = await this.repo.findOne({ where: { id: dto.id },relations:['clientId','deviceId','orderId'] });
            if (!entity) return new CommonResponse(false, 404, 'Review not found');
            return new CommonResponse(true, 200, 'Review fetched', this.adapter.toDto(entity));
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getReviewDropdown(): Promise<CommonResponse> {
        try {
            const data = await this.repo.find({ select: ['id', 'review'] });
            return new CommonResponse(true, 200, 'Dropdown fetched', data);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }
}
