import { Injectable } from "@nestjs/common";
import { AssertsEntity } from "./entity/asserts-entity";
import { GetAssertsResDto } from "./dto/get-asserts-res.dto";
import { VoucherEntity } from "src/voucher/entity/voucher.entity";
import { AssertsDto } from "./dto/asserts.dto";
import { BranchEntity } from "src/branch/entity/branch.entity";


@Injectable()
export class AssertsAdapter {
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
            entity.initialPayment,
            entity.numberOfEmi,
            entity.emiNumber,
            entity.emiAmount
        );
    }
    convertDtoToEntity(dto: AssertsDto): AssertsEntity {
        const entity = new AssertsEntity();

        entity.assertsName = dto.assertsName;
        entity.assetPhoto = dto.assetPhoto;
        entity.assertsAmount = dto.assertsAmount;
        entity.assetType = dto.assetType;
        entity.quantity = dto.quantity;
        entity.description = dto.description;
        entity.purchaseDate = dto.purchaseDate;
        entity.paymentType = dto.paymentType;
        entity.companyCode=dto.companyCode;
        entity.unitCode=dto.unitCode
        const branchEntity = new BranchEntity();
        branchEntity.id = dto.branchId;
        entity.branchId = branchEntity;
        const voucherEntity = new VoucherEntity();
        voucherEntity.id = dto.voucherId;
        entity.voucherId = voucherEntity;
        if (dto.id) {
            entity.id = dto.id;
        }

        if (dto.initialPayment) {
            entity.initialPayment = dto.initialPayment;
        }

        if (dto.numberOfEmi) {
            entity.numberOfEmi = dto.numberOfEmi;
        }

        if (dto.emiNumber) {
            entity.emiNumber = dto.emiNumber;
        }

        if (dto.emiAmount) {
            entity.emiAmount = dto.emiAmount;
        }

        return entity;
    }
}



