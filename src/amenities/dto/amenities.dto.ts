export class AmenitiesDto {
    id?: number;
    webProductId?: number;
    webProductName?: string;
    image?: string;
    name?: string;
    desc?: string;
    companyCode: string;
    unitCode: string;
}
// If needed - for file + DTO list parsing
export class AmenitiesListDto {
    dtoList: AmenitiesDto[]; // this will be parsed from JSON
}
