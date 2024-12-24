"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubDealerModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const sub_dealer_entity_1 = require("./entity/sub-dealer.entity");
const sub_dealer_controller_1 = require("./sub-dealer.controller");
const sub_dealer_service_1 = require("./sub-dealer.service");
const sub_dealer_repo_1 = require("./repo/sub-dealer.repo");
const sub_dealer_adapter_1 = require("./sub-dealer.adapter");
const voucher_module_1 = require("../voucher/voucher-module");
let SubDealerModule = class SubDealerModule {
};
exports.SubDealerModule = SubDealerModule;
exports.SubDealerModule = SubDealerModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([sub_dealer_entity_1.SubDealerEntity]),
            (0, common_1.forwardRef)(() => voucher_module_1.VoucherModule)],
        controllers: [sub_dealer_controller_1.SubDealerController],
        providers: [sub_dealer_service_1.SubDealerService, sub_dealer_repo_1.SubDealerRepository, sub_dealer_adapter_1.SubDealerAdapter],
        exports: [sub_dealer_service_1.SubDealerService, sub_dealer_repo_1.SubDealerRepository]
    })
], SubDealerModule);
//# sourceMappingURL=sub-dealer.module.js.map