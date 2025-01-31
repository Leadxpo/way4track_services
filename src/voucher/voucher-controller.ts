import { Controller, Post, Body } from '@nestjs/common';
import { VoucherDto } from './dto/voucher.dto';
import { CommonResponse } from 'src/models/common-response';
import { VoucherIdDto } from './dto/voucher-id.dto';
import { VoucherService } from './voucher-service';

@Controller('voucher')
export class VoucherController {
    constructor(private readonly voucherService: VoucherService) { }

    @Post('saveVoucher')
    async saveVoucher(@Body() dto: VoucherDto): Promise<CommonResponse> {
        try {
            const savedVoucher = await this.voucherService.handleVoucher(dto);
            return new CommonResponse(true, 200, 'Voucher saved successfully', savedVoucher);
        } catch (error) {
            console.error('Error in save voucher details:', error);
            return new CommonResponse(false, 500, 'Error saving voucher details', error.message);
        }
    }

    @Post('deleteVoucher')
    async deleteVoucher(@Body() dto: VoucherIdDto): Promise<CommonResponse> {
        try {
            return await this.voucherService.deleteVoucherDetails(dto);
        } catch (error) {
            console.error('Error in delete voucher details:', error);
            return new CommonResponse(false, 500, 'Error deleting voucher details', error.message);
        }
    }

    @Post('getAllVouchers')
    async getAllVouchers(): Promise<CommonResponse> {
        try {
            const vouchers = await this.voucherService.getAllVouchers();
            return new CommonResponse(true, 200, 'Vouchers fetched successfully', vouchers);
        } catch (error) {
            console.error('Error in get all voucher details:', error);
            return new CommonResponse(false, 500, 'Error fetching vouchers', error.message);
        }
    }

    @Post('getVoucherNamesDropDown')
    async getVoucherNamesDropDown(): Promise<CommonResponse> {
        try {
            return this.voucherService.getVoucherNamesDropDown();
        } catch (error) {
            return new CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }
}
