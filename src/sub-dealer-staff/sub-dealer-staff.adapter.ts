import { CreateSubDealerStaffDto } from "./dto/sub-dealer-staff.dto";
import { SubDealerStaffResponseDto } from "./dto/sub-dealer-staff.res.dto";
import { SubDelaerStaffEntity } from "./entity/sub-dealer-staff.entity";

export class SubDealerStaffAdapter {
    toEntity(dto: CreateSubDealerStaffDto): SubDelaerStaffEntity {
        const entity = new SubDelaerStaffEntity();
        entity.name = dto.name;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        entity.description = dto.description;
        entity.gender = dto.gender;
        entity.dob = dto.dob;
        entity.email = dto.email;
        entity.phoneNumber = dto.phoneNumber;
        entity.alternateNumber = dto.alternateNumber;
        entity.staffId = dto.staffId;
        entity.password = dto.password;
        entity.aadharNumber = dto.aadharNumber;
        entity.panCardNumber = dto.panCardNumber;
        entity.address = dto.address;
        return entity;
    }

    toResponseDto(entity: SubDelaerStaffEntity): SubDealerStaffResponseDto {
        return new SubDealerStaffResponseDto({
          id: entity.id,
          name: entity.name,
          companyCode: entity.companyCode,
          unitCode: entity.unitCode,
          description: entity.description,
          gender: entity.gender,
          dob: entity.dob,
          email: entity.email,
          phoneNumber: entity.phoneNumber,
          alternateNumber: entity.alternateNumber,
          staffId: entity.staffId,
          aadharNumber: entity.aadharNumber,
          panCardNumber: entity.panCardNumber,
          address: entity.address,
          createdAt: entity.createdAt,
          updatedAt: entity.updatedAt,
        });
      }
      
      // Optional helper to map arrays
      toResponseDtoList(entities: SubDelaerStaffEntity[]): SubDealerStaffResponseDto[] {
        return entities.map((entity) => this.toResponseDto(entity));
      }
      
}
