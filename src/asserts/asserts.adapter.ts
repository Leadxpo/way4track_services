import { Injectable } from "@nestjs/common";
import { BranchEntity } from "src/branch/entity/branch.entity";
import { VoucherRepository } from "src/voucher/repo/voucher.repo";
import { AssertsDto } from "./dto/asserts.dto";
import { GetAssertsResDto } from "./dto/get-asserts-res.dto";
import { AssertsEntity } from "./entity/asserts-entity";
import { PaymentType } from "./enum/payment-type.enum";
import { VoucherTypeEnum } from "src/voucher/enum/voucher-type-enum";
import { BranchRepository } from "src/branch/repo/branch.repo";

@Injectable()
export class AssertsAdapter {
    constructor(
        private readonly voucherRepository: VoucherRepository,
        private readonly branchRepository: BranchRepository
    ) { }
    // Adapter
    convertEntityToDto(entity: AssertsEntity): GetAssertsResDto {
        return new GetAssertsResDto(
            entity.id,
            entity.branchId?.id || 0,
            entity.createdBy?.id || null,
            entity.createdBy?.name || '',
            entity.branchId?.branchName || '',
            entity.assertsName || '',
            entity.assertsAmount || 0,
            entity.taxableAmount || 0,
            entity.assetType,
            entity.quantity || 0,
            entity.description || '',
            entity.purchaseDate ?? new Date(),  // Fallback to current date if null/undefined
            entity.assetPhoto || '',
            entity.paymentType,
            entity.companyCode || '',
            entity.unitCode || '',
        );
    }
    async convertDtoToEntity(dto: AssertsDto): Promise<AssertsEntity> {
        const entity = new AssertsEntity()
        entity.assertsName = dto.assertsName;
        entity.createdBy.id,
        entity.createdBy.name,
        entity.assetPhoto = dto.assetPhoto;
        entity.assertsAmount = dto.assertsAmount;
        entity.taxableAmount = dto.taxableAmount;
        entity.assetType = dto.assetType;
        entity.quantity = dto.quantity;
        entity.description = dto.description;
        entity.purchaseDate = dto.purchaseDate;
        entity.paymentType = dto.paymentType;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;

        if (dto.branchId) {
            const branchEntity = await this.branchRepository.findOne({ where: { id: dto.branchId } });

            if (!branchEntity) {
                throw new Error(`Branch with ID ${dto.branchId} not found`);
            }

            entity.branchId = branchEntity;
        }

        if (dto.id) {
            entity.id = dto.id;
        }

        return entity;
    }


}



