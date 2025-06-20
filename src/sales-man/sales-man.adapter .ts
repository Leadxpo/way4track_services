
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { LeadStatusEnum, SalesWorksEntity } from './entity/sales-man.entity';
import { SalesWorksDto } from './dto/sales-man.dto';

export class SalesWorksAdapter {
    convertEntityToDto(entity: SalesWorksEntity): SalesWorksDto {
        return {
            id: entity.id,
            visitingCard: entity.visitingCard,
            clientPhoto: entity.clientPhoto,
            date: entity.date,
            estimateDate: entity.estimateDate,
            staffId: entity.staffId?.id,
            allocateStaffId: entity.allocateStaffId?.id,
            companyCode: entity.companyCode,
            unitCode: entity.unitCode,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            paidDate: entity.paidDate,
            paidAmount: entity.paidAmount,
            name: entity.name,
            phoneNumber: entity.phoneNumber,
            address: entity.address,
            requirementDetails:entity.requirementDetails?.map(requirementDetail => ({
                productName: requirementDetail.productName,
                quantity: requirementDetail.quantity,
            })) ?? [],
            service: entity.service?.map(services => ({
                services: services.services,
                description: services.description,
            })) ?? [],
            leadStatus:entity.leadStatus,
            visitingNumber: entity.visitingNumber
        };
    }

    convertDtoToEntity(dto: SalesWorksDto): SalesWorksEntity {
        const entity = new SalesWorksEntity();
    
        entity.id = dto.id;
        entity.visitingCard = dto.visitingCard;
        entity.clientPhoto = dto.clientPhoto;
        entity.date = dto.date;
        entity.estimateDate = dto.estimateDate;
    
        if (dto.staffId) {
            entity.staffId = new StaffEntity();
            // ✅ Correctly assign primary key (assumed to be `id`, not `staffId`)
            entity.staffId.id = dto.staffId; // convert to number if necessary
        }
    
        if (dto.allocateStaffId) {
            entity.allocateStaffId = new StaffEntity();
            // ✅ Correctly assign primary key (assumed to be `id`, not `staffId`)
            entity.allocateStaffId.id = dto.allocateStaffId; // convert to number if necessary
        }
    
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        entity.createdAt = dto.createdAt;
        entity.updatedAt = dto.updatedAt;
        entity.paidDate = dto.paidDate;
        entity.paidAmount = dto.paidAmount;
        entity.name = dto.name;
        entity.phoneNumber = dto.phoneNumber;
        entity.address = dto.address;
        entity.requirementDetails = dto.requirementDetails;
        entity.service = dto.service;
        entity.leadStatus=dto.leadStatus
        entity.visitingNumber = dto.visitingNumber;
    
        return entity;
    }}
