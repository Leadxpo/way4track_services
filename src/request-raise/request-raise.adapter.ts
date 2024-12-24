import { Injectable } from '@nestjs/common';
import { RequestRaiseDto } from './dto/request-raise.dto';
import { RequestResDto } from './dto/request-res.dto';
import { RequestRaiseEntity } from './entity/request-raise.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { ClientEntity } from 'src/client/entity/client.entity';

@Injectable()
export class RequestRaiseAdapter {
    convertDtoToEntity(dto: RequestRaiseDto): RequestRaiseEntity {
        const entity = new RequestRaiseEntity();
        entity.requestType = dto.requestType;
        entity.companyCode = dto.companyCode
        entity.unitCode = dto.unitCode
        const staff = new StaffEntity();
        staff.id = dto.staffID;
        entity.staffId = staff;
        const branch = new BranchEntity();
        branch.id = dto.branchId;
        entity.branchId = branch;

        const client = new ClientEntity();
        client.id = dto.clientID;
        entity.clientID = client;

        entity.description = dto.description;
        entity.createdDate = dto.createdDate;
        if (dto.id) {
            entity.id = dto.id;
        }
        return entity;
    }
    convertEntityToResDto(entity: RequestRaiseEntity): RequestResDto {
        const { staffId, branchId, clientID, ...rest } = entity;
        return new RequestResDto(
            entity.id,
            entity.requestType,
            staffId.id,
            clientID.name,
            staffId.name,
            entity.description,
            entity.createdDate,
            branchId.id,
            branchId.branchName,
            entity.status,
            entity.companyCode,
            entity.unitCode
        );
    }
}
