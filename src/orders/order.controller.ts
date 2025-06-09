import { Body, Controller, Post } from '@nestjs/common';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';
const Razorpay = require('razorpay');
import * as crypto from 'crypto';
import orders from 'razorpay/dist/types/orders';
import { error } from 'console';

const razorpayInstance = new Razorpay({
  key_id: process.env.KEY_ID || 'rzp_test_NPT4UOaHTgxvZj',
  key_secret: process.env.KEY_SECRET || 'V2S1KzGsJpfsVp6YsPlbdrOy',
});

@Controller('order')
export class OrderController {
  constructor(private readonly service: OrderService) { }

  @Post('CreateOrder')
  async CreateOrder(@Body() dto: CreateOrderDto): Promise<CommonResponse> {
    try {
      if (dto.id) dto.id = Number(dto.id);
      const amount = dto.totalAmount;
      const options = {
        amount: amount * 100,
        currency: 'INR',
        receipt: crypto.randomBytes(10).toString('hex'), // ✅ will now work
      };

      const order = await razorpayInstance.orders.create(options);

      return new CommonResponse(true, 200, 'Payment order created successfully', order);
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      return new CommonResponse(false, 500, 'Error creating payment order');
    }
  }

  @Post('OrderVerify')
  async OrderVerify(@Body() dto: any): Promise<CommonResponse> {
    try {
      let payload = dto;

      // If body is a string, parse it
      if (typeof dto.body === 'string') {
        payload = JSON.parse(dto.body);
      }

      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderDetails,
      } = payload;

      console.log("payload :", payload)
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      console.log("sign :", sign)
      const expectedSign = crypto
        .createHmac("sha256", process.env.KEY_SECRET || 'V2S1KzGsJpfsVp6YsPlbdrOy')
        .update(sign)
        .digest("hex");

      if (expectedSign === razorpay_signature) {
        console.log("Signature Verified ✅");
        return await this.service.handleCreateOrder(orderDetails);
      } else {
        return new CommonResponse(false, 400, 'Signature mismatch ❌');
      }
    } catch (error) {
      console.error('Error verifying order:', error);
      return new CommonResponse(false, 500, 'Error verifying order');
    }
  }

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

  @Post('getOrderWithProductDetails')
  async getOrderWithProductDetails(@Body() dto: HiringIdDto): Promise<CommonResponse> {
    try {
      return await this.service.getOrderWithProductDetails(dto);
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      return new CommonResponse(false, 500, 'Error fetching order by ID');
    }
  }
}