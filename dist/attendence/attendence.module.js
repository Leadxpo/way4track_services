"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const staff_entity_1 = require("../staff/entity/staff.entity");
const branch_entity_1 = require("../branch/entity/branch.entity");
const attendence_entity_1 = require("./entity/attendence.entity");
const attendence_controller_1 = require("./attendence.controller");
const attendence_service_1 = require("./attendence.service");
const attendence_repo_1 = require("./repo/attendence.repo");
const branch_module_1 = require("../branch/branch.module");
const staff_module_1 = require("../staff/staff.module");
const attendence_adapter_1 = require("./attendence.adapter");
let AttendanceModule = class AttendanceModule {
};
exports.AttendanceModule = AttendanceModule;
exports.AttendanceModule = AttendanceModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([attendence_entity_1.AttendanceEntity, staff_entity_1.StaffEntity, branch_entity_1.BranchEntity]),
            (0, common_1.forwardRef)(() => branch_module_1.BranchModule),
            (0, common_1.forwardRef)(() => staff_module_1.StaffModule),
        ],
        controllers: [attendence_controller_1.AttendanceController],
        providers: [attendence_service_1.AttendanceService, attendence_repo_1.AttendenceRepository, attendence_adapter_1.AttendanceAdapter],
        exports: [attendence_repo_1.AttendenceRepository, attendence_service_1.AttendanceService]
    })
], AttendanceModule);
//# sourceMappingURL=attendence.module.js.map