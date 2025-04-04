"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const client_entity_1 = require("./entity/client.entity");
const client_controller_1 = require("./client.controller");
const client_service_1 = require("./client.service");
const client_repo_1 = require("./repo/client.repo");
const client_adapter_1 = require("./client.adapter");
const branch_module_1 = require("../branch/branch.module");
let ClientModule = class ClientModule {
};
exports.ClientModule = ClientModule;
exports.ClientModule = ClientModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([client_entity_1.ClientEntity]),
            (0, common_1.forwardRef)(() => branch_module_1.BranchModule)],
        controllers: [client_controller_1.ClientController],
        providers: [client_service_1.ClientService, client_repo_1.ClientRepository, client_adapter_1.ClientAdapter],
        exports: [client_repo_1.ClientRepository, client_service_1.ClientService]
    })
], ClientModule);
//# sourceMappingURL=client.module.js.map