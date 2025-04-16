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
exports.SubDealerEntity = void 0;
const branch_entity_1 = require("../../branch/entity/branch.entity");
const dispatch_entity_1 = require("../../dispatch/entity/dispatch.entity");
const ledger_entity_1 = require("../../ledger/entity/ledger.entity");
const notification_entity_1 = require("../../notifications/entity/notification.entity");
const permissions_entity_1 = require("../../permissions/entity/permissions.entity");
const product_assign_entity_1 = require("../../product-assign/entity/product-assign.entity");
const product_entity_1 = require("../../product/entity/product.entity");
const request_raise_entity_1 = require("../../request-raise/entity/request-raise.entity");
const sub_dealer_staff_entity_1 = require("../../sub-dealer-staff/entity/sub-dealer-staff.entity");
const technician_works_entity_1 = require("../../technician-works/entity/technician-works.entity");
const tickets_entity_1 = require("../../tickets/entity/tickets.entity");
const voucher_entity_1 = require("../../voucher/entity/voucher.entity");
const typeorm_1 = require("typeorm");
let SubDealerEntity = class SubDealerEntity {
};
exports.SubDealerEntity = SubDealerEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),
    __metadata("design:type", Number)
], SubDealerEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], SubDealerEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sub_dealer_photo', type: 'text', nullable: true }),
    __metadata("design:type", String)
], SubDealerEntity.prototype, "subDealerPhoto", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sub_dealer_id', type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], SubDealerEntity.prototype, "subDealerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password', type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], SubDealerEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sub_dealer_phone_number', type: 'varchar', length: 15 }),
    __metadata("design:type", String)
], SubDealerEntity.prototype, "subDealerPhoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'alternate_phone_number', type: 'varchar', length: 15, nullable: true }),
    __metadata("design:type", String)
], SubDealerEntity.prototype, "alternatePhoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gst_number', type: 'varchar', length: 20, unique: true, nullable: true }),
    __metadata("design:type", String)
], SubDealerEntity.prototype, "gstNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'starting_date', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], SubDealerEntity.prototype, "startingDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], SubDealerEntity.prototype, "emailId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'aadhar_number', type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], SubDealerEntity.prototype, "aadharNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address', type: 'text' }),
    __metadata("design:type", String)
], SubDealerEntity.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => voucher_entity_1.VoucherEntity, (product) => product.subDealer),
    __metadata("design:type", Array)
], SubDealerEntity.prototype, "voucherId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => request_raise_entity_1.RequestRaiseEntity, (product) => product.subDealerId),
    __metadata("design:type", Array)
], SubDealerEntity.prototype, "request", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tickets_entity_1.TicketsEntity, (product) => product.subDealerId),
    __metadata("design:type", Array)
], SubDealerEntity.prototype, "tickets", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.BranchEntity, (BranchEntity) => BranchEntity.subDealer, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'branch_id' }),
    __metadata("design:type", branch_entity_1.BranchEntity)
], SubDealerEntity.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'company_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], SubDealerEntity.prototype, "companyCode", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'unit_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], SubDealerEntity.prototype, "unitCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], SubDealerEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], SubDealerEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => permissions_entity_1.PermissionEntity, (PermissionEntity) => PermissionEntity.subDealerId),
    __metadata("design:type", Array)
], SubDealerEntity.prototype, "permissions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ledger_entity_1.LedgerEntity, (LedgerEntity) => LedgerEntity.subDealerId),
    __metadata("design:type", Array)
], SubDealerEntity.prototype, "ledger", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => dispatch_entity_1.DispatchEntity, (DispatchEntity) => DispatchEntity.subDealerId),
    __metadata("design:type", Array)
], SubDealerEntity.prototype, "dispatch", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_assign_entity_1.ProductAssignEntity, (ProductAssignEntity) => ProductAssignEntity.subDealerId),
    __metadata("design:type", Array)
], SubDealerEntity.prototype, "productAssign", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => technician_works_entity_1.TechnicianWorksEntity, (TechnicianWorksEntity) => TechnicianWorksEntity.subDealerId),
    __metadata("design:type", Array)
], SubDealerEntity.prototype, "techWork", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sub_dealer_staff_entity_1.SubDelaerStaffEntity, (SubDelaerStaffEntity) => SubDelaerStaffEntity.subDealerId),
    __metadata("design:type", Array)
], SubDealerEntity.prototype, "subDealerStaff", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notification_entity_1.NotificationEntity, (NotificationEntity) => NotificationEntity.subDealerId),
    __metadata("design:type", Array)
], SubDealerEntity.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_entity_1.ProductEntity, (asserts) => asserts.subDealerId),
    __metadata("design:type", Array)
], SubDealerEntity.prototype, "product", void 0);
exports.SubDealerEntity = SubDealerEntity = __decorate([
    (0, typeorm_1.Entity)('sub_dealer')
], SubDealerEntity);
//# sourceMappingURL=sub-dealer.entity.js.map