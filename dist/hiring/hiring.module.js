"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HiringModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const hiring_entity_1 = require("./entity/hiring.entity");
const hiring_service_1 = require("./hiring.service");
const hiring_controller_1 = require("./hiring.controller");
const hiring_adapter_1 = require("./hiring.adapter");
const hiring_repo_1 = require("./repo/hiring.repo");
let HiringModule = class HiringModule {
};
exports.HiringModule = HiringModule;
exports.HiringModule = HiringModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([hiring_entity_1.HiringEntity])],
        providers: [hiring_service_1.HiringService, hiring_adapter_1.HiringAdapter, hiring_repo_1.HiringRepository],
        controllers: [hiring_controller_1.HiringController],
        exports: [hiring_repo_1.HiringRepository, hiring_service_1.HiringService]
    })
], HiringModule);
//# sourceMappingURL=hiring.module.js.map