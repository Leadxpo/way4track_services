import { Injectable } from '@nestjs/common';
import { AccountRepository } from './repo/account.repo';
import { AccountDto } from './dto/account.dto';
import { CommonResponse } from 'src/models/common-response';
import { AccountAdapter } from './account.adapter';
import { ErrorResponse } from 'src/models/error-response';
import { CommonReq } from 'src/models/common-req';
import { AccountIdDto } from './dto/account.id.dto';
import { VoucherRepository } from 'src/voucher/repo/voucher.repo';
import { BranchRepository } from 'src/branch/repo/branch.repo';


@Injectable()
export class AccountService {
    constructor(
        private readonly accountRepository: AccountRepository,
        private readonly adapter: AccountAdapter,
        private voucherRepo: VoucherRepository,
        private readonly branchRepo: BranchRepository
    ) { }


    async createAccount(dto: AccountDto): Promise<CommonResponse> {
        try {
            let internalMessage = dto.id ? " Updated Successfully" : " Created Successfully"
            const convertDto = this.adapter.toEntity(dto);
            await this.accountRepository.save(convertDto);
            return new CommonResponse(true, 65152, internalMessage)
        }
        catch (error) {
            throw new ErrorResponse(5416, error.message)
        }
    }

    async getAccountsDetails(req: CommonReq): Promise<CommonResponse> {
        const entities = await this.accountRepository.find({
            relations: ['branch', 'vouchersTo', 'vouchersFrom'],
            where: {
                companyCode: req.companyCode,
                unitCode: req.unitCode,
            },
        });

        if (!entities.length) {
            return new CommonResponse(false, 8754, "There Is No account");
        } else {
            const dtoData = this.adapter.convertEntityToDto(entities);
            return new CommonResponse(true, 6541, "Data Retrieved Successfully", [dtoData]);
        }
    }


    async getAccountsDropDown(): Promise<CommonResponse> {
        const data = await this.accountRepository.find({ select: ['id', 'accountName', 'accountNumber'] });
        if (data.length) {
            return new CommonResponse(true, 75483, "Data Retrieved Successfully", data)
        } else {
            return new CommonResponse(false, 4579, "There Is No branch names")
        }
    }

    async getAccountsDetailsById(req: AccountIdDto): Promise<CommonResponse> {
        const entities = await this.accountRepository.findOne({
            relations: ['branch'],
            where: {
                accountNumber: req.fromAccountNumber,
                companyCode: req.companyCode,
                unitCode: req.unitCode,
            },
        });

        if (!entities) {
            return new CommonResponse(false, 8754, "There Is No account");
        } else {
            return new CommonResponse(true, 6541, "Data Retrieved Successfully", entities);
        }
    }
    async deleteAccountDetails(dto: AccountIdDto): Promise<CommonResponse> {
        try {
            const accountExists = await this.accountRepository.findOne({
                where: { accountNumber: dto.fromAccountNumber, companyCode: dto.companyCode, unitCode: dto.unitCode },
            });

            if (!accountExists) {
                throw new ErrorResponse(404, `account with ID ${dto.fromAccountNumber} does not exist`);
            }

            await this.accountRepository.delete(dto.fromAccountNumber);
            return new CommonResponse(true, 200, 'account details deleted successfully');
        } catch (error) {
            console.error('Error in delete account Details service:', error);
            throw new ErrorResponse(500, error.message);
        }
    }
}
