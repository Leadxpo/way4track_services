// dto/staff-attendance.dto.ts

export class StaffAttendanceQueryDto {
    date: string;
    staffId: string
    companyCode?: string;
    unitCode?: string
    constructor(date: string, staffId: string, companyCode?: string,
        unitCode?: string) {
        this.date = date;
        this.staffId = staffId
        this.companyCode = companyCode
        this.unitCode = unitCode
    }
}
