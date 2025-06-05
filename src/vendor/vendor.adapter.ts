import { Injectable } from '@nestjs/common';
import { VendorDto } from './dto/vendor.dto';
import { VendorEntity } from './entity/vendor.entity';
import { VendorResDto } from './dto/vendor-res.dto';
// import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { BranchEntity } from 'src/branch/entity/branch.entity';


@Injectable()
export class VendorAdapter {
    convertDtoToEntity(dto: VendorDto): VendorEntity {
        const entity = new VendorEntity();
        if (dto.id) entity.id = dto.id;
        entity.name = dto.name;
        entity.vendorPhoneNumber = dto.vendorPhoneNumber;
        entity.alternatePhoneNumber = dto.alternatePhoneNumber;
        entity.emailId = dto.emailId;
        entity.state = dto.state;
        entity.GSTNumber = dto.GSTNumber;
        entity.bankDetails = dto.bankDetails;
        entity.address = dto.address;
        entity.companyCode = dto.companyCode
        entity.unitCode = dto.unitCode
        entity.vendorPhoto = dto.vendorPhoto
        const branch = new BranchEntity()
        branch.id = dto.branchId
        entity.branch = branch;
        return entity;
    }

    convertEntityToDto(entity: VendorEntity[]): VendorResDto[] {
        return entity.map((vendor) => {
            const {
                id,
                name,
                vendorPhoneNumber,
                alternatePhoneNumber,
                emailId,
                state,
                bankDetails,
                GSTNumber,
                address,
                companyCode,
                unitCode,
                vendorPhoto,
            } = vendor;

            return new VendorResDto(
                id,
                name,
                vendorPhoneNumber,
                alternatePhoneNumber,
                emailId,
                state,
                bankDetails,
                GSTNumber,
                address,
                companyCode,
                unitCode,
                vendorPhoto,
                vendor.branch?.id,
                vendor.branch?.branchName
            );
        });
    }


}