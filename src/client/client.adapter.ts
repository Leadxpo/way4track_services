import { Injectable } from '@nestjs/common';
import { ClientEntity } from './entity/client.entity';
import { ClientDto } from './dto/client.dto';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { ClientResDto } from './dto/client-res.dto';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';


@Injectable()
export class ClientAdapter {
    convertDtoToEntity(dto: ClientDto): ClientEntity {
        const entity = new ClientEntity();
        entity.name = dto.name;
        entity.phoneNumber = dto.phoneNumber;
        const branchEntity = new BranchEntity();
        branchEntity.id = dto.branchId;
        entity.branch = branchEntity;
        entity.clientPhoto = dto.clientPhoto
        entity.dob = dto.dob;
        entity.email = dto.email;
        entity.address = dto.address;
        entity.joiningDate = dto.joiningDate;
        entity.companyCode = dto.companyCode
        entity.unitCode = dto.unitCode
        // entity.status = dto.status
        if (dto.id) {
            entity.id = dto.id;
        }

        if (dto.clientId) {
            entity.clientId = dto.clientId;
        }
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
                client.dob,
                client.email,
                client.address,
                client.joiningDate,
                client.companyCode,
                client.unitCode
            );
        });
    }

}