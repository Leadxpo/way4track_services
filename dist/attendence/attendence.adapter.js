"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceAdapter = void 0;
const attendence_entity_1 = require("./entity/attendence.entity");
class AttendanceAdapter {
    toEntity(dto) {
        const entity = new attendence_entity_1.AttendanceEntity();
        entity.staff = { staffId: dto.staffId };
        entity.day = dto.day;
        entity.status = dto.status;
        entity.inTime = dto.inTime;
        entity.inTimeRemark = dto.inTimeRemark;
        entity.staffName = dto.staffName;
        entity.outTime = dto.outTime;
        entity.outTimeRemark = dto.outTimeRemark;
        entity.branchName = dto.branchName;
        entity.remark = dto.remark;
        return entity;
    }
    toDto(attendance) {
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
            remark: attendance.remark
        };
    }
}
exports.AttendanceAdapter = AttendanceAdapter;
//# sourceMappingURL=attendence.adapter.js.map