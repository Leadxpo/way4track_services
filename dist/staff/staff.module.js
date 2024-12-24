"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const staff_entity_1 = require("./entity/staff.entity");
const staff_controller_1 = require("./staff.controller");
const staff_repo_1 = require("./repo/staff-repo");
const staff_services_1 = require("./staff-services");
const staff_adaptert_1 = require("./staff.adaptert");
const attendence_module_1 = require("../attendence/attendence.module");
const staff_dashboard_service_1 = require("../dashboard/staff-dashboard.service");
let StaffModule = class StaffModule {
};
exports.StaffModule = StaffModule;
exports.StaffModule = StaffModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([staff_entity_1.StaffEntity]),
            (0, common_1.forwardRef)(() => attendence_module_1.AttendanceModule)],
        controllers: [staff_controller_1.StaffController],
        providers: [staff_services_1.StaffService, staff_repo_1.StaffRepository, staff_adaptert_1.StaffAdapter, staff_dashboard_service_1.StaffDashboardService],
        exports: [staff_repo_1.StaffRepository, staff_services_1.StaffService, staff_dashboard_service_1.StaffDashboardService]
    })
], StaffModule);
//# sourceMappingURL=staff.module.js.map