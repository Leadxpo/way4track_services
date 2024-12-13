// dto/staff-attendance.dto.ts

export class StaffAttendanceQueryDto {
    date: string
    constructor(date:string){
        this.date=date;
    }
}
