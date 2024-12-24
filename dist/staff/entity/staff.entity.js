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
exports.StaffEntity = exports.DesignationEnum = void 0;
const typeorm_1 = require("typeorm");
const branch_entity_1 = require("../../branch/entity/branch.entity");
const work_allocation_entity_1 = require("../../work-allocation/entity/work-allocation.entity");
const product_assign_entity_1 = require("../../product-assign/entity/product-assign.entity");
const request_raise_entity_1 = require("../../request-raise/entity/request-raise.entity");
const tickets_entity_1 = require("../../tickets/entity/tickets.entity");
const appointement_entity_1 = require("../../appointment/entity/appointement.entity");
const attendence_entity_1 = require("../../attendence/entity/attendence.entity");
var DesignationEnum;
(function (DesignationEnum) {
    DesignationEnum["CEO"] = "CEO";
    DesignationEnum["HR"] = "HR";
    DesignationEnum["Accountant"] = "Accountant";
    DesignationEnum["Operator"] = "Operator";
    DesignationEnum["WarehouseManager"] = "Warehouse Manager";
    DesignationEnum["BranchManager"] = "Branch Manager";
    DesignationEnum["SubDealer"] = "Sub Dealer";
    DesignationEnum["Technician"] = "Technician";
    DesignationEnum["SalesMan"] = "Sales Man";
    DesignationEnum["CallCenter"] = "Call Center";
})(DesignationEnum || (exports.DesignationEnum = DesignationEnum = {}));
let StaffEntity = class StaffEntity extends typeorm_1.BaseEntity {
};
exports.StaffEntity = StaffEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),
    __metadata("design:type", Number)
], StaffEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], StaffEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone_number', type: 'varchar', length: 15 }),
    __metadata("design:type", String)
], StaffEntity.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'staff_id', type: 'varchar', unique: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "staffId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password', type: 'varchar', unique: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'staff_photo', type: 'text', nullable: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "staffPhoto", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'designation',
        type: 'enum',
        enum: DesignationEnum,
        default: DesignationEnum.CEO
    }),
    __metadata("design:type", String)
], StaffEntity.prototype, "designation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dob', type: 'date' }),
    __metadata("design:type", Date)
], StaffEntity.prototype, "dob", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email', type: 'varchar', length: 150, unique: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'aadhar_number', type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], StaffEntity.prototype, "aadharNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address', type: 'text' }),
    __metadata("design:type", String)
], StaffEntity.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'joining_date', type: 'date' }),
    __metadata("design:type", Date)
], StaffEntity.prototype, "joiningDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'before_experience', type: 'int', comment: 'Experience in years' }),
    __metadata("design:type", Number)
], StaffEntity.prototype, "beforeExperience", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'basic_salary',
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: false,
    }),
    __metadata("design:type", Number)
], StaffEntity.prototype, "basicSalary", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.BranchEntity, (branchEntity) => branchEntity.staff),
    (0, typeorm_1.JoinColumn)({ name: 'branch_id' }),
    __metadata("design:type", branch_entity_1.BranchEntity)
], StaffEntity.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => appointement_entity_1.AppointmentEntity, (appointmentEntity) => appointmentEntity.staffId),
    __metadata("design:type", Array)
], StaffEntity.prototype, "appointment", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => attendence_entity_1.AttendanceEntity, (attendanceEntity) => attendanceEntity.staffId, {
        cascade: true,
        eager: true
    }),
    __metadata("design:type", Array)
], StaffEntity.prototype, "attendance", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => work_allocation_entity_1.WorkAllocationEntity, (workAllocationEntity) => workAllocationEntity.staffId),
    __metadata("design:type", Array)
], StaffEntity.prototype, "workAllocation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_assign_entity_1.ProductAssignEntity, (productAssignEntity) => productAssignEntity.staffId),
    __metadata("design:type", Array)
], StaffEntity.prototype, "productAssign", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => request_raise_entity_1.RequestRaiseEntity, (requestRaiseEntity) => requestRaiseEntity.staffId),
    __metadata("design:type", Array)
], StaffEntity.prototype, "request", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tickets_entity_1.TicketsEntity, (ticketsEntity) => ticketsEntity.staff),
    __metadata("design:type", Array)
], StaffEntity.prototype, "tickets", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'company_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], StaffEntity.prototype, "companyCode", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'unit_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], StaffEntity.prototype, "unitCode", void 0);
exports.StaffEntity = StaffEntity = __decorate([
    (0, typeorm_1.Entity)('staffs')
], StaffEntity);
//# sourceMappingURL=staff.entity.js.map