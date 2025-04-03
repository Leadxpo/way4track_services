export class ServiceTypeResponseDto {
    id: number;
    name: string;
    duration: string;
    companyCode: string;
    unitCode: string;
    description: string;
    constructor(
        id: number,
        name: string,
        duration: string,
        companyCode: string,
        unitCode: string,
        description: string,
    ) {
        this.id = id;
        this.name = name;
        this.duration = duration;
        this.companyCode = companyCode;
        this.unitCode = unitCode;
        this.description = description;
    }
}
