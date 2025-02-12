import { Body, Controller, Post } from '@nestjs/common';
import { CommonResponse } from 'src/models/common-response';
import { AccountDto } from './dto/account.dto';
import { AccountService } from './account.service';
import { AccountIdDto } from './dto/account.id.dto';
import { CommonReq } from 'src/models/common-req';


@Controller('account')
export class AccountController {
    constructor(private readonly accountService: AccountService) { }

    @Post('createAccount')
    async createAccount(@Body() dto: AccountDto): Promise<CommonResponse> {
        try {
            if (dto.id) {
                dto.id = Number(dto.id);
            }
            return await this.accountService.createAccount(dto);
        } catch (error) {
            console.error('Error in save account details:', error);
            return new CommonResponse(false, 500, 'Error saving account details');
        }
    }

    @Post('deleteAccountDetails')
    async deleteAccountDetails(@Body() dto: AccountIdDto): Promise<CommonResponse> {
        try {
            return await this.accountService.deleteAccountDetails(dto);
        } catch (error) {
            console.error('Error in delete account details:', error);
            return new CommonResponse(false, 500, 'Error deleting account details');
        }
    }

    @Post('getAccountsDetails')
    async getAccountsDetails(@Body() dto: CommonReq): Promise<CommonResponse> {
        try {
            return await this.accountService.getAccountsDetails(dto);
        } catch (error) {
            console.error('Error in get account details:', error);
            return new CommonResponse(false, 500, 'Error fetching account details');
        }
    }

    @Post('getAccountsDropDown')
    async getAccountsDropDown(): Promise<CommonResponse> {
        try {
            return this.accountService.getAccountsDropDown();
        } catch (error) {
            return new CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }

    @Post('getAccountsDetailsById')
    async getAccountsDetailsById(@Body() dto: AccountIdDto): Promise<CommonResponse> {
        try {
            return await this.accountService.getAccountsDetailsById(dto);
        } catch (error) {
            console.error('Error in get account details:', error);
            return new CommonResponse(false, 500, 'Error fetching account details');
        }
    }
}
