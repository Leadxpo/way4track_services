import { Injectable } from '@nestjs/common';
import { VendorDto } from './dto/vendor.dto';
import { VendorEntity } from './entity/vendor.entity';
import { VendorResDto } from './dto/vendor-res.dto';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';


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
        const voucher = new VoucherEntity()
        voucher.id = dto.voucherId
        entity.voucherId = voucher;
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
                voucherId
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
                voucherId?.id,
                voucherId?.name ?? ''
            );
        });
    }


}