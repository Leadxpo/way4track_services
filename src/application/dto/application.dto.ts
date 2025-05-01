export class ApplicationDto {
    id?: number;
    webProductId?: number;
    webProductName?: string;
    image?: string;
    name?: string;
    desc?: string;
    companyCode: string;
    unitCode: string;
}
export class ApplicationListDto {
    dtoList: ApplicationDto[]; // this will be parsed from JSON
}