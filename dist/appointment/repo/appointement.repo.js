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
const branch_entity_1 = require("../../branch/entity/branch.entity");
const client_entity_1 = require("../../client/entity/client.entity");
const staff_entity_1 = require("../../staff/entity/staff.entity");
let AppointmentRepository = class AppointmentRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(appointement_entity_1.AppointmentEntity, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async getAllAppointmentDetails(req) {
        const acceptedStatus = 'accepted';
        const groupedBranches = await this.createQueryBuilder('appointment')
            .select([
            'branch.name AS branchName',
            'COUNT(appointment.id) AS totalAppointments',
            'SUM(CASE WHEN appointment.status = :accepted THEN 1 ELSE 0 END) AS totalSuccessAppointments'
        ])
            .leftJoin(branch_entity_1.BranchEntity, 'branch', 'branch.id = appointment.branch_id')
            .where('appointment.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('appointment.unit_code = :unitCode', { unitCode: req.unitCode })
            .setParameter('accepted', acceptedStatus);
        if (req.branch) {
            groupedBranches.andWhere('branch.name = :branchName', { branchName: req.branch });
        }
        const result = await groupedBranches.groupBy('branch.name').getRawMany();
        const appointments = this.createQueryBuilder('appointment')
            .select([
            'appointment.id AS appointment_id',
            'appointment.name AS appointment_name',
            'client.id AS clientId',
            'client.name AS clientName',
            'client.phone_number AS clientPhoneNumber',
            'client.address AS clientAddress',
            'branch.id AS branchId',
            'branch.name AS branchName',
            'appointment.appointment_type AS appointmentType',
            'appointment.time AS slot',
            'appointment.description AS description',
            'appointment.status AS status',
            'staff.staff_id AS staffId',
            'staff.name AS assignedTo',
        ])
            .leftJoin(client_entity_1.ClientEntity, 'client', 'appointment.client_id = client.id')
            .leftJoin(branch_entity_1.BranchEntity, 'branch', 'branch.id = appointment.branch_id')
            .leftJoin(staff_entity_1.StaffEntity, 'staff', 'staff.id = appointment.staff_id')
            .where('appointment.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('appointment.unit_code = :unitCode', { unitCode: req.unitCode });
        if (req.branch) {
            appointments.andWhere('branch.name = :branchName', { branchName: req.branch });
        }
        if (req.staffId) {
            appointments.andWhere('staff.staff_id = :staffId', { staffId: req.staffId });
        }
        const appointmentsResult = await appointments.orderBy('branch.name', 'ASC').getRawMany();
        return { result, appointments: appointmentsResult };
    }
};
exports.AppointmentRepository = AppointmentRepository;
exports.AppointmentRepository = AppointmentRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], AppointmentRepository);
//# sourceMappingURL=appointement.repo.js.map