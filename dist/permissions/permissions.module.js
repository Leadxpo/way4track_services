"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const permissions_entity_1 = require("./entity/permissions.entity");
const permissions_controller_1 = require("./permissions.controller");
const permissions_services_1 = require("./permissions.services");
const permissions_repo_1 = require("./repo/permissions.repo");
const permissions_adapter_1 = require("./permissions.adapter");
const staff_module_1 = require("../staff/staff.module");
const designation_module_1 = require("../designation/designation.module");
let PermissionModule = class PermissionModule {
};
exports.PermissionModule = PermissionModule;
exports.PermissionModule = PermissionModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([permissions_entity_1.PermissionEntity]),
            (0, common_1.forwardRef)(() => staff_module_1.StaffModule),
            (0, common_1.forwardRef)(() => designation_module_1.DesignationModule),
        ],
        controllers: [permissions_controller_1.PermissionsController],
        providers: [permissions_services_1.PermissionsService, permissions_repo_1.PermissionRepository, permissions_adapter_1.PermissionAdapter],
        exports: [permissions_repo_1.PermissionRepository, permissions_services_1.PermissionsService],
    })
], PermissionModule);
//# sourceMappingURL=permissions.module.js.map