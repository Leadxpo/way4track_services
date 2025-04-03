export class VehicleTypeResponseDto {
    id: number;
    name: string;
    companyCode: string;
    unitCode: string;
    description: string;

    constructor(
        id: number,
        name: string,
        companyCode: string,
        unitCode: string,
        description: string,
    ) {
        this.id = id;
        this.name = name;
        this.companyCode = companyCode;
        this.unitCode = unitCode;
        this.description = description;
    }
}
