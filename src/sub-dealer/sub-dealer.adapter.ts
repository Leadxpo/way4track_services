import { Injectable } from '@nestjs/common';
import { SubDealerDto } from './dto/sub-dealer.dto';
import { SubDealerEntity } from './entity/sub-dealer.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { SubDealerResDto } from './dto/sub-dealer-res.dto';
import { BranchEntity } from 'src/branch/entity/branch.entity';

@Injectable()
export class SubDealerAdapter {
    convertDtoToEntity(dto: SubDealerDto): SubDealerEntity {
        const entity = new SubDealerEntity();

        entity.name = dto.name;
        entity.subDealerPhoneNumber = dto.subDealerPhoneNumber;
        entity.alternatePhoneNumber = dto.alternatePhoneNumber;
        entity.gstNumber = dto.gstNumber;
        entity.startingDate = dto.startingDate;
        entity.emailId = dto.emailId;
        entity.aadharNumber = dto.aadharNumber;
        entity.address = dto.address;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        entity.password = dto.password;
        entity.subDealerPhoto = dto.subDealerPhoto;

        if (dto.voucherId) {
            const voucher = new VoucherEntity();
            voucher.id = dto.voucherId;
            entity.voucherId = voucher;
        }

        if (dto.branchId) {
            const branch = new BranchEntity();
            branch.id = dto.branchId;
            entity.branch = branch;
        }

        if (dto.id) {
            entity.id = dto.id;
        }

        return entity;
    }

    convertEntityToDto(entity: SubDealerEntity[]): SubDealerResDto[] {
        return entity.map((subDealer) => {
            const {
                id,
                name,
                subDealerPhoneNumber,
                alternatePhoneNumber,
                startingDate,
                emailId,
                aadharNumber,
                address,
                voucherId,
                subDealerPhoto,
                subDealerId,
                companyCode,
                unitCode,
                branch
            } = subDealer;

            return new SubDealerResDto(
                id,
                name,
                subDealerPhoneNumber,
                alternatePhoneNumber,
                startingDate,
                emailId,
                aadharNumber,
                address,
                voucherId?.voucherId ?? '',
                voucherId?.name ?? '',
                subDealerPhoto,
                subDealerId,
                companyCode,
                unitCode,
                branch?.branchName ?? '',
                branch?.id ?? null,
            );
        });
    }
}
