// dto/staff-attendance.dto.ts

export class StaffAttendanceQueryDto {
    staffId?: string
    companyCode?: string;
    unitCode?: string
    date?: string;
    constructor(staffId?: string, companyCode?: string,
        date?: string,
        unitCode?: string,) {
        this.date = date;
        this.staffId = staffId
        this.companyCode = companyCode
        this.unitCode = unitCode
    }
}
