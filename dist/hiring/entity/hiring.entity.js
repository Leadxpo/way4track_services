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
exports.HiringEntity = exports.InterviewWith = void 0;
const typeorm_1 = require("typeorm");
const hiring_status_enum_1 = require("../enum/hiring-status.enum");
const hiring_level_enum_1 = require("../enum/hiring-level.enum");
const staff_entity_1 = require("../../staff/entity/staff.entity");
var InterviewWith;
(function (InterviewWith) {
    InterviewWith["Sunil"] = "Sunil";
    InterviewWith["Ashok"] = "Ashok";
    InterviewWith["HR"] = "HR";
})(InterviewWith || (exports.InterviewWith = InterviewWith = {}));
let HiringEntity = class HiringEntity extends typeorm_1.BaseEntity {
};
exports.HiringEntity = HiringEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HiringEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'hiring_level', type: 'enum', enum: hiring_level_enum_1.HiringLevel, default: hiring_level_enum_1.HiringLevel.LEVEL_1 }),
    __metadata("design:type", Number)
], HiringEntity.prototype, "hiringLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'candidate_name', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], HiringEntity.prototype, "candidateName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone_number', type: 'varchar', length: 15 }),
    __metadata("design:type", String)
], HiringEntity.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], HiringEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address', type: 'text' }),
    __metadata("design:type", String)
], HiringEntity.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)('json', { name: 'qualifications' }),
    __metadata("design:type", Array)
], HiringEntity.prototype, "qualifications", void 0);
__decorate([
    (0, typeorm_1.Column)('json', { name: 'level_wise_data', nullable: true }),
    __metadata("design:type", Array)
], HiringEntity.prototype, "levelWiseData", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'resume_path', type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], HiringEntity.prototype, "resumePath", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'joining_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", String)
], HiringEntity.prototype, "joiningDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notice_period', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", String)
], HiringEntity.prototype, "noticePeriod", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date_of_upload', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], HiringEntity.prototype, "dateOfUpload", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: hiring_status_enum_1.HiringStatus, default: hiring_status_enum_1.HiringStatus.PENDING }),
    __metadata("design:type", String)
], HiringEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'company_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], HiringEntity.prototype, "companyCode", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'unit_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], HiringEntity.prototype, "unitCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], HiringEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], HiringEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'driving_licence_number', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], HiringEntity.prototype, "drivingLicenceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'driving_licence', type: 'enum', enum: staff_entity_1.YesNo, default: staff_entity_1.YesNo.NO }),
    __metadata("design:type", String)
], HiringEntity.prototype, "drivingLicence", void 0);
exports.HiringEntity = HiringEntity = __decorate([
    (0, typeorm_1.Entity)('hiring')
], HiringEntity);
//# sourceMappingURL=hiring.entity.js.map