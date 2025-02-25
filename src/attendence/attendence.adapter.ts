import { StaffEntity } from 'src/staff/entity/staff.entity';
import { CreateAttendanceDto, GetAttendanceDto } from './dto/attendence.dto';
import { AttendanceEntity } from './entity/attendence.entity';
import { BranchEntity } from 'src/branch/entity/branch.entity';

export class AttendanceAdapter {

    toEntity(dto: CreateAttendanceDto): AttendanceEntity {
        const entity = new AttendanceEntity();
        entity.staff = { staffId: dto.staffId } as StaffEntity;
        // entity.branchId = { id: dto.branchId } as BranchEntity;
        entity.day = dto.day;
        entity.status = dto.status;
        entity.inTime = dto.inTime;
        entity.inTimeRemark = dto.inTimeRemark;
        entity.staffName = dto.staffName;
        entity.outTime = dto.outTime;
        entity.outTimeRemark = dto.outTimeRemark;
        entity.branchName = dto.branchName;

        return entity;
    }


    toDto(attendance: AttendanceEntity): GetAttendanceDto {
        return {
            staffId: attendance.staff?.staffId ?? null,
            day: attendance.day,
            inTime: attendance.inTime,
            inTimeRemark: attendance.inTimeRemark,
            outTime: attendance.outTime,
            outTimeRemark: attendance.outTimeRemark,
            status: attendance.status,
            staffName: attendance.staff?.name ?? 'Unknown',
            branchName: attendance.branchName,
        };
    }
}
