
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { SalesWorksEntity } from './entity/sales-man.entity';
import { SalesWorksDto } from './dto/sales-man.dto';

export class SalesWorksAdapter {
    convertEntityToDto(entity: SalesWorksEntity): SalesWorksDto {
        return {
            id: entity.id,
            visitingCard: entity.visitingCard,
            clientPhoto: entity.clientPhoto,
            date: entity.date,
            estimateDate: entity.estimateDate,
            staffId: entity.staffId?.staffId?.toString(),
            companyCode: entity.companyCode,
            unitCode: entity.unitCode,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            name: entity.name,
            phoneNumber: entity.phoneNumber,
            address: entity.address,
            requirementDetails: entity.requirementDetails,
            service: entity.service,
            visitingNumber: entity.visitingNumber
        };
    }

    convertDtoToEntity(dto: SalesWorksDto): SalesWorksEntity {
        const entity = new SalesWorksEntity();
        if (entity.id) {
            entity.id = dto.id;
        }
        entity.id = dto.id;
        entity.visitingCard = dto.visitingCard;
        entity.clientPhoto = dto.clientPhoto;
        entity.date = dto.date;
        entity.estimateDate = dto.estimateDate;

        if (dto.staffId) {
            entity.staffId = new StaffEntity();
            entity.staffId.staffId = dto.staffId;
        }

        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        entity.createdAt = dto.createdAt;
        entity.updatedAt = dto.updatedAt;
        entity.name = dto.name;
        entity.phoneNumber = dto.phoneNumber;
        entity.address = dto.address;
        entity.requirementDetails = dto.requirementDetails;
        entity.service = dto.service
        entity.visitingNumber = dto.visitingNumber
        return entity;
    }
}
