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
exports.EstimateEntity = void 0;
const client_entity_1 = require("../../client/entity/client.entity");
const typeorm_1 = require("typeorm");
let EstimateEntity = class EstimateEntity extends typeorm_1.BaseEntity {
};
exports.EstimateEntity = EstimateEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], EstimateEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => client_entity_1.ClientEntity, (ClientEntity) => ClientEntity.workAllocation),
    (0, typeorm_1.JoinColumn)({ name: 'client_id' }),
    __metadata("design:type", client_entity_1.ClientEntity)
], EstimateEntity.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'building_address' }),
    __metadata("design:type", String)
], EstimateEntity.prototype, "buildingAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', name: 'estimate_date' }),
    __metadata("design:type", String)
], EstimateEntity.prototype, "estimateDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', name: 'estimate_id' }),
    __metadata("design:type", String)
], EstimateEntity.prototype, "estimateId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', name: 'expire_date' }),
    __metadata("design:type", String)
], EstimateEntity.prototype, "expireDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, name: 'product_or_service' }),
    __metadata("design:type", String)
], EstimateEntity.prototype, "productOrService", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'description' }),
    __metadata("design:type", String)
], EstimateEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', name: 'amount' }),
    __metadata("design:type", Number)
], EstimateEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)('json', { nullable: true, name: 'products' }),
    __metadata("design:type", Array)
], EstimateEntity.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'company_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], EstimateEntity.prototype, "companyCode", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'unit_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], EstimateEntity.prototype, "unitCode", void 0);
exports.EstimateEntity = EstimateEntity = __decorate([
    (0, typeorm_1.Entity)('estimates')
], EstimateEntity);
//# sourceMappingURL=estimate.entity.js.map