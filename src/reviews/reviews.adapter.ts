import { ReviewDto } from "./dto/reviews.dto";
import { ReviewEntity } from "./entity/reviews-entity";


export class ReviewAdapter {
    toEntity(dto: ReviewDto): ReviewEntity {
        const entity = new ReviewEntity();
        if (dto.id) entity.id = dto.id;
        entity.review = dto.review;
        entity.rating = dto.rating;
        entity.reviewBy = dto.reviewBy;
        entity.companyName = dto.companyName;
        entity.adminReply = dto.adminReply
        if (dto.clientId) {
            entity.clientId = { id: dto.clientId } as any;
        }
        if (dto.orderId) {
            entity.orderId = { id: dto.orderId } as any;
        }
        if (dto.deviceId) {
            entity.deviceId = { id: dto.deviceId } as any;
        }
        return entity;
    }

    toDto(entity: ReviewEntity): ReviewDto {
        const dto = new ReviewDto();
        dto.id = entity.id;
        dto.review = entity.review;
        dto.rating = entity.rating;
        dto.reviewBy = entity.reviewBy;
        dto.companyName = entity.companyName;
        dto.clientId = entity.clientId.id
        dto.deviceId = entity.deviceId.id
        dto.orderId = entity.orderId.id
        return dto;
    }

    toDtoList(entities: ReviewEntity[]): ReviewDto[] {
        return entities.map(e => this.toDto(e));
    }
}
