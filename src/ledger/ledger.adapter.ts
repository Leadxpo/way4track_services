import { ClientEntity } from "src/client/entity/client.entity";
import { LedgerDto } from "./dto/ledger.dto";
import { LedgerEntity, RegistrationType } from "./entity/ledger.entity";
import { SubDealerEntity } from "src/sub-dealer/entity/sub-dealer.entity";
import { VendorEntity } from "src/vendor/entity/vendor.entity";
import { GroupsEntity } from "src/groups/entity/groups.entity";
import { VoucherEntity } from "src/voucher/entity/voucher.entity";


export class LedgerAdapter {
    toEntity(dto: LedgerDto): LedgerEntity {
        const entity = new LedgerEntity();
        entity.name = dto.name;
        entity.state = dto.state;
        entity.country = dto.country;
        entity.panNumber = dto.panNumber || null;
        entity.registrationType = dto.registrationType;
        entity.gstUinNumber = dto.gstUinNumber || null;

        if (dto.clientId) {
            const client = new ClientEntity();
            client.clientId = dto.clientId;
            entity.clientId = client;
        }

        if (dto.subDealerId) {
            const subDealer = new SubDealerEntity();
            subDealer.id = dto.subDealerId;
            entity.subDealerId = subDealer;
        }

        if (dto.vendorId) {
            const vendor = new VendorEntity();
            vendor.id = dto.vendorId;
            entity.vendorId = vendor;
        }

        entity.group = dto.group || null;

        if (dto.groupId) {
            const group = new GroupsEntity();
            group.id = dto.groupId;
            entity.groupId = group;
        }
        entity.tcsDeductable = dto.tcsDeductable
        entity.tdsDeductable = dto.tdsDeductable
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;

        return entity;
    }

    toDto(entity: LedgerEntity): LedgerDto {
        return {
            id: entity.id,
            name: entity.name,
            state: entity.state,
            country: entity.country,
            panNumber: entity.panNumber || '',
            registrationType: entity.registrationType,
            gstUinNumber: entity.gstUinNumber || '',
            clientId: entity.clientId?.clientId || undefined,
            vendorId: entity.vendorId?.id || undefined,
            subDealerId: entity.subDealerId?.id || undefined,
            groupId: entity.groupId?.id || undefined,
            group: entity.group || '',
            tdsDeductable: entity.tdsDeductable || false,
            tcsDeductable: entity.tcsDeductable || false,
            companyCode: entity.companyCode,
            unitCode: entity.unitCode,
            vouchers: entity.voucher?.map(v => ({
                id: v.id,
                amount: v.amount,
                createdAt: v.createdAt.toISOString(),
                branchName: v.branchId.branchName,
                paymentType:v.paymentType,
                voucherType:v.voucherType,
            })) || []
        };
    }
}

