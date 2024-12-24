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
const branch_entity_1 = require("../../branch/entity/branch.entity");
const attendence_status_enum_1 = require("../../staff/enum/attendence-status.enum");
let AttendanceEntity = class AttendanceEntity {
};
exports.AttendanceEntity = AttendanceEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AttendanceEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'day', type: 'date' }),
    __metadata("design:type", Date)
], AttendanceEntity.prototype, "day", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'in_time', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], AttendanceEntity.prototype, "inTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'out_time', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], AttendanceEntity.prototype, "outTime", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'status',
        type: 'enum',
        enum: attendence_status_enum_1.AttendanceStatus,
        default: attendence_status_enum_1.AttendanceStatus.PRESENT
    }),
    __metadata("design:type", String)
], AttendanceEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.StaffEntity, (staffEntity) => staffEntity.staffId),
    (0, typeorm_1.JoinColumn)({ name: 'staff_id' }),
    __metadata("design:type", staff_entity_1.StaffEntity)
], AttendanceEntity.prototype, "staffId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.BranchEntity, (branchEntity) => branchEntity.attendance),
    (0, typeorm_1.JoinColumn)({ name: 'branch_id' }),
    __metadata("design:type", branch_entity_1.BranchEntity)
], AttendanceEntity.prototype, "branchId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'company_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], AttendanceEntity.prototype, "companyCode", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'unit_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], AttendanceEntity.prototype, "unitCode", void 0);
exports.AttendanceEntity = AttendanceEntity = __decorate([
    (0, typeorm_1.Entity)('attendance')
], AttendanceEntity);
//# sourceMappingURL=attendence.entity.js.map