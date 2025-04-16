"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_1 = require("./entity/product.entity");
const product_controller_1 = require("./product.controller");
const product_service_1 = require("./product.service");
const product_repo_1 = require("./repo/product.repo");
const vendor_module_1 = require("../vendor/vendor.module");
const voucher_repo_1 = require("../voucher/repo/voucher.repo");
const product_type_module_1 = require("../product-type/product-type.module");
const branch_module_1 = require("../branch/branch.module");
const sub_dealer_module_1 = require("../sub-dealer/sub-dealer.module");
const staff_module_1 = require("../staff/staff.module");
let ProductModule = class ProductModule {
};
exports.ProductModule = ProductModule;
exports.ProductModule = ProductModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([product_entity_1.ProductEntity, voucher_repo_1.VoucherRepository]),
            (0, common_1.forwardRef)(() => vendor_module_1.VendorModule),
            (0, common_1.forwardRef)(() => product_type_module_1.ProductTypeModule),
            (0, common_1.forwardRef)(() => branch_module_1.BranchModule),
            (0, common_1.forwardRef)(() => sub_dealer_module_1.SubDealerModule),
            (0, common_1.forwardRef)(() => staff_module_1.StaffModule),
        ],
        controllers: [product_controller_1.ProductController],
        providers: [product_service_1.ProductService, product_repo_1.ProductRepository],
        exports: [product_service_1.ProductService, product_repo_1.ProductRepository],
    })
], ProductModule);
//# sourceMappingURL=product.module.js.map