"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkAllocationAdapter = void 0;
const common_1 = require("@nestjs/common");
const work_allocation_entity_1 = require("./entity/work-allocation.entity");
const work_allocation_res_dto_1 = require("./dto/work-allocation-res.dto");
const client_entity_1 = require("../client/entity/client.entity");
const staff_entity_1 = require("../staff/entity/staff.entity");
const product_entity_1 = require("../product/entity/product.entity");
const vendor_entity_1 = require("../vendor/entity/vendor.entity");
const voucher_entity_1 = require("../voucher/entity/voucher.entity");
const branch_entity_1 = require("../branch/entity/branch.entity");
const estimate_entity_1 = require("../estimate/entity/estimate.entity");
let WorkAllocationAdapter = class WorkAllocationAdapter {
    convertDtoToEntity(dto) {
        const entity = new work_allocation_entity_1.WorkAllocationEntity();
        if (dto.id)
            entity.id = dto.id;
        const client = new client_entity_1.ClientEntity();
        client.id = dto.clientId;
        entity.clientId = client;
        entity.description = dto.description;
        const staff = new staff_entity_1.StaffEntity();
        staff.id = dto.staffId;
        entity.staffId = staff;
        const staffId = new staff_entity_1.StaffEntity();
        staffId.id = dto.sales_id;
        entity.salesStaffRelation = staff;
        entity.serviceOrProduct = dto.serviceOrProduct;
        entity.otherInformation = dto.otherInformation;
        entity.date = dto.date;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        entity.workAllocationNumber = dto.workAllocationNumber;
        const product = new product_entity_1.ProductEntity();
        product.id = dto.productId;
        entity.productId = product;
        const vendor = new vendor_entity_1.VendorEntity();
        vendor.id = dto.vendorId;
        entity.vendorId = vendor;
        const estimate = new estimate_entity_1.EstimateEntity();
        estimate.estimateId = dto.estimateId;
        entity.estimateId = estimate;
        const invoice = new estimate_entity_1.EstimateEntity();
        invoice.invoiceId = dto.invoiceId;
        entity.invoiceId = invoice;
        const branch = new branch_entity_1.BranchEntity();
        branch.id = dto.branchId;
        entity.branchId = branch;
        const voucher = new voucher_entity_1.VoucherEntity();
        voucher.id = dto.voucherId;
        entity.voucherId = voucher;
        entity.amount = dto.amount;
        entity.service = dto.service;
        entity.productName = dto.productName;
        entity.visitingNumber = dto.visitingNumber;
        entity.workStatus = dto.workStatus;
        return entity;
    }
    convertEntityToDto(entities) {
        return entities.map((entity) => {
            const client = entity.clientId;
            const staff = entity.staffId;
            const product = entity.productId;
            const vendor = entity.vendorId;
            const voucher = entity.voucherId;
            const invoice = entity.invoiceId;
            const estimate = entity.estimateId;
            ;
            return new work_allocation_res_dto_1.WorkAllocationResDto(entity.id, entity.workAllocationNumber, entity.otherInformation, entity.date, client?.id || 0, client?.name || '', client?.address || '', client?.phoneNumber || '', staff?.id || 0, staff?.name || '', entity.companyCode, entity.unitCode, product?.id || 0, entity?.productName || '', product?.inDate || null, product?.vendorId?.id || null, product?.categoryName || '', product?.productDescription || '', product?.vendorPhoneNumber || '', product?.vendorName || '', product?.vendorAddress || '', product?.vendorEmailId || '', voucher?.id || null, voucher?.name || '', entity.workStatus, entity.description, entity.amount, entity.branchId.id, entity.branchId.branchName, entity.service, entity.invoiceId.invoiceId, entity.estimateId.estimateId);
        });
    }
};
exports.WorkAllocationAdapter = WorkAllocationAdapter;
exports.WorkAllocationAdapter = WorkAllocationAdapter = __decorate([
    (0, common_1.Injectable)()
], WorkAllocationAdapter);
//# sourceMappingURL=work-allocation.adapter.js.map