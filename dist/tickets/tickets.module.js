"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const tickets_controller_1 = require("./tickets.controller");
const tickets_adapter_1 = require("./tickets.adapter");
const tickets_entity_1 = require("./entity/tickets.entity");
const tickets_services_1 = require("./tickets.services");
const tickets_repo_1 = require("./repo/tickets.repo");
let TicketsModule = class TicketsModule {
};
exports.TicketsModule = TicketsModule;
exports.TicketsModule = TicketsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([tickets_entity_1.TicketsEntity])],
        controllers: [tickets_controller_1.TicketsController],
        providers: [tickets_services_1.TicketsService, tickets_adapter_1.TicketsAdapter, tickets_repo_1.TicketsRepository],
        exports: [tickets_repo_1.TicketsRepository, tickets_services_1.TicketsService]
    })
], TicketsModule);
//# sourceMappingURL=tickets.module.js.map