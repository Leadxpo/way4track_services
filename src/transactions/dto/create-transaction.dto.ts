// dto/create-transaction.dto.ts
export class CreateTransactionDto {
    id?: number;
    transactionId: number;
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
    deliveryAddress: string;
    clientId: number;
    orderId: number;
    companyCode: string;
    unitCode: string;
}
// dto/transaction-response.dto.ts
export class TransactionResponseDto {
    id: number;
    transactionId: number;
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
    deliveryAddress: string;
    clientId: number;
    orderId: number;
    companyCode: string;
    unitCode: string;
    createdAt: Date;
    updatedAt: Date;
}
