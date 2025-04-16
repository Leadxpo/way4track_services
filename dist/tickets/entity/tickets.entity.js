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
exports.TicketsEntity = exports.AddressingDepartment = void 0;
const branch_entity_1 = require("../../branch/entity/branch.entity");
const designation_entity_1 = require("../../designation/entity/designation.entity");
const staff_entity_1 = require("../../staff/entity/staff.entity");
const sub_dealer_entity_1 = require("../../sub-dealer/entity/sub-dealer.entity");
const work_status_enum_1 = require("../../work-allocation/enum/work-status-enum");
const typeorm_1 = require("typeorm");
var AddressingDepartment;
(function (AddressingDepartment) {
    AddressingDepartment["CEO"] = "CEO";
    AddressingDepartment["HR"] = "HR";
    AddressingDepartment["Accountant"] = "Accountant";
    AddressingDepartment["Operator"] = "Operator";
    AddressingDepartment["WarehouseManager"] = "Warehouse Manager";
    AddressingDepartment["BranchManager"] = "Branch Manager";
    AddressingDepartment["SubDealer"] = "Sub Dealer";
    AddressingDepartment["Technician"] = "Technician";
    AddressingDepartment["SalesMan"] = "Sales Man";
    AddressingDepartment["CallCenter"] = "Call Center";
})(AddressingDepartment || (exports.AddressingDepartment = AddressingDepartment = {}));
let TicketsEntity = class TicketsEntity {
};
exports.TicketsEntity = TicketsEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TicketsEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.StaffEntity, (branchEntity) => branchEntity.tickets, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'staff_id' }),
    __metadata("design:type", staff_entity_1.StaffEntity)
], TicketsEntity.prototype, "staff", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'problem', type: 'text', nullable: true }),
    __metadata("design:type", String)
], TicketsEntity.prototype, "problem", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], TicketsEntity.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.BranchEntity, (branchEntity) => branchEntity.tickets),
    (0, typeorm_1.JoinColumn)({ name: 'branch_id' }),
    __metadata("design:type", branch_entity_1.BranchEntity)
], TicketsEntity.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ticket_number', type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], TicketsEntity.prototype, "ticketNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'text', nullable: true }),
    __metadata("design:type", String)
], TicketsEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: work_status_enum_1.WorkStatusEnum, name: 'work_status', default: work_status_enum_1.WorkStatusEnum.PENDING, nullable: true }),
    __metadata("design:type", String)
], TicketsEntity.prototype, "workStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'addressing_department',
        type: 'enum',
        enum: AddressingDepartment,
        default: AddressingDepartment.CEO
    }),
    __metadata("design:type", String)
], TicketsEntity.prototype, "addressingDepartment", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'company_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], TicketsEntity.prototype, "companyCode", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'unit_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], TicketsEntity.prototype, "unitCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], TicketsEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], TicketsEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sub_dealer_entity_1.SubDealerEntity, (requestRaiseEntity) => requestRaiseEntity.tickets, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'sub_dealer_id' }),
    __metadata("design:type", sub_dealer_entity_1.SubDealerEntity)
], TicketsEntity.prototype, "subDealerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => designation_entity_1.DesignationEntity, (designation) => designation.ticket, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'designation_id', referencedColumnName: 'id' }),
    __metadata("design:type", designation_entity_1.DesignationEntity)
], TicketsEntity.prototype, "designationRelation", void 0);
exports.TicketsEntity = TicketsEntity = __decorate([
    (0, typeorm_1.Entity)('tickets')
], TicketsEntity);
//# sourceMappingURL=tickets.entity.js.map