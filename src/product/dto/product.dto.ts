
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
}


export class BulkProductDto {
  products: ProductDto[];
}
