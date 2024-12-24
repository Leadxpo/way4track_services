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
    (0, typeorm_1.Column)({ name: 'gst_number', type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], SubDealerEntity.prototype, "gstNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'starting_date', type: 'date' }),
    __metadata("design:type", Date)
], SubDealerEntity.prototype, "startingDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], SubDealerEntity.prototype, "emailId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'aadhar_number', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], SubDealerEntity.prototype, "aadharNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address', type: 'text' }),
    __metadata("design:type", String)
], SubDealerEntity.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => voucher_entity_1.VoucherEntity, (VoucherEntity) => VoucherEntity.subDealer),
    (0, typeorm_1.JoinColumn)({ name: 'voucher_id' }),
    __metadata("design:type", voucher_entity_1.VoucherEntity)
], SubDealerEntity.prototype, "voucherId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'company_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], SubDealerEntity.prototype, "companyCode", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'unit_code', length: 20, nullable: false }),
    __metadata("design:type", String)
], SubDealerEntity.prototype, "unitCode", void 0);
exports.SubDealerEntity = SubDealerEntity = __decorate([
    (0, typeorm_1.Entity)('sub_dealer')
], SubDealerEntity);
//# sourceMappingURL=sub-dealer.entity.js.map