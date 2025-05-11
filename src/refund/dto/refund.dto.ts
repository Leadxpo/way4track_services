// refund-response.dto.ts
import { RefundStatus } from "../entity/refund.entity";

export class CreateRefundDto {
    id: number;
    name?: string;
    productName?: string;
    phoneNumber?: number;
    dateOfRequest?: string;
    dateOfReplace?: string;
    damageImage?: string;
    refundStatus: RefundStatus;
    description?: string;
    clientId?: number;
    orderId?: number;
    transactionId?: number;
    deviceId?: number;
}
