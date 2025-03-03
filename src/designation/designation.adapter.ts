import { CreateDesignationDto } from "./dto/designation.dto";
import { DesignationEntity } from "./entity/designation.entity";

export class DesignationAdapter {
  
    convertDtoToEntity(dto: CreateDesignationDto): DesignationEntity {
      const entity = new DesignationEntity();
      entity.companyCode = dto.companyCode;
      entity.unitCode = dto.unitCode;
      entity.designation = dto.designation;
      entity.roles = dto.roles;
      
      if (dto.id) {
          entity.id = dto.id;
      }
  
      return entity;
  }
  

}