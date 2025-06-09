import { OrderStatus } from "../entity/orders.entity";

export class CreateOrderDto {
    id?: number;
    name?: string;
    totalAmount?: number;
    paymentStatus?: string;
    orderDate?: string;
    delivaryDate: Date;
    orderStatus?: OrderStatus;
    companyCode: string;
    unitCode: string;
    razorpay_order_id?:string;
    razorpay_payment_id?:string;
    razorpay_signature?:string
    clientId?: number;
    deliveryAddressId?: number
    buildingAddressId?: number
    description: string;
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
