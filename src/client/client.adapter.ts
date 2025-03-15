import { Injectable } from '@nestjs/common';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { ClientResDto } from './dto/client-res.dto';
import { ClientDto } from './dto/client.dto';
import { ClientEntity } from './entity/client.entity';


@Injectable()
export class ClientAdapter {
    convertDtoToEntity(dto: ClientDto): ClientEntity {
        const entity = new ClientEntity();
        entity.name = dto.name;
        entity.phoneNumber = dto.phoneNumber;
        const branchEntity = new BranchEntity();
        branchEntity.id = dto.branch;
        entity.branch = branchEntity;
        entity.clientPhoto = dto.clientPhoto
        // entity.dob = dto.dob;
        entity.email = dto.email;
        entity.address = dto.address;
        // entity.joiningDate = dto.joiningDate;
        entity.companyCode = dto.companyCode
        entity.unitCode = dto.unitCode
        // if (entity.dob) {
        //     entity.dob = new Date(entity.dob).toISOString().split('T')[0];
        // }
        if (entity.joiningDate) {
            entity.joiningDate = new Date(entity.joiningDate).toISOString().split('T')[0];
        }

        // entity.status = dto.status
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
        entity.billWiseDate = dto.billWiseDate
        return entity;
    }

    convertEntityToDto(entity: ClientEntity[]): ClientResDto[] {
        return entity.map((client) => {
            return new ClientResDto(
                client.id,
                client.name,
                client.phoneNumber,
                client.clientId,
                client.clientPhoto,
                client?.branch?.id,
                client?.branch?.branchName,
                // client.dob,
                client.email,
                client.address,
                client.joiningDate,
                client.companyCode,
                client.unitCode
            );
        });
    }

}