import { Injectable } from "@nestjs/common";
import { BranchEntity } from "./entity/branch.entity";
import { BranchDto } from "./dto/branch.dto";
@Injectable()
export class BranchAdapter {
    convertBranchDtoToEntity(dto: BranchDto): BranchEntity {
        const entity = new BranchEntity();
        entity.branchName = dto.branchName;
        entity.branchNumber = dto.branchNumber;
        entity.branchAddress = dto.branchAddress;
        entity.addressLine1 = dto.addressLine1;
        entity.addressLine2 = dto.addressLine2;
        entity.city = dto.city;
        entity.state = dto.state;
        entity.pincode = dto.pincode;
        entity.branchOpening = dto.branchOpening;
        entity.email = dto.email;
        entity.branchPhoto = dto.branchPhoto;
        entity.companyCode = dto.companyCode
        entity.unitCode = dto.unitCode;
        entity.latitude = dto.latitude;
        entity.longitude = dto.longitude;
        // entity.phoneNumber = dto.phoneNumber
        if (entity.id) {
            entity.id = dto.id;
        }
        return entity;
    }
}