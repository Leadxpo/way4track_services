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
exports.AppointmentEntity = exports.TimePeriodEnum = exports.AppointmentStatus = exports.AppointmentType = void 0;
const branch_entity_1 = require("../../branch/entity/branch.entity");
const client_entity_1 = require("../../client/entity/client.entity");
const staff_entity_1 = require("../../staff/entity/staff.entity");
const voucher_entity_1 = require("../../voucher/entity/voucher.entity");
const typeorm_1 = require("typeorm");
var AppointmentType;
(function (AppointmentType) {
    AppointmentType["SERVICE"] = "service";
    AppointmentType["PRODUCT"] = "product";
})(AppointmentType || (exports.AppointmentType = AppointmentType = {}));
var AppointmentStatus;
(function (AppointmentStatus) {
    AppointmentStatus["ACCEPTED"] = "accepted";
    AppointmentStatus["REJECTED"] = "rejected";
    AppointmentStatus["SENT"] = "sent";
})(AppointmentStatus || (exports.AppointmentStatus = AppointmentStatus = {}));
var TimePeriodEnum;
(function (TimePeriodEnum) {
    TimePeriodEnum["AM"] = "AM";
    TimePeriodEnum["PM"] = "PM";
})(TimePeriodEnum || (exports.TimePeriodEnum = TimePeriodEnum = {}));
let AppointmentEntity = class AppointmentEntity {
};
exports.AppointmentEntity = AppointmentEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AppointmentEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'appointment_id',
        type: 'varchar',
        length: 50,
        unique: true,
    }),
    __metadata("design:type", String)
], AppointmentEntity.prototype, "appointmentId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'appointment_type',
        type: 'enum',
        enum: AppointmentType,
        default: AppointmentType.PRODUCT
    }),
    __metadata("design:type", String)
], AppointmentEntity.prototype, "appointmentType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], AppointmentEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date', type: 'date', nullable: true }),
    __metadata("design:type", String)
], AppointmentEntity.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], AppointmentEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], AppointmentEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'time', type: 'time' }),
    __metadata("design:type", String)
], AppointmentEntity.prototype, "slot", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'period', type: 'enum', enum: TimePeriodEnum }),
    __metadata("design:type", String)
], AppointmentEntity.prototype, "period", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'text', nullable: true }),
    __metadata("design:type", String)
], AppointmentEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'status',
        type: 'enum',
        enum: AppointmentStatus,
        default: AppointmentStatus.SENT,
    }),
    __metadata("design:type", String)
], AppointmentEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.StaffEntity, (staffEntity) => staffEntity.appointment),
    (0, typeorm_1.JoinColumn)({ name: 'staff_id' }),
    __metadata("design:type", staff_entity_1.StaffEntity)
], AppointmentEntity.prototype, "staffId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => client_entity_1.ClientEntity, (ClientEntity) => ClientEntity.appiontment),
    (0, typeorm_1.JoinColumn)({ name: 'client_id' }),
    __metadata("design:type", client_entity_1.ClientEntity)
], AppointmentEntity.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => voucher_entity_1.VoucherEntity, (VoucherEntity) => VoucherEntity.appointments),
    (0, typeorm_1.JoinColumn)({ name: 'voucher_id' }),
    __metadata("design:type", voucher_entity_1.VoucherEntity)
], AppointmentEntity.prototype, "voucherId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.BranchEntity, (branchEntity) => branchEntity.appointment),
    (0, typeorm_1.JoinColumn)({ name: 'branch_id' }),
    __metadata("design:type", branch_entity_1.BranchEntity)
], AppointmentEntity.prototype, "branchId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'company_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], AppointmentEntity.prototype, "companyCode", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'unit_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], AppointmentEntity.prototype, "unitCode", void 0);
exports.AppointmentEntity = AppointmentEntity = __decorate([
    (0, typeorm_1.Entity)('appointments')
], AppointmentEntity);
//# sourceMappingURL=appointement.entity.js.map