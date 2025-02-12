import { BranchEntity } from "src/branch/entity/branch.entity";
import { AccountEntity } from "./entity/account.entity";
import { AccountDto } from "./dto/account.dto";
import { AccountResDto } from "./dto/account.res.dto";
import { Entity } from "typeorm";

export class AccountAdapter {
    toEntity(dto: AccountDto): AccountEntity {
        const account = new AccountEntity();

        // Setting Branch Entity
        const branch = new BranchEntity();
        branch.id = dto.branchId;
        account.branch = branch;
        // Mapping Other Properties
        account.name = dto.bankName;
        account.accountType = dto.accountType;
        account.accountNumber = dto.accountNumber;
        account.ifscCode = dto.ifscCode;
        account.phoneNumber = dto.bankPhoneNumber;
        account.address = dto.bankAddress;
        account.companyCode = dto.companyCode;
        account.unitCode = dto.unitCode;
        account.accountName = dto.accountHolderName;
        account.totalAmount = dto.totalAmount;
        if (dto.id) {
            account.id = dto.id
        }
        return account;
    }

    // Convert Entity to DTO using constructor
    convertEntityToDto(entities: AccountEntity[]): AccountResDto[] {
        return entities.map(
            (entity) =>
                new AccountResDto(
                    entity.id,
                    entity.name,
                    entity.accountType,
                    entity.accountNumber,
                    entity.ifscCode,
                    entity.phoneNumber,
                    entity.address,
                    entity.companyCode,
                    entity.unitCode,
                    entity.branch?.id ?? 0, // Provide default value if null
                    entity.branch?.branchName ?? '',
                    entity.accountName,
                    entity.totalAmount
                )
        );
    }
}
