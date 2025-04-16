"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestRaiseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const request_raise_entity_1 = require("./entity/request-raise.entity");
const request_raise_controller_1 = require("./request-raise.controller");
const request_raise_service_1 = require("./request-raise.service");
const request_raise_repo_1 = require("./repo/request-raise.repo");
const request_raise_adapter_1 = require("./request-raise.adapter");
const notification_module_1 = require("../notifications/notification.module");
const branch_module_1 = require("../branch/branch.module");
let RequestRaiseModule = class RequestRaiseModule {
};
exports.RequestRaiseModule = RequestRaiseModule;
exports.RequestRaiseModule = RequestRaiseModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([request_raise_entity_1.RequestRaiseEntity]),
            (0, common_1.forwardRef)(() => notification_module_1.NotificationModule),
            (0, common_1.forwardRef)(() => branch_module_1.BranchModule)],
        controllers: [request_raise_controller_1.RequestRaiseController],
        providers: [request_raise_service_1.RequestRaiseService, request_raise_repo_1.RequestRaiseRepository, request_raise_adapter_1.RequestRaiseAdapter],
        exports: [request_raise_repo_1.RequestRaiseRepository, request_raise_service_1.RequestRaiseService]
    })
], RequestRaiseModule);
//# sourceMappingURL=request-raise.module.js.map