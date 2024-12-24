export declare class ProductDto {
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
}
export declare class BulkProductDto {
    products: ProductDto[];
}
