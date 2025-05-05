
import { Body, Controller, Post } from '@nestjs/common';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { CartService } from './cart.service';
import { CreateCartDto, DeleteDto } from './dto/cart.dto';

@Controller('cart')
export class CartController {
    constructor(private readonly service: CartService) { }

    @Post('handleCreateCart')
    async handlecreateCart(@Body() dto: CreateCartDto): Promise<CommonResponse> {
        try {
            if (dto.id) {
                dto.id = Number(dto.id);
            }
            return await this.service.handlecreateCart(dto);
        } catch (error) {
            console.error('Error saving cart details:', error);
            return new CommonResponse(false, 500, 'Error saving cart details');
        }
    }

    @Post('deleteCartDetails')
    async deleteCartDetails(@Body() dto: DeleteDto): Promise<CommonResponse> {
        try {
            return await this.service.deleteCartDetails(dto);
        } catch (error) {
            console.error('Error deleting cart details:', error);
            return new CommonResponse(false, 500, 'Error deleting cart details');
        }
    }

    @Post('getCartsByCompanyAndUnit')
    async getCartsByCompanyAndUnit(): Promise<CommonResponse> {
        try {
            return await this.service.getCartsByCompanyAndUnit();
        } catch (error) {
            console.error('Error fetching cart details:', error);
            return new CommonResponse(false, 500, 'Error fetching cart details');
        }
    }

    @Post('getCartDetailsById')
    async getCartDetailsById(@Body() dto: HiringIdDto): Promise<CommonResponse> {
        try {
            return await this.service.getCartDetailsById(dto);
        } catch (error) {
            console.error('Error fetching cart details by ID:', error);
            return new CommonResponse(false, 500, 'Error fetching cart details by ID');
        }
    }
}
