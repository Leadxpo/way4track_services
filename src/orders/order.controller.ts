import { Body, Controller, Post } from '@nestjs/common';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Post('handleCreateOrder')
  async handleCreateOrder(@Body() dto: CreateOrderDto): Promise<CommonResponse> {
    try {
      if (dto.id) dto.id = Number(dto.id);
      return await this.service.handleCreateOrder(dto);
    } catch (error) {
      console.error('Error saving order:', error);
      return new CommonResponse(false, 500, 'Error saving order');
    }
  }

  @Post('deleteOrder')
  async deleteOrder(@Body() dto: HiringIdDto): Promise<CommonResponse> {
    try {
      return await this.service.deleteOrder(dto);
    } catch (error) {
      console.error('Error deleting order:', error);
      return new CommonResponse(false, 500, 'Error deleting order');
    }
  }

  @Post('getOrderList')
  async getOrderList(): Promise<CommonResponse> {
    try {
      return await this.service.getOrderList();
    } catch (error) {
      console.error('Error fetching order list:', error);
      return new CommonResponse(false, 500, 'Error fetching order list');
    }
  }

  @Post('getOrderById')
  async getOrderById(@Body() dto: HiringIdDto): Promise<CommonResponse> {
    try {
      return await this.service.getOrderById(dto);
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      return new CommonResponse(false, 500, 'Error fetching order by ID');
    }
  }
}