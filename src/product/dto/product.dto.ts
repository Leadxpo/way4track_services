
export class ProductDto {
  id?: number;
  productName: string;
  // emiNumber: string;
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
  // New fields
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
}



export class BulkProductDto {
  products: ProductDto[];
}
