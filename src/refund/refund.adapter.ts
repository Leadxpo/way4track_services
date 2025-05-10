import { CreateRefundDto } from "./dto/refund.dto";
import { RefundEntity } from "./entity/refund.entity";


export class RefundAdapter {
     toEntity(dto: CreateRefundDto): RefundEntity {
        const entity = new RefundEntity();
        entity.name = dto.name;
        entity.productName = dto.productName;
        entity.phoneNumber = dto.phoneNumber;
        entity.dateOfRequest = dto.dateOfRequest;
        entity.dateOfReplace = dto.dateOfReplace;
        entity.damageImage = dto.damageImage;
        entity.refundStatus = dto.refundStatus ?? undefined;
        entity.description = dto.description;

        if (dto.clientId) {
            entity.clientId = { id: dto.clientId } as any;
        }
        if (dto.orderId) {
            entity.order = { id: dto.orderId } as any;
        }

        return entity;
    }

     toResponseDto(entity: RefundEntity): CreateRefundDto {
        return {
            id: entity.id,
            name: entity.name,
            productName: entity.productName,
            phoneNumber: entity.phoneNumber,
            dateOfRequest: entity.dateOfRequest,
            dateOfReplace: entity.dateOfReplace,
            damageImage: entity.damageImage,
            refundStatus: entity.refundStatus,
            description: entity.description,
            clientId: entity.clientId?.id,
            orderId: entity.order?.id,
        };
    }
}
