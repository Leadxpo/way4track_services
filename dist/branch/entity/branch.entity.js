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
exports.BranchEntity = void 0;
const appointement_entity_1 = require("../../appointment/entity/appointement.entity");
const asserts_entity_1 = require("../../asserts/entity/asserts-entity");
const attendence_entity_1 = require("../../attendence/entity/attendence.entity");
const client_entity_1 = require("../../client/entity/client.entity");
const product_assign_entity_1 = require("../../product-assign/entity/product-assign.entity");
const request_raise_entity_1 = require("../../request-raise/entity/request-raise.entity");
const staff_entity_1 = require("../../staff/entity/staff.entity");
const tickets_entity_1 = require("../../tickets/entity/tickets.entity");
const voucher_entity_1 = require("../../voucher/entity/voucher.entity");
const typeorm_1 = require("typeorm");
let BranchEntity = class BranchEntity {
};
exports.BranchEntity = BranchEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BranchEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], BranchEntity.prototype, "branchName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'branch_number', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], BranchEntity.prototype, "branchNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'branch_address', type: 'text', nullable: true }),
    __metadata("design:type", String)
], BranchEntity.prototype, "branchAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address_line1', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], BranchEntity.prototype, "addressLine1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address_line2', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], BranchEntity.prototype, "addressLine2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'city', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], BranchEntity.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'state', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], BranchEntity.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pincode', type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], BranchEntity.prototype, "pincode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'branch_opening', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], BranchEntity.prototype, "branchOpening", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email', type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], BranchEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'branch_photo', type: 'text', nullable: true }),
    __metadata("design:type", String)
], BranchEntity.prototype, "branchPhoto", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => asserts_entity_1.AssertsEntity, (asserts) => asserts.branchId),
    __metadata("design:type", Array)
], BranchEntity.prototype, "asserts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => client_entity_1.ClientEntity, (asserts) => asserts.branch),
    __metadata("design:type", Array)
], BranchEntity.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => staff_entity_1.StaffEntity, (asserts) => asserts.branch),
    __metadata("design:type", Array)
], BranchEntity.prototype, "staff", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => attendence_entity_1.AttendanceEntity, (asserts) => asserts.branchId),
    __metadata("design:type", Array)
], BranchEntity.prototype, "attendance", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_assign_entity_1.ProductAssignEntity, (asserts) => asserts.branchId),
    __metadata("design:type", Array)
], BranchEntity.prototype, "productAssign", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => voucher_entity_1.VoucherEntity, (voucherEntity) => voucherEntity.branchId),
    __metadata("design:type", Array)
], BranchEntity.prototype, "voucher", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => appointement_entity_1.AppointmentEntity, (appointmentEntity) => appointmentEntity.branchId),
    __metadata("design:type", Array)
], BranchEntity.prototype, "appointment", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => request_raise_entity_1.RequestRaiseEntity, (RequestRaiseEntity) => RequestRaiseEntity.branchId),
    __metadata("design:type", Array)
], BranchEntity.prototype, "request", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tickets_entity_1.TicketsEntity, (ticketsEntity) => ticketsEntity.branch),
    __metadata("design:type", Array)
], BranchEntity.prototype, "tickets", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'company_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], BranchEntity.prototype, "companyCode", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'unit_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], BranchEntity.prototype, "unitCode", void 0);
exports.BranchEntity = BranchEntity = __decorate([
    (0, typeorm_1.Entity)('branches')
], BranchEntity);
//# sourceMappingURL=branch.entity.js.map