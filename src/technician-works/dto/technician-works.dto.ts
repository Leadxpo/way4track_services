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
    vehiclePhoto1?: string;
    vehiclePhoto2?: string;
    vehiclePhoto3?: string;
    vehiclePhoto4?: string;
    screenShot?: string;
    vehiclePhoto5?: string;
    vehiclePhoto6?: string;
    vehiclePhoto7?: string;
    vehiclePhoto8?: string;
    vehiclePhoto9?: string;
    vehiclePhoto10?: string;
    startDate: Date;
    endDate: Date;
    description: string;
    staffId: number; branchId: number; productId: number;
    vendorId: number;
    clientId: number; 
    voucherId: number;
    workId: number;
    companyCode: string;
    unitCode: string;
    productName: string
    name: string;
    phoneNumber: string;
    simNumber: string;
    // requirementDetails?: Requirements[];
    address: string;
    attendedDate?: Date;
    amount: number;
    backEndStaffRelation?: number
    technicianNumber: string;
    serviceOrProduct: string;
    email: string;
    vehicleId?: number
    serviceId?: number
    installationAddress?: string;
    remark: Remarks[];
    acceptStartDate: Date;
    activateDate: Date;
    pendingDate: Date;
    completedDate: Date;
    subDealerId?: number
    userName?: string;
    applicationId?: number
    paidAmount?: number;
    subDealerStaffId?: number
    fromStaffId?: number
    convertToInvoice: boolean;
}
export class Requirements {
    productName: string;
    quantity: number;
    price: number;
}
export class Remarks {
    staffId: string
    name: string;
    date: Date;
    desc: string;
    image?: string;
    video?: string
}