export class StaffIdDto {
    staffId: string;
    companyCode?: string;
    unitCode?: string
    constructor(staffId: string, companyCode?: string,
        unitCode?: string) {
        this.staffId = staffId;
        this.companyCode = companyCode
        this.unitCode = unitCode
    }
}