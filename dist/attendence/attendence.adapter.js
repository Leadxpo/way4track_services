"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceAdapter = void 0;
const attendence_entity_1 = require("./entity/attendence.entity");
class AttendanceAdapter {
    toEntity(dto) {
        const entity = new attendence_entity_1.AttendanceEntity();
        entity.staffId = { id: dto.staffId };
        entity.branchId = { id: dto.branchId };
        entity.day = dto.day;
        entity.inTime = dto.inTime;
        entity.outTime = dto.outTime;
        entity.status = dto.status;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        return entity;
    }
    toDto(attendance) {
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
exports.AttendanceAdapter = AttendanceAdapter;
//# sourceMappingURL=attendence.adapter.js.map