"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const appointement_entity_1 = require("../entity/appointement.entity");
let AppointmentRepository = class AppointmentRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(appointement_entity_1.AppointmentEntity, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async getAllAppointmentDetails(req) {
        const groupedBranches = await this.createQueryBuilder('appointment')
            .select([
            'branch.name AS branchName',
            'COUNT(appointment.id) AS totalAppointments',
        ])
            .leftJoin('appointment.branchId', 'branch')
            .where(`appointment.company_code = "${req.companyCode}"`)
            .andWhere(`appointment.unit_code = "${req.unitCode}"`)
            .groupBy('branch.name')
            .orderBy('branch.name', 'ASC')
            .getRawMany();
        const appointments = await this.createQueryBuilder('appointment')
            .select([
            'appointment.id',
            'appointment.name',
            'client.id AS clientId',
            'client.name AS clientName',
            'client.phone_number AS clientPhoneNumber',
            'client.address AS clientAddress',
            'branch.id AS branchId',
            'branch.name AS branchName',
            'appointment.appointment_type AS appointmentType',
            'appointment.slot AS slot',
            'appointment.description AS description',
            'appointment.status AS status',
            'staff.id AS staffId',
            'staff.name AS assignedTo',
        ])
            .leftJoin('appointment.clientId', 'client')
            .leftJoin('appointment.branchId', 'branch')
            .leftJoin('appointment.staffId', 'staff')
            .where(`appointment.company_code = "${req.companyCode}"`)
            .andWhere(`appointment.unit_code = "${req.unitCode}"`)
            .orderBy('branch.name', 'ASC')
            .getRawMany();
        return { groupedBranches, appointments };
    }
};
exports.AppointmentRepository = AppointmentRepository;
exports.AppointmentRepository = AppointmentRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], AppointmentRepository);
//# sourceMappingURL=appointement.repo.js.map