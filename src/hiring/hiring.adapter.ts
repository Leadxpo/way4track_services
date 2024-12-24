import { Injectable } from '@nestjs/common';
import { HiringEntity } from './entity/hiring.entity';
import { HiringDto } from './dto/hiring.dto';

@Injectable()
export class HiringAdapter {
  convertDtoToEntity(dto: HiringDto): HiringEntity {
    const entity = new HiringEntity();
    entity.hiringLevel = dto.hiringLevel;
    entity.candidateName = dto.candidateName;
    entity.phoneNumber = dto.phoneNumber;
    entity.email = dto.email;
    entity.address = dto.address;
    entity.qualifications = dto.qualifications;
    entity.resumePath = dto.resumePath;
    entity.dateOfUpload = dto.dateOfUpload;
    entity.status = dto.status;
    entity.companyCode = dto.companyCode
    entity.unitCode = dto.unitCode

    return entity;
  }
}