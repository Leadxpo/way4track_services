"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkAllocationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const work_allocation_entity_1 = require("./entity/work-allocation.entity");
const work_allocation_service_1 = require("./work-allocation.service");
const work_allocation_controller_1 = require("./work-allocation.controller");
const work_allocation_adapter_1 = require("./work-allocation.adapter");
const work_allocation_repo_1 = require("./repo/work-allocation.repo");
let WorkAllocationModule = class WorkAllocationModule {
};
exports.WorkAllocationModule = WorkAllocationModule;
exports.WorkAllocationModule = WorkAllocationModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([work_allocation_entity_1.WorkAllocationEntity])],
        controllers: [work_allocation_controller_1.WorkAllocationController],
        providers: [work_allocation_service_1.WorkAllocationService, work_allocation_adapter_1.WorkAllocationAdapter, work_allocation_repo_1.WorkAllocationRepository],
        exports: [work_allocation_repo_1.WorkAllocationRepository, work_allocation_service_1.WorkAllocationService]
    })
], WorkAllocationModule);
//# sourceMappingURL=work-allocation.module.js.map