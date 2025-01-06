import { Injectable } from '@nestjs/common';
import { WorkAllocationEntity } from './entity/work-allocation.entity';
import { WorkAllocationDto } from './dto/work-allocation.dto';
import { WorkAllocationResDto } from './dto/work-allocation-res.dto';
import { ClientEntity } from 'src/client/entity/client.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { VendorEntity } from 'src/vendor/entity/vendor.entity';

@Injectable()
export class WorkAllocationAdapter {
    convertDtoToEntity(dto: WorkAllocationDto): WorkAllocationEntity {
        const entity = new WorkAllocationEntity();

        if (dto.id) entity.id = dto.id;

        const client = new ClientEntity();
        client.id = dto.clientId;
        entity.clientId = client;

        const staff = new StaffEntity();
        staff.id = dto.staffId;
        entity.staffId = staff;

        entity.serviceOrProduct = dto.serviceOrProduct;
        entity.otherInformation = dto.otherInformation;
        entity.date = dto.date;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        entity.workAllocationNumber = dto.workAllocationNumber;
        entity.install = dto.install;

        const product = new ProductEntity();
        product.id = dto.productId;
        entity.productId = product;

        const vendor = new VendorEntity();
        vendor.id = dto.vendorId;
        entity.vendorId = vendor;

        return entity;
    }

    convertEntityToDto(entities: WorkAllocationEntity[]): WorkAllocationResDto[] {
        return entities.map((entity) => {
            const client = entity.clientId;
            const staff = entity.staffId;
            const product = entity.productId;
            const vendor = entity.vendorId;
            return new WorkAllocationResDto(
                entity.id,
                entity.workAllocationNumber,
                entity.serviceOrProduct,
                entity.otherInformation,
                entity.date,
                client?.id || 0,
                client?.name || '',
                client?.address || '',
                client?.phoneNumber || '',
                staff?.id || 0,
                staff?.name || '',
                entity.companyCode,
                entity.unitCode,
                product?.id || 0,
                product?.productName || '',
                product?.dateOfPurchase || null,
                product?.vendorId.id || null,
                product?.imeiNumber || '',
                product?.categoryName || '',
                product?.price || 0,
                product?.productDescription || '',
                product?.vendorPhoneNumber || '',
                product?.vendorName || '',
                product?.vendorAddress || '',
                product?.vendorEmailId || '',
                entity.install
            );
        });
    }
}
