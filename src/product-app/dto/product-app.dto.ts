
export class ProductAppDto {
    id?: number;
    name?: string;
    image?: string;
    shortDescription?: string;
    webProductId?: number;
    companyCode: string;
    unitCode: string;
    points: { title: string; desc: string,file:string }[];
}
export class ProductAppListDto {
    dtoList: ProductAppDto[]; // this will be parsed from JSON
}