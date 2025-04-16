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
exports.ProductEntity = void 0;
const estimate_entity_1 = require("../../estimate/entity/estimate.entity");
const product_assign_entity_1 = require("../../product-assign/entity/product-assign.entity");
const product_type_entity_1 = require("../../product-type/entity/product-type.entity");
const sales_man_entity_1 = require("../../sales-man/entity/sales-man.entity");
const technician_works_entity_1 = require("../../technician-works/entity/technician-works.entity");
const vendor_entity_1 = require("../../vendor/entity/vendor.entity");
const voucher_entity_1 = require("../../voucher/entity/voucher.entity");
const work_allocation_entity_1 = require("../../work-allocation/entity/work-allocation.entity");
const typeorm_1 = require("typeorm");
const product_status_enum_1 = require("../enum/product-status.enum");
const branch_entity_1 = require("../../branch/entity/branch.entity");
const sub_dealer_entity_1 = require("../../sub-dealer/entity/sub-dealer.entity");
const staff_entity_1 = require("../../staff/entity/staff.entity");
let ProductEntity = class ProductEntity extends typeorm_1.BaseEntity {
};
exports.ProductEntity = ProductEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProductEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_name', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "productName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_photo', type: 'text', nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "productPhoto", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'device_model', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "deviceModel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'in_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], ProductEntity.prototype, "inDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'imei_number', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "imeiNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category_name', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "categoryName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cost', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], ProductEntity.prototype, "cost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ProductEntity.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sno', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ProductEntity.prototype, "SNO", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_description', type: 'text', nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "productDescription", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vendor_entity_1.VendorEntity, (vendorEntity) => vendorEntity.product, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'vendor_id' }),
    __metadata("design:type", vendor_entity_1.VendorEntity)
], ProductEntity.prototype, "vendorId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_type_entity_1.ProductTypeEntity, (ProductTypeEntity) => ProductTypeEntity.productType, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'product_type_id' }),
    __metadata("design:type", product_type_entity_1.ProductTypeEntity)
], ProductEntity.prototype, "productTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_type', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "productType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vendor_phone_number', type: 'varchar', length: 15, nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "vendorPhoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vendor_name', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "vendorName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vendor_address', type: 'text', nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "vendorAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vendor_email_id', type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "vendorEmailId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => voucher_entity_1.VoucherEntity, (product) => product.product),
    __metadata("design:type", Array)
], ProductEntity.prototype, "voucherId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sales_man_entity_1.SalesWorksEntity, (product) => product.productId),
    __metadata("design:type", Array)
], ProductEntity.prototype, "sales", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_assign_entity_1.ProductAssignEntity, (product) => product.productId),
    __metadata("design:type", Array)
], ProductEntity.prototype, "productAssign", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => work_allocation_entity_1.WorkAllocationEntity, (product) => product.productId),
    __metadata("design:type", Array)
], ProductEntity.prototype, "workAllocation", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'company_code', length: 20, nullable: true, default: 'WAY4TRACK' }),
    __metadata("design:type", String)
], ProductEntity.prototype, "companyCode", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'unit_code', length: 20, nullable: true, default: 'WAY4' }),
    __metadata("design:type", String)
], ProductEntity.prototype, "unitCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_name', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "supplierName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ICCID_No', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "ICCIDNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'serial_number', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "serialNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'primary_no', type: 'varchar', length: 15, nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "primaryNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'secondary_no', type: 'varchar', length: 15, nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "secondaryNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'primary_network', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "primaryNetwork", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'secondary_network', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "secondaryNetwork", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sim_status', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "simStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'plan_name', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "planName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'remarks_1', type: 'text', nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "remarks1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'remarks_2', type: 'text', nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "remarks2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'remarks_3', type: 'text', nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "remarks3", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => estimate_entity_1.EstimateEntity, (estimate) => estimate.products, { nullable: true }),
    __metadata("design:type", estimate_entity_1.EstimateEntity)
], ProductEntity.prototype, "estimate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', name: 'hsn_code', nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "hsnCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location', type: 'varchar', length: 50, default: 'warehouse' }),
    __metadata("design:type", String)
], ProductEntity.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'varchar', length: 50, default: 'not_assigned' }),
    __metadata("design:type", String)
], ProductEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mobile_number', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "mobileNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sim_no', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "simNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sim_imsi', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "simImsi", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'basket_name', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "basketName", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => technician_works_entity_1.TechnicianWorksEntity, (TechnicianWorksEntity) => TechnicianWorksEntity.productId),
    __metadata("design:type", Array)
], ProductEntity.prototype, "technician", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_status', type: 'enum', enum: product_status_enum_1.ProductStatusEnum, default: product_status_enum_1.ProductStatusEnum.available }),
    __metadata("design:type", String)
], ProductEntity.prototype, "productStatus", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.BranchEntity, (branchEntity) => branchEntity.product, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'branch_id' }),
    __metadata("design:type", branch_entity_1.BranchEntity)
], ProductEntity.prototype, "branchId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sub_dealer_entity_1.SubDealerEntity, (sub) => sub.product, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'sub_dealer_id' }),
    __metadata("design:type", sub_dealer_entity_1.SubDealerEntity)
], ProductEntity.prototype, "subDealerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.StaffEntity, (staffEntity) => staffEntity.product, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'staff_id' }),
    __metadata("design:type", staff_entity_1.StaffEntity)
], ProductEntity.prototype, "staffId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'assign_time', type: 'timestamp', nullable: true, }),
    __metadata("design:type", Date)
], ProductEntity.prototype, "assignTime", void 0);
exports.ProductEntity = ProductEntity = __decorate([
    (0, typeorm_1.Entity)('products')
], ProductEntity);
//# sourceMappingURL=product.entity.js.map