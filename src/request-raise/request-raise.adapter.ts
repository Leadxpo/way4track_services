import { Injectable } from '@nestjs/common';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { RequestRaiseDto } from './dto/request-raise.dto';
import { RequestResDto } from './dto/request-res.dto';
import { RequestRaiseEntity } from './entity/request-raise.entity';
import { SubDealerEntity } from 'src/sub-dealer/entity/sub-dealer.entity';

@Injectable()
export class RequestRaiseAdapter {
    convertDtoToEntity(dto: RequestRaiseDto): RequestRaiseEntity {
        const entity = new RequestRaiseEntity();
        entity.requestType = dto.requestType; 
        entity.companyCode = dto.companyCode
        entity.unitCode = dto.unitCode
        const staffFrom = new StaffEntity();
        staffFrom.id = dto.requestFrom;
        entity.requestFrom = staffFrom;

        const staffTo = new StaffEntity();
        staffTo.id = dto.requestTo;
        entity.requestTo = staffTo;

        const branch = new BranchEntity();
        branch.id = dto.branch;
        entity.branchId = branch;

        const subDealer = new SubDealerEntity();
        subDealer.id = dto.subDealerId;
        entity.subDealerId = subDealer;

        entity.description = dto.description;
        entity.createdDate = dto.createdDate;
        entity.products = dto.products
        entity.requestFor = dto.requestFor
        entity.fromDate =dto.fromDate
        entity.toDate = dto.toDate
        entity.status = dto.status
        entity.image = dto.image
        if (dto.id) {
            entity.id = dto.id;
        }
        return entity;
    }
    convertEntityToResDto(entity: RequestRaiseEntity): RequestResDto {
        const { staffId, branchId, subDealerId, requestFrom, requestTo, ...rest } = entity;
        return new RequestResDto(
            entity.id,
            entity.requestType,
            requestTo.staffId,
            requestTo.name,
            requestFrom.name,
            entity.description,
            entity.createdDate,
            branchId.id,
            branchId.branchName,
            entity.status,
            entity.companyCode,
            entity.unitCode,
            entity.subDealerId.id,
            entity.subDealerId.name,
            entity.products,
            entity.requestFor,
            entity.reply,
            entity.fromDate,
            entity.toDate,
            entity.image
        );
    }
}
