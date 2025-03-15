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
    convertEntityToDto(entity: AssertsEntity): GetAssertsResDto {
        return new GetAssertsResDto(
            entity.id,
            entity.branchId?.id || 0,
            entity.branchId?.branchName || '',
            entity.assertsName || '',
            entity.assertsAmount || 0,
            entity.assetType,
            entity.assertsAmount || 0,
            entity.quantity || 0,
            entity.description || '',
            entity.purchaseDate || new Date(),
            entity.assetPhoto || '',
            entity.voucherId?.id || null,
            entity.voucherId?.voucherId || '',
            entity.paymentType,
            entity.companyCode,
            entity.unitCode,
            // entity.emiNumber,
        );
    }
    async convertDtoToEntity(dto: AssertsDto): Promise<AssertsEntity> {
        const entity = new AssertsEntity();

        if (dto.voucherId) {
            const voucherEntity = await this.voucherRepository.findOne({ where: { id: Number(dto.voucherId) } });

            if (!voucherEntity) {
                throw new Error(`Voucher with ID ${dto.voucherId} not found`);
            }

            entity.voucherId = voucherEntity;
            entity.assertsName = dto.assertsName;
            entity.assetPhoto = dto.assetPhoto;
            entity.assertsAmount = dto.assertsAmount;
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

                entity.branchId = branchEntity; // ✅ Assign full entity instead of number
            }

            // if (voucherEntity.voucherType === VoucherTypeEnum.EMI) {
            //     entity.emiNumber = voucherEntity.emiNumber;
            // }
        } else {
            throw new Error('Voucher ID is required');
        }

        if (dto.id) {
            entity.id = dto.id;
        }

        return entity;
    }


}



