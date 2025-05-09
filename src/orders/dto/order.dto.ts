import { OrderStatus } from "../entity/orders.entity";

export class CreateOrderDto {
  id?: number;
  name?: string;
  totalAmount?: number;
  paymentStatus?: string;
  orderDate?: string;
  delivaryDate: Date;
  deliveryAddress?: string;
  orderStatus?: OrderStatus;
  clientId?: number;
  companyCode: string;
  unitCode: string;
  orderItems: {
    name: string;
    qty: number;
    amount: number;
    deviceId: string;
    is_relay: boolean;
    network: string;
    subscriptionType: string;
    desc: string;
  }[];
}
