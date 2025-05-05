// dto/cart.dto.ts

import { SubscriptionType } from '../entity/cart.entity';

export class CreateCartDto {
    id?: number;
    name?: string;
    quantity?: number;
    isRelay?: boolean;
    network?: string;
    pincode?: string;
    subscription?: SubscriptionType;
    totalAmount?: string;
    clientId?: number;
    deviceId?: number;
    companyCode: string;
    unitCode: string;
}

export class CartResponseDto {
    id: number;
    name: string;
    quantity: number;
    isRelay: boolean;
    network: string;
    pincode: string;
    subscription: SubscriptionType;
    totalAmount: string;
    companyCode: string;
    unitCode: string;
    createdAt: Date;
    updatedAt: Date;
    clientId?: number;
    deviceId?: number;
}
export class DeleteDto {
    unitCode: string;
    companyCode: string;
    id?: number;        // For marking a single notification as read
    ids?: number[];     // For marking multiple notifications as read
}