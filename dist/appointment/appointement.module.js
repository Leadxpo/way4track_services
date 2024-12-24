"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const appointement_entity_1 = require("./entity/appointement.entity");
const appointement_adapter_1 = require("./appointement.adapter");
const appointment_service_1 = require("./appointment.service");
const appointment_controller_1 = require("./appointment.controller");
const appointement_repo_1 = require("./repo/appointement.repo");
let AppointmentModule = class AppointmentModule {
};
exports.AppointmentModule = AppointmentModule;
exports.AppointmentModule = AppointmentModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([appointement_entity_1.AppointmentEntity])],
        providers: [appointment_service_1.AppointmentService, appointement_adapter_1.AppointmentAdapter, appointement_repo_1.AppointmentRepository],
        controllers: [appointment_controller_1.AppointmentController],
        exports: [appointement_repo_1.AppointmentRepository, appointment_service_1.AppointmentService]
    })
], AppointmentModule);
//# sourceMappingURL=appointement.module.js.map