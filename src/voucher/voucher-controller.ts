import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { VoucherDto } from './dto/voucher.dto';
import { CommonResponse } from 'src/models/common-response';
import { VoucherIdDto } from './dto/voucher-id.dto';
import { VoucherService } from './voucher-service';
import * as multer from 'multer';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
const multerOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000000,
    },
};
@Controller('voucher')
export class VoucherController {
    constructor(private readonly voucherService: VoucherService) { }
    @UseInterceptors(FileInterceptor('file', multerOptions))
    @Post('saveVoucher')
    async saveVoucher(@Body() dto: VoucherDto,
        @UploadedFile() file?: Express.Multer.File,): Promise<CommonResponse> {
        try {
            if (dto.id) {
                dto.id = Number(dto.id);
            }
            const savedVoucher = await this.voucherService.handleVoucher(dto, file);
            return new CommonResponse(true, 200, 'Voucher saved successfully', savedVoucher);
        } catch (error) {
            console.error('Error in save voucher details:', error);
            return new CommonResponse(false, 500, 'Error saving voucher details', error.message);
        }
    }

    @Post('deleteVoucher')
    async deleteVoucher(@Body() dto: { voucherId: string }): Promise<CommonResponse> {
        try {
            return await this.voucherService.deleteVoucherDetails(dto);
        } catch (error) {
            console.error('Error in delete voucher details:', error);
            return new CommonResponse(false, 500, 'Error deleting voucher details', error.message);
        }
    }

    @Post('getPendingVouchers')
    async getPendingVouchers(@Body() dto: { ledgerId: number }): Promise<CommonResponse> {
        try {
            return await this.voucherService.getPendingVouchers(dto);
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