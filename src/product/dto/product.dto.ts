import { ProductStatusEnum } from "../enum/product-status.enum";

export class ProductDto {
  id?: number;
  productName: string;
  inDate: Date;
  vendorId: number;
  imeiNumber: string;
  categoryName: string;
  cost: number;
  productDescription: string;
  voucherId?: number;
  companyCode: string;
  unitCode: string;
  vendorPhoneNumber: string;
  vendorName: string;
  vendorAddress: string;
  vendorEmailId: string;
  quantity: number
  supplierName: string;
  serialNumber: string;
  primaryNo: string;
  secondaryNo: string;
  primaryNetwork: string;
  secondaryNetwork: string;
  simStatus: string;
  planName: string;
  remarks1: string;
  remarks2: string;
  deviceModel: string;
  SNO: number;
  ICCIDNo: string;
  hsnCode: string;
  remarks3: string;
  BASKET_NAME: string;
  SIM_IMSI: string;
  SIM_Number: string;
  MOBILE_NUMBER: string;
  productTypeId?: number
  productStatus?: ProductStatusEnum
  productType?: string
  branchId?: number
  subDealerId?: number
  staffId?: number
}



export class BulkProductDto {
  products: ProductDto[];
}
