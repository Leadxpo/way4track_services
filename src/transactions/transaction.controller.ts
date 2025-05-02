
import { Body, Controller, Post } from '@nestjs/common';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';


@Controller('transactions')
export class TransactionController {
    constructor(private readonly service: TransactionService) { }

    @Post('handleCreateTransaction')
    async handleCreateTransaction(@Body() dto: CreateTransactionDto): Promise<CommonResponse> {
        try {
            if (dto.id) dto.id = Number(dto.id);
            return await this.service.handleCreateTransaction(dto);
        } catch (error) {
            console.error('Error saving order:', error);
            return new CommonResponse(false, 500, 'Error saving order');
        }
    }

    @Post('deleteTransaction')
    async deleteTransaction(@Body() dto: HiringIdDto): Promise<CommonResponse> {
        try {
            return await this.service.deleteTransaction(dto);
        } catch (error) {
            console.error('Error deleting order:', error);
            return new CommonResponse(false, 500, 'Error deleting order');
        }
    }

    @Post('getTransactionList')
    async getTransactionList(): Promise<CommonResponse> {
        try {
            return await this.service.getTransactionList();
        } catch (error) {
            console.error('Error fetching order list:', error);
            return new CommonResponse(false, 500, 'Error fetching order list');
        }
    }

    @Post('getTransactionById')
    async getTransactionById(@Body() dto: HiringIdDto): Promise<CommonResponse> {
        try {
            return await this.service.getTransactionById(dto);
        } catch (error) {
            console.error('Error fetching order by ID:', error);
            return new CommonResponse(false, 500, 'Error fetching order by ID');
        }
    }
}