import { PaymentStatus } from "src/product/dto/payment-status.enum";
import { WorkStatusEnum } from "src/work-allocation/enum/work-status-enum";

export class TechnicianWorksDto {
    id?: number;
    service: string;
    workStatus: WorkStatusEnum;
    paymentStatus: PaymentStatus;
    imeiNumber: string;
    vehicleType: string;
    vehicleNumber: string;
    chassisNumber: string;
    engineNumber: string;
    vehiclePhoto?: string;
    date: Date;
    description: string;


    staffId: number; branchId: number; productId: number;
    vendorId: number; clientId: number; voucherId: number;
    workId: number;
    companyCode: string;
    unitCode: string;
    productName: string
    name: string;
    phoneNumber: string;
    simNumber: string;
    address: string;
}
