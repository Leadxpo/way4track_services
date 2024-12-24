"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const vendor_entity_1 = require("./entity/vendor.entity");
const vendor_controller_1 = require("./vendor.controller");
const vendor_service_1 = require("./vendor.service");
const vendor_repo_1 = require("./repo/vendor.repo");
const vendor_adapter_1 = require("./vendor.adapter");
const product_module_1 = require("../product/product.module");
const branch_module_1 = require("../branch/branch.module");
const branch_repo_1 = require("../branch/repo/branch.repo");
let VendorModule = class VendorModule {
};
exports.VendorModule = VendorModule;
exports.VendorModule = VendorModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([vendor_entity_1.VendorEntity, vendor_repo_1.VendorRepository]),
            (0, common_1.forwardRef)(() => product_module_1.ProductModule),
            (0, common_1.forwardRef)(() => branch_module_1.BranchModule),
        ],
        controllers: [vendor_controller_1.VendorController],
        providers: [vendor_service_1.VendorService, vendor_adapter_1.VendorAdapter, vendor_repo_1.VendorRepository, branch_repo_1.BranchRepository],
        exports: [vendor_repo_1.VendorRepository, vendor_service_1.VendorService],
    })
], VendorModule);
//# sourceMappingURL=vendor.module.js.map