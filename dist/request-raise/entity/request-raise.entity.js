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
exports.RequestRaiseEntity = exports.RequestType = void 0;
const branch_entity_1 = require("../../branch/entity/branch.entity");
const client_status_enum_1 = require("../../client/enum/client-status.enum");
const notification_entity_1 = require("../../notifications/entity/notification.entity");
const product_assign_entity_1 = require("../../product-assign/entity/product-assign.entity");
const staff_entity_1 = require("../../staff/entity/staff.entity");
const sub_dealer_entity_1 = require("../../sub-dealer/entity/sub-dealer.entity");
const typeorm_1 = require("typeorm");
var RequestType;
(function (RequestType) {
    RequestType["assets"] = "assets";
    RequestType["money"] = "money";
    RequestType["products"] = "products";
    RequestType["personal"] = "personal";
    RequestType["leave_request"] = "leaveRequest";
})(RequestType || (exports.RequestType = RequestType = {}));
let RequestRaiseEntity = class RequestRaiseEntity extends typeorm_1.BaseEntity {
};
exports.RequestRaiseEntity = RequestRaiseEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RequestRaiseEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'request_id', type: 'varchar', unique: true }),
    __metadata("design:type", String)
], RequestRaiseEntity.prototype, "requestId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'request_type', type: 'enum', enum: RequestType, default: RequestType.money }),
    __metadata("design:type", String)
], RequestRaiseEntity.prototype, "requestType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: client_status_enum_1.ClientStatusEnum, default: client_status_enum_1.ClientStatusEnum.pending }),
    __metadata("design:type", String)
], RequestRaiseEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.StaffEntity, (staffEntity) => staffEntity.request),
    (0, typeorm_1.JoinColumn)({ name: 'staff_id' }),
    __metadata("design:type", staff_entity_1.StaffEntity)
], RequestRaiseEntity.prototype, "staffId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.StaffEntity, (account) => account.staffFrom, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'request_from' }),
    __metadata("design:type", staff_entity_1.StaffEntity)
], RequestRaiseEntity.prototype, "requestFrom", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.StaffEntity, (account) => account.staffTo, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'request_to' }),
    __metadata("design:type", staff_entity_1.StaffEntity)
], RequestRaiseEntity.prototype, "requestTo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sub_dealer_entity_1.SubDealerEntity, (staffEntity) => staffEntity.request, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'sub_dealer_id' }),
    __metadata("design:type", sub_dealer_entity_1.SubDealerEntity)
], RequestRaiseEntity.prototype, "subDealerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'text' }),
    __metadata("design:type", String)
], RequestRaiseEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'request_for', type: 'text', nullable: true }),
    __metadata("design:type", String)
], RequestRaiseEntity.prototype, "requestFor", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], RequestRaiseEntity.prototype, "createdDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], RequestRaiseEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], RequestRaiseEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_assign_entity_1.ProductAssignEntity, (ProductAssignEntity) => ProductAssignEntity.requestId),
    __metadata("design:type", Array)
], RequestRaiseEntity.prototype, "productAssign", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.BranchEntity, (branchEntity) => branchEntity.request),
    (0, typeorm_1.JoinColumn)({ name: 'branch_id' }),
    __metadata("design:type", branch_entity_1.BranchEntity)
], RequestRaiseEntity.prototype, "branchId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'company_code', length: 200, nullable: false }),
    __metadata("design:type", String)
], RequestRaiseEntity.prototype, "companyCode", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'unit_code', length: 200, nullable: false }),
    __metadata("design:type", String)
], RequestRaiseEntity.prototype, "unitCode", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notification_entity_1.NotificationEntity, (NotificationEntity) => NotificationEntity.request),
    __metadata("design:type", Array)
], RequestRaiseEntity.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', name: 'products', nullable: true }),
    __metadata("design:type", Array)
], RequestRaiseEntity.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'from_date', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], RequestRaiseEntity.prototype, "fromDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'to_date', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], RequestRaiseEntity.prototype, "toDate", void 0);
exports.RequestRaiseEntity = RequestRaiseEntity = __decorate([
    (0, typeorm_1.Entity)('requests')
], RequestRaiseEntity);
//# sourceMappingURL=request-raise.entity.js.map