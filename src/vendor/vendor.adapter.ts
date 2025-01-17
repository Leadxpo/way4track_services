import { Injectable } from '@nestjs/common';
import { VendorDto } from './dto/vendor.dto';
import { VendorEntity } from './entity/vendor.entity';
import { VendorResDto } from './dto/vendor-res.dto';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { BranchEntity } from 'src/branch/entity/branch.entity';


@Injectable()
export class VendorAdapter {
    convertDtoToEntity(dto: VendorDto): VendorEntity {
        const entity = new VendorEntity();
        if (dto.id) entity.id = dto.id;
        entity.name = dto.name;
        entity.vendorPhoneNumber = dto.vendorPhoneNumber;
        entity.alternatePhoneNumber = dto.alternatePhoneNumber;
        entity.productType = dto.productType;
        entity.startingDate = dto.startingDate;
        entity.emailId = dto.emailId;
        entity.aadharNumber = dto.aadharNumber;
        entity.address = dto.address;
        entity.companyCode = dto.companyCode
        entity.unitCode = dto.unitCode
        entity.vendorPhoto = dto.vendorPhoto
        // const voucher = new VoucherEntity()
        // voucher.id = dto.voucherId
        // entity.voucherId = voucher;
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
                productType,
                startingDate,
                emailId,
                aadharNumber,
                address,
                voucherId,
                companyCode,
                unitCode,
                vendorPhoto,
            } = vendor;

            return new VendorResDto(
                id,
                name,
                vendorPhoneNumber,
                alternatePhoneNumber,
                productType,
                startingDate,
                emailId,
                aadharNumber,
                address,
                // voucherId?.id,
                // voucherId?.name ?? '',
                companyCode,
                unitCode,
                vendorPhoto,
                vendor.branch?.id,
                vendor.branch?.branchName
            );
        });
    }


}