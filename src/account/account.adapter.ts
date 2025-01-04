import { BranchEntity } from "src/branch/entity/branch.entity";
import { AccountEntity } from "./entity/account.entity";
import { AccountDto } from "./dto/account.dto";
import { AccountResDto } from "./dto/account.res.dto";

export class AccountAdapter {
    toEntity(dto: AccountDto): AccountEntity {
        const account = new AccountEntity();

        // Setting Branch Entity
        const branch = new BranchEntity();
        branch.id = dto.branchId;
        account.branch = branch;
        // Mapping Other Properties
        account.name = dto.name;
        account.accountType = dto.accountType;
        account.accountNumber = dto.accountNumber;
        account.ifscCode = dto.ifscCode;
        account.phoneNumber = dto.phoneNumber;
        account.address = dto.address;
        account.companyCode = dto.companyCode;
        account.unitCode = dto.unitCode;
        account.accountName = dto.accountName;
        account.totalAmount = dto.totalAmount;
        return account;
    }

    convertEntityToDto(entities: AccountEntity[]): AccountResDto[] {
        return entities.map((entity) => {
            const response = new AccountResDto();
            response.id = entity.id;
            response.name = entity.name;
            response.accountType = entity.accountType;
            response.accountNumber = entity.accountNumber;
            response.ifscCode = entity.ifscCode;
            response.phoneNumber = entity.phoneNumber;
            response.address = entity.address;
            response.companyCode = entity.companyCode;
            response.unitCode = entity.unitCode;
            response.branchId = entity.branch?.id;
            response.branchName = entity.branch?.branchName;
            response.accountName = entity.accountName
            response.totalAmount = entity.totalAmount
            return response;
        });
    }
}
