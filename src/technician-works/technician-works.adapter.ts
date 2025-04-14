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
import { VehicleTypeEntity } from 'src/vehicle-type/entity/vehicle-type.entity';
import { ServiceTypeEntity } from 'src/service-type/entity/service.entity';
import { SubDealerEntity } from 'src/sub-dealer/entity/sub-dealer.entity';
import { ProductTypeEntity } from 'src/product-type/entity/product-type.entity';

export class TechnicianWorksAdapter {
    // Convert DTO to Entity
    convertDtoToEntity(dto: TechnicianWorksDto): TechnicianWorksEntity {
        const entity = new TechnicianWorksEntity();
        entity.id = dto.id;
        entity.service = dto.service;
        entity.workStatus = dto.workStatus;
        entity.paymentStatus = dto.paymentStatus;
        entity.vehicleType = dto.vehicleType;
        entity.vehicleNumber = dto.vehicleNumber;
        entity.chassisNumber = dto.chassisNumber;
        entity.engineNumber = dto.engineNumber;
        entity.vehiclePhoto1 = dto.vehiclePhoto1;
        entity.vehiclePhoto5 = dto.vehiclePhoto5;
        entity.vehiclePhoto6 = dto.vehiclePhoto6;
        entity.vehiclePhoto7 = dto.vehiclePhoto7;
        entity.vehiclePhoto8 = dto.vehiclePhoto8;
        entity.vehiclePhoto9 = dto.vehiclePhoto9;
        entity.vehiclePhoto10 = dto.vehiclePhoto10;
        entity.vehiclePhoto2 = dto.vehiclePhoto2;
        entity.vehiclePhoto3 = dto.vehiclePhoto3;
        entity.vehiclePhoto4 = dto.vehiclePhoto4;
        entity.startDate = dto.startDate
        entity.endDate = dto.endDate;
        // Assign related entities by their IDs
        if (dto.staffId) {
            const staff = new StaffEntity();
            staff.id = dto.staffId;
            entity.staffId = staff;
        }

        if (dto.backEndStaffRelation) {
            const support = new StaffEntity();
            support.id = dto.backEndStaffRelation;
            entity.backEndStaffRelation = support;
        }

        if (dto.branchId) {
            const branch = new BranchEntity();
            branch.id = dto.branchId;
            entity.branchId = branch;
            entity.imeiNumber = dto.imeiNumber;
        }


        // const product = new ProductEntity();
        // product.imeiNumber = dto.imeiNumber;
        // entity.productId.id = product.id;

        if (dto.vendorId) {
            const vendor = new VendorEntity();
            vendor.id = dto.vendorId;
            entity.vendorId = vendor;
        }

        if (dto.vehicleId) {
            const vehicle = new VehicleTypeEntity();
            vehicle.id = dto.vehicleId;
            entity.vehicleId = vehicle;
        }

        if (dto.serviceId) {
            const service = new ServiceTypeEntity();
            service.id = dto.serviceId;
            entity.serviceId = service;
        }

        if (dto.clientId) {
            const client = new ClientEntity();
            client.id = dto.clientId;
            entity.clientId = client;
        }

        if (dto.voucherId) {
            const voucher = new VoucherEntity();
            voucher.id = dto.voucherId;
            entity.voucherId = voucher;
        }

        if (dto.workId) {
            const work = new WorkAllocationEntity();
            work.id = dto.workId;
            entity.workId = work;
        }

        if (dto.subDealerId) {
            const sub = new SubDealerEntity();
            sub.id = dto.subDealerId;
            entity.subDealerId = sub;
        }

        if (dto.applicationId) {
            const pt = new ProductTypeEntity();
            pt.id = dto.applicationId;
            entity.applicationId = pt;
        }

        // Directly assigning other properties
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        entity.productName = dto.productName;
        entity.screenShot = dto.screenShot
        entity.description = dto.description
        entity.technicianNumber = dto.technicianNumber
        entity.serviceOrProduct = dto.serviceOrProduct
        entity.name = dto.name
        entity.phoneNumber = dto.phoneNumber
        entity.simNumber = dto.simNumber
        entity.amount = dto.amount
        entity.address = dto.address
        entity.email = dto.email
        entity.remark = dto.remark
        entity.installationAddress = dto.installationAddress
        entity.acceptStartDate = dto.acceptStartDate
        entity.activateDate = dto.activateDate
        entity.pendingDate = dto.pendingDate
        entity.completedDate = dto.completedDate
        entity.userName = dto.userName

        entity.paidAmount = dto.paidAmount

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
            entity.description,
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
            entity.address ? entity.clientId.address : entity.address,
            entity.vehiclePhoto1 ? entity.vehiclePhoto1 : null,
            entity.vehiclePhoto2 ? entity.vehiclePhoto2 : null,
            entity.vehiclePhoto3 ? entity.vehiclePhoto3 : null,
            entity.vehiclePhoto4 ? entity.vehiclePhoto4 : null,
            entity.vehiclePhoto5 ? entity.vehiclePhoto5 : null,
            entity.vehiclePhoto6 ? entity.vehiclePhoto6 : null,
            entity.vehiclePhoto7 ? entity.vehiclePhoto7 : null,
            entity.vehiclePhoto8 ? entity.vehiclePhoto8 : null,
            entity.vehiclePhoto9 ? entity.vehiclePhoto9 : null,
            entity.vehiclePhoto10 ? entity.vehiclePhoto10 : null,
            entity.screenShot ? entity.screenShot : null,
            entity.startDate ? entity.startDate : null,
            entity.endDate ? entity.endDate : null,
            entity.backEndStaffRelation ? entity.backEndStaffRelation.id : null,
            entity.backEndStaffRelation ? entity.backEndStaffRelation.name : null,
            entity.serviceOrProduct ? entity.serviceOrProduct : "",
            entity.technicianNumber ? entity.technicianNumber : "",
            entity.email ? entity.email : "",
            entity.vehicleId ? entity.vehicleId.id : null,
            entity.serviceId ? entity.serviceId.id : null,
            entity.installationAddress ? entity.installationAddress : "",
            entity.remark ? entity.remark : [],
            entity.acceptStartDate ? entity.acceptStartDate : null,
            entity.activateDate ? entity.activateDate : null,
            entity.pendingDate ? entity.pendingDate : null,
            entity.completedDate ? entity.completedDate : null,
            entity.subDealerId ? entity.subDealerId.id : null,
            entity.userName ? entity.userName : "",
            entity.applicationId ? entity.applicationId.id : null,
            entity.paidAmount ? entity.paidAmount : null
            // entity.requirementDetails ? entity.requirementDetails : []

        );
    }
}
