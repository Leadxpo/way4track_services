
export class ProductDto {
  id?: number;
  productName: string;
  dateOfPurchase: Date;
  vendorId: number;
  imeiNumber: string;
  categoryName: string;
  price: number;
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
}



export class BulkProductDto {
  products: ProductDto[];
}
