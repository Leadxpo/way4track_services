"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssertModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const asserts_entity_1 = require("./entity/asserts-entity");
const asserts_controller_1 = require("./asserts.controller");
const asserts_service_1 = require("./asserts.service");
const asserts_adapter_1 = require("./asserts.adapter");
const asserts_repo_1 = require("./repo/asserts.repo");
const voucher_module_1 = require("../voucher/voucher-module");
const branch_module_1 = require("../branch/branch.module");
let AssertModule = class AssertModule {
};
exports.AssertModule = AssertModule;
exports.AssertModule = AssertModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([asserts_entity_1.AssertsEntity]),
            (0, common_1.forwardRef)(() => voucher_module_1.VoucherModule),
            (0, common_1.forwardRef)(() => branch_module_1.BranchModule)],
        controllers: [asserts_controller_1.AssertsController],
        providers: [asserts_service_1.AssertsService, asserts_adapter_1.AssertsAdapter, {
                provide: asserts_repo_1.AssertsRepository,
                useClass: asserts_repo_1.AssertsRepository,
            },],
        exports: [asserts_repo_1.AssertsRepository, asserts_service_1.AssertsService]
    })
], AssertModule);
//# sourceMappingURL=asserts.module.js.map