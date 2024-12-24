"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstimateModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const estimate_entity_1 = require("./entity/estimate.entity");
const estimate_controller_1 = require("./estimate.controller");
const estimate_service_1 = require("./estimate.service");
const estimate_repo_1 = require("./repo/estimate.repo");
const estimate_adapter_1 = require("./estimate.adapter");
const client_module_1 = require("../client/client.module");
let EstimateModule = class EstimateModule {
};
exports.EstimateModule = EstimateModule;
exports.EstimateModule = EstimateModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([estimate_entity_1.EstimateEntity]),
            (0, common_1.forwardRef)(() => client_module_1.ClientModule)],
        controllers: [estimate_controller_1.EstimateController],
        providers: [estimate_service_1.EstimateService, estimate_repo_1.EstimateRepository, estimate_adapter_1.EstimateAdapter],
        exports: [estimate_repo_1.EstimateRepository, estimate_service_1.EstimateService]
    })
], EstimateModule);
//# sourceMappingURL=estimate.module.js.map