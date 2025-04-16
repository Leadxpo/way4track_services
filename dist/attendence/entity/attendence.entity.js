"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceEntity = void 0;
const typeorm_1 = require("typeorm");
const staff_entity_1 = require("../../staff/entity/staff.entity");
const attendence_status_enum_1 = require("../../staff/enum/attendence-status.enum");
let AttendanceEntity = class AttendanceEntity {
};
exports.AttendanceEntity = AttendanceEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AttendanceEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.StaffEntity, (staff) => staff.attendance, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'staff_id' }),
    __metadata("design:type", staff_entity_1.StaffEntity)
], AttendanceEntity.prototype, "staff", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'staff_name', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], AttendanceEntity.prototype, "staffName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'branch_name', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], AttendanceEntity.prototype, "branchName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'day', type: 'date', nullable: false }),
    __metadata("design:type", Date)
], AttendanceEntity.prototype, "day", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'in_time', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], AttendanceEntity.prototype, "inTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'in_time_remark', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], AttendanceEntity.prototype, "inTimeRemark", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'out_time', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], AttendanceEntity.prototype, "outTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'out_time_remark', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], AttendanceEntity.prototype, "outTimeRemark", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'remark', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], AttendanceEntity.prototype, "remark", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'status',
        type: 'enum',
        enum: attendence_status_enum_1.AttendanceStatus,
        default: attendence_status_enum_1.AttendanceStatus.PRESENT,
    }),
    __metadata("design:type", String)
], AttendanceEntity.prototype, "status", void 0);
exports.AttendanceEntity = AttendanceEntity = __decorate([
    (0, typeorm_1.Entity)('attendances')
], AttendanceEntity);
//# sourceMappingURL=attendence.entity.js.map