
export class ProductDto {
  id?: number
  productName: string;
  emiNumber: string;
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

}


export class BulkProductDto {
  products: ProductDto[];
}
