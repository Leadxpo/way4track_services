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
exports.TicketsEntity = void 0;
const branch_entity_1 = require("../../branch/entity/branch.entity");
const staff_entity_1 = require("../../staff/entity/staff.entity");
const typeorm_1 = require("typeorm");
const tickets_enum_1 = require("../enum/tickets.enum");
let TicketsEntity = class TicketsEntity {
};
exports.TicketsEntity = TicketsEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TicketsEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.StaffEntity, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'staff_id' }),
    __metadata("design:type", staff_entity_1.StaffEntity)
], TicketsEntity.prototype, "staff", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'problem', type: 'text' }),
    __metadata("design:type", String)
], TicketsEntity.prototype, "problem", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date', type: 'date' }),
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
    (0, typeorm_1.Column)({
        name: 'addressing_department',
        type: 'enum',
        enum: tickets_enum_1.AddressingDepartment,
        default: tickets_enum_1.AddressingDepartment.HR
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
exports.TicketsEntity = TicketsEntity = __decorate([
    (0, typeorm_1.Entity)('tickets')
], TicketsEntity);
//# sourceMappingURL=tickets.entity.js.map