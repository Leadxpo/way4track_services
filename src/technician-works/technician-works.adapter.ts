import { StaffEntity } from 'src/staff/entity/staff.entity';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { VendorEntity } from 'src/vendor/entity/vendor.entity';
import { ClientEntity } from 'src/client/entity/client.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { WorkAllocationEntity } from 'src/work-allocation/entity/work-allocation.entity';
import { TechnicianWorksDto } from 'src/technician-works/dto/technician-works.dto';
import { TechnicianWorksEntity } from 'src/technician-works/entity/technician-works.entity';
import { TechnicianWorksResponseDto } from './dto/technician-res.dto';

export class TechnicianWorksAdapter {
    // Convert DTO to Entity
    convertDtoToEntity(dto: TechnicianWorksDto): TechnicianWorksEntity {
        const entity = new TechnicianWorksEntity();
        entity.id = dto.id;
        entity.service = dto.service;
        entity.workStatus = dto.workStatus;
        entity.paymentStatus = dto.paymentStatus;
        entity.imeiNumber = dto.imeiNumber;
        entity.vehicleType = dto.vehicleType;
        entity.vehicleNumber = dto.vehicleNumber;
        entity.chassisNumber = dto.chassisNumber;
        entity.engineNumber = dto.engineNumber;
        entity.vehiclePhoto1 = dto.vehiclePhoto1;
        entity.vehiclePhoto2 = dto.vehiclePhoto2;
        entity.vehiclePhoto3 = dto.vehiclePhoto3;
        entity.vehiclePhoto4 = dto.vehiclePhoto4;


        entity.date = dto.date;

        // Assign related entities by their IDs
        const staff = new StaffEntity();
        staff.id = dto.staffId;
        entity.staffId = staff;

        const branch = new BranchEntity();
        branch.id = dto.branchId;
        entity.branchId = branch;

        const product = new ProductEntity();
        product.id = dto.productId;
        entity.productId = product;

        const vendor = new VendorEntity();
        vendor.id = dto.vendorId;
        entity.vendorId = vendor;

        const client = new ClientEntity();
        client.id = dto.clientId;
        entity.clientId = client;

        const voucher = new VoucherEntity();
        voucher.id = dto.voucherId;
        entity.voucherId = voucher;

        const work = new WorkAllocationEntity();
        work.id = dto.workId;
        entity.workId = work;

        // Directly assigning other properties
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        entity.productName = dto.productName;

        return entity;
    }

    convertEntityToDto(entity: TechnicianWorksEntity): TechnicianWorksResponseDto {
        return new TechnicianWorksResponseDto(
            entity.id,
            entity.service,
            entity.workStatus,
            entity.paymentStatus,
            entity.imeiNumber,
            entity.vehicleType,
            entity.vehicleNumber,
            entity.chassisNumber,
            entity.engineNumber,
            entity.vehiclePhoto1,
            entity.description,
            entity.date,
            entity.staffId ? entity.staffId.id : null,
            entity.branchId ? entity.branchId.id : null,
            entity.productId ? entity.productId.id : null,
            entity.vendorId ? entity.vendorId.id : null,
            entity.clientId ? entity.clientId.id : null,
            entity.voucherId ? entity.voucherId.id : null,
            entity.workId ? entity.workId.id : null,
            entity.companyCode,
            entity.unitCode,
            entity.productName ?? "",
            entity.name ? entity.clientId.name : entity.name,
            entity.phoneNumber ? entity.clientId.phoneNumber : entity.phoneNumber,
            entity.simNumber ?? "",
            entity.address ? entity.clientId.address : entity.address
        );
    }
}
