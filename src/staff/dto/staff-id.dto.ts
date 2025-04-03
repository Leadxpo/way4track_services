export class StaffIdDto {
    id: number
    staffId: string;
    companyCode?: string;
    unitCode?: string
    constructor(staffId: string, companyCode?: string,
        id?: number,
        unitCode?: string,) {
        this.staffId = staffId;
        this.companyCode = companyCode
        this.unitCode = unitCode
        this.id = id
    }
}