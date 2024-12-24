import { StaffEntity } from 'src/staff/entity/staff.entity';
import { CreateAttendanceDto, GetAttendanceDto } from './dto/attendence.dto';
import { AttendanceEntity } from './entity/attendence.entity';
import { BranchEntity } from 'src/branch/entity/branch.entity';

export class AttendanceAdapter {

    toEntity(dto: CreateAttendanceDto): AttendanceEntity {
        const entity = new AttendanceEntity();
        entity.staffId = { id: dto.staffId } as StaffEntity;
        entity.branchId = { id: dto.branchId } as BranchEntity;
        entity.day = dto.day;
        entity.inTime = dto.inTime;
        entity.outTime = dto.outTime;
        entity.status = dto.status;
        entity.companyCode = dto.companyCode
        entity.unitCode = dto.unitCode
        return entity;
    }


    toDto(attendance: AttendanceEntity): GetAttendanceDto {
        return {
            staffId: attendance.staffId.id,
            branchId: attendance.branchId.id,
            day: attendance.day,
            inTime: attendance.inTime,
            outTime: attendance.outTime,
            status: attendance.status,
            staffName: attendance.staffId.name,
            branchName: attendance.branchId.branchName,
            companyCode: attendance.companyCode,
            unitCode: attendance.unitCode
        };
    }
}
