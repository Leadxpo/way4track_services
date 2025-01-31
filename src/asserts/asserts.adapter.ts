import { Injectable } from "@nestjs/common";
import { BranchEntity } from "src/branch/entity/branch.entity";
import { VoucherRepository } from "src/voucher/repo/voucher.repo";
import { AssertsDto } from "./dto/asserts.dto";
import { GetAssertsResDto } from "./dto/get-asserts-res.dto";
import { AssertsEntity } from "./entity/asserts-entity";
import { PaymentType } from "./enum/payment-type.enum";
import { VoucherTypeEnum } from "src/voucher/enum/voucher-type-enum";


@Injectable()
export class AssertsAdapter {
    constructor(
        private readonly voucherRepository: VoucherRepository,
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
            entity.emiNumber,
        );
    }
    async convertDtoToEntity(dto: AssertsDto): Promise<AssertsEntity> {
        const entity = new AssertsEntity();

        if (dto.voucherId) {
            const voucherEntity = await this.voucherRepository.findOne({ where: { voucherId: dto.voucherId } });

            if (!voucherEntity) {
                throw new Error(`Voucher with ID ${dto.voucherId} not found`);
            }

            entity.voucherId = voucherEntity;
            entity.assertsName = voucherEntity.name;
            entity.assetPhoto = dto.assetPhoto;
            entity.assertsAmount = voucherEntity.amount;
            entity.assetType = dto.assetType;
            entity.quantity = voucherEntity.quantity;
            entity.description = dto.description
            entity.purchaseDate = voucherEntity.generationDate;
            entity.paymentType = voucherEntity.paymentType;
            entity.companyCode = dto.companyCode;
            entity.unitCode = dto.unitCode;


            if (dto.branchId) {
                const branchEntity = new BranchEntity();
                branchEntity.id = dto.branchId;
                entity.branchId = branchEntity;
            }

            if (voucherEntity.voucherType === VoucherTypeEnum.EMI) {
                entity.emiNumber = voucherEntity.emiNumber;
            }
        } else {
            throw new Error('Voucher ID is required');
        }


        if (dto.id) {
            entity.id = dto.id;
        }

        return entity;
    }

}



