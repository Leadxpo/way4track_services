// import { StaffEntity } from 'src/staff/entity/staff.entity';
// import { CreateAttendanceDto, GetAttendanceDto } from './dto/attendence.dto';
// import { AttendanceEntity } from './entity/attendence.entity';
// import { BranchEntity } from 'src/branch/entity/branch.entity';

// export class AttendanceAdapter {

//     toEntity(dto: CreateAttendanceDto): AttendanceEntity {
//         const entity = new AttendanceEntity();
//         entity.staffId = { staffId: dto.staffId } as StaffEntity;
//         entity.branchId = { id: dto.branchId } as BranchEntity;
//         entity.day = dto.day;
//         entity.status = dto.status;
//         entity.companyCode = dto.companyCode;
//         entity.unitCode = dto.unitCode;

//         // Initialize timeRecords array properly
//         entity.timeRecords = dto.inTime && dto.outTime ? [{ inTime: dto.inTime, outTime: dto.outTime }] : [];

//         return entity;
//     }


//     toDto(attendance: AttendanceEntity): GetAttendanceDto {
//         return {
//             staffId: attendance.staffId.staffId,
//             branchId: attendance.branchId.id,
//             day: attendance.day,
//             timeRecords: attendance.timeRecords,
//             status: attendance.status,
//             staffName: attendance.staffId.name,
//             branchName: attendance.branchId.branchName,
//             companyCode: attendance.companyCode,
//             unitCode: attendance.unitCode
//         };
//     }
// }
