"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoucherModule = void 0;
const common_1 = require("@nestjs/common");
const voucher_repo_1 = require("./repo/voucher.repo");
const typeorm_1 = require("@nestjs/typeorm");
const voucher_entity_1 = require("./entity/voucher.entity");
const voucher_controller_1 = require("./voucher-controller");
const voucher_service_1 = require("./voucher-service");
const voucher_adapter_1 = require("./voucher.adapter");
const branch_module_1 = require("../branch/branch.module");
const vendor_module_1 = require("../vendor/vendor.module");
const sub_dealer_module_1 = require("../sub-dealer/sub-dealer.module");
const client_module_1 = require("../client/client.module");
const account_module_1 = require("../account/account.module");
const estimate_module_1 = require("../estimate/estimate.module");
const emi_payment_repo_1 = require("./repo/emi-payment-repo");
const product_module_1 = require("../product/product.module");
const ledger_module_1 = require("../ledger/ledger.module");
let VoucherModule = class VoucherModule {
};
exports.VoucherModule = VoucherModule;
exports.VoucherModule = VoucherModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([voucher_entity_1.VoucherEntity, voucher_repo_1.VoucherRepository]),
            (0, common_1.forwardRef)(() => branch_module_1.BranchModule),
            (0, common_1.forwardRef)(() => vendor_module_1.VendorModule),
            (0, common_1.forwardRef)(() => sub_dealer_module_1.SubDealerModule),
            (0, common_1.forwardRef)(() => client_module_1.ClientModule),
            (0, common_1.forwardRef)(() => account_module_1.AccountModule),
            (0, common_1.forwardRef)(() => estimate_module_1.EstimateModule),
            (0, common_1.forwardRef)(() => ledger_module_1.LedgerModule),
            (0, common_1.forwardRef)(() => product_module_1.ProductModule)
        ],
        controllers: [voucher_controller_1.VoucherController],
        providers: [voucher_service_1.VoucherService, voucher_adapter_1.VoucherAdapter, voucher_repo_1.VoucherRepository, emi_payment_repo_1.EmiPaymentRepository],
        exports: [voucher_repo_1.VoucherRepository, voucher_service_1.VoucherService],
    })
], VoucherModule);
//# sourceMappingURL=voucher-module.js.map