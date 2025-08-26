import { Injectable } from '@nestjs/common';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { ClientResDto } from './dto/client-res.dto';
import { ClientDto } from './dto/client.dto';
import { ClientEntity } from './entity/client.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';


@Injectable()
export class ClientAdapter {
    convertDtoToEntity(dto: ClientDto): ClientEntity {
        const entity = new ClientEntity();
        entity.name = dto.name;
        entity.userName = dto.userName;
        entity.phoneNumber = dto.phoneNumber;
        const branchEntity = new BranchEntity();
        branchEntity.id = dto.branch;
        entity.branch = branchEntity;
        const staffEntity = new StaffEntity();
        staffEntity.id = dto.createdBy;
        entity.createdBy = staffEntity;
        entity.clientPhoto = dto.clientPhoto
        entity.email = dto.email;
        entity.address = dto.address;
        entity.state = dto.state;
        entity.companyCode = dto.companyCode
        entity.unitCode = dto.unitCode
        if (dto.id) {
            entity.id = dto.id;
        }
        entity.hsnCode = dto.hsnCode
        entity.SACCode = dto.SACCode
        if (dto.clientId) {
            entity.clientId = dto.clientId;

        }
        entity.tcs = dto.tcs
        entity.tds = dto.tds
        entity.status = dto.status
        entity.GSTNumber = dto.GSTNumber
        return entity;
    }


    convertEntityToDto(entity: ClientEntity[]): ClientResDto[] {
        return entity.map((client) => {
            return new ClientResDto(
                client.id,
                client.name,
                client.phoneNumber,
                client.clientId,
                client.userName,
                client.clientPhoto,
                client?.branch?.id,
                client?.branch?.branchName,
                client.email,
                client.address,
                client.state,
                client.companyCode,
                client.unitCode,
                client.status,
                client.GSTNumber,
                client.createdBy.id,
                client.createdBy.name
            );
        });
    }

}