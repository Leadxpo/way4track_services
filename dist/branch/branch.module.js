"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const branch_entity_1 = require("./entity/branch.entity");
const branch_controller_1 = require("./branch.controller");
const branch_service_1 = require("./branch.service");
const branch_repo_1 = require("./repo/branch.repo");
const branch_adapter_1 = require("./branch.adapter");
const platform_express_1 = require("@nestjs/platform-express");
let BranchModule = class BranchModule {
};
exports.BranchModule = BranchModule;
exports.BranchModule = BranchModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([branch_entity_1.BranchEntity]), platform_express_1.MulterModule.register({
                dest: './uploads',
            }),],
        controllers: [branch_controller_1.BranchController],
        providers: [branch_service_1.BranchService, branch_repo_1.BranchRepository, branch_adapter_1.BranchAdapter],
        exports: [branch_repo_1.BranchRepository, branch_service_1.BranchService],
    })
], BranchModule);
//# sourceMappingURL=branch.module.js.map