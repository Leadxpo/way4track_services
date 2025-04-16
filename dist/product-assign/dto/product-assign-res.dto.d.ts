import { ProductStatusEnum } from "src/product/enum/product-status.enum";
export declare class ProductAssignResDto {
    id: number;
    staffId: string;
    staffName: string;
    branchId: number;
    branchName: string;
    productName: string;
    productType: string;
    imeiNumberFrom: string;
    imeiNumberTo: string;
    numberOfProducts: number;
    productAssignPhoto: string;
    companyCode: string;
    unitCode: string;
    requestId: number;
    request: string;
    status?: ProductStatusEnum;
    constructor(id: number, staffId: string, staffName: string, branchId: number, branchName: string, productName: string, productType: string, imeiNumberFrom: string, imeiNumberTo: string, numberOfProducts: number, productAssignPhoto: string, companyCode: string, unitCode: string, requestId: number, request: string, status?: ProductStatusEnum);
}
