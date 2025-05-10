import { StaffEntity } from "src/staff/entity/staff.entity";
import { DispatchDto } from "./dto/dispatch.dto";
import { DispatchResponseDto } from "./dto/dispatch.res.dto";
import { DispatchEntity } from "./entity/dispatch.entity";
import { ClientEntity } from "src/client/entity/client.entity";
import { SubDealerEntity } from "src/sub-dealer/entity/sub-dealer.entity";
import { ProductAssignEntity } from "src/product-assign/entity/product-assign.entity";


export class DispatchAdapter {

    convertEntityToDto(entity: DispatchEntity | DispatchEntity[]): DispatchResponseDto | DispatchResponseDto[] {
        if (Array.isArray(entity)) {
            return entity.map(item => this.convertEntityToDto(item) as DispatchResponseDto);
        }

        return {
            id: entity.id,
            companyCode: entity.companyCode,
            unitCode: entity.unitCode,
            fromAddress: entity.fromAddress,
            toAddress: entity.toAddress,
            dispatchCompanyName: entity.dispatchCompanyName,
            dispatchDate: entity.dispatchDate?.toISOString(),
            arrivalDate: entity.arrivalDate?.toISOString(),
            status: entity.status,
            transportId: entity.transportId,
            packageId: entity.packageId,
            assignedProductsId: entity.assignedProductsId ? entity.assignedProductsId.id : null, // ✅ Safe check
            receiverName: entity.receiverName,
            dispatcherName: entity.dispatcherName,
            trackingURL: entity.trackingURL,
            staffId: entity.staffId?.staffId || null,
            staffName: entity.staffId?.name || null,
            clientId: entity.clientId?.clientId || null,
            clientName: entity.clientId?.name || null,
            subDealerId: entity.subDealerId?.subDealerId || null,
            subDealerName: entity.subDealerId?.name || null,
            dispatchBoximage: entity.dispatchBoximage || ""
        };
    }


    convertDtoToEntity(dto: DispatchDto): DispatchEntity {
        const entity = new DispatchEntity();

        if (dto.id) {
            entity.id = dto.id;
        }
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        entity.fromAddress = dto.fromAddress;
        entity.toAddress = dto.toAddress;
        entity.dispatchCompanyName = dto.dispatchCompanyName;
        entity.dispatchDate = dto.dispatchDate;
        entity.arrivalDate = dto.arrivalDate;
        entity.status = dto.status;
        entity.transportId = dto.transportId;
        entity.packageId = dto.packageId;

        entity.receiverName = dto.receiverName;
        entity.dispatcherName = dto.dispatcherName;
        entity.trackingURL = dto.trackingURL;
        const staff = new StaffEntity()
        staff.staffId = dto.staffId
        entity.staffId = staff
        const client = new ClientEntity()
        client.clientId = dto.clientId
        entity.clientId = client
        const sub = new SubDealerEntity()
        sub.subDealerId = dto.subDealerId
        entity.subDealerId = sub
        if (dto.assignedProductsId) {
            const product = new ProductAssignEntity()
            product.id = dto.assignedProductsId
            entity.assignedProductsId = product
        }

        entity.dispatchBoximage = dto.dispatchBoximage

        return entity;
    }
}
