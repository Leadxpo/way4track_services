
export class ProductDto {
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
  unitCode: string
}


export class BulkProductDto {
  products: ProductDto[];
}
