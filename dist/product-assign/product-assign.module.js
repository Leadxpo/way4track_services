"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductAssignModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const product_assign_entity_1 = require("./entity/product-assign.entity");
const product_assign_controller_1 = require("./product-assign.controller");
const product_assign_service_1 = require("./product-assign.service");
const product_assign_repo_1 = require("./repo/product-assign.repo");
const product_assign_adapter_1 = require("./product-assign.adapter");
const branch_module_1 = require("../branch/branch.module");
const staff_module_1 = require("../staff/staff.module");
const product_module_1 = require("../product/product.module");
const sub_dealer_module_1 = require("../sub-dealer/sub-dealer.module");
let ProductAssignModule = class ProductAssignModule {
};
exports.ProductAssignModule = ProductAssignModule;
exports.ProductAssignModule = ProductAssignModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([product_assign_entity_1.ProductAssignEntity]),
            (0, common_1.forwardRef)(() => branch_module_1.BranchModule),
            (0, common_1.forwardRef)(() => staff_module_1.StaffModule),
            (0, common_1.forwardRef)(() => sub_dealer_module_1.SubDealerModule),
            (0, common_1.forwardRef)(() => product_module_1.ProductModule)],
        controllers: [product_assign_controller_1.ProductAssignController],
        providers: [product_assign_service_1.ProductAssignService, product_assign_repo_1.ProductAssignRepository, product_assign_adapter_1.ProductAssignAdapter],
        exports: [product_assign_repo_1.ProductAssignRepository, product_assign_service_1.ProductAssignService]
    })
], ProductAssignModule);
//# sourceMappingURL=product-assign.module.js.map