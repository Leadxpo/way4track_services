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
exports.WorkAllocationRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const work_allocation_entity_1 = require("../entity/work-allocation.entity");
const work_status_enum_1 = require("../enum/work-status-enum");
const staff_entity_1 = require("../../staff/entity/staff.entity");
const client_entity_1 = require("../../client/entity/client.entity");
const voucher_entity_1 = require("../../voucher/entity/voucher.entity");
const branch_entity_1 = require("../../branch/entity/branch.entity");
let WorkAllocationRepository = class WorkAllocationRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(work_allocation_entity_1.WorkAllocationEntity, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async getWorkAllocation(req) {
        const query = this.createQueryBuilder('wa')
            .select([
            'wa.id AS id',
            'wa.work_allocation_number AS workAllocationNumber',
            'wa.service_or_product AS serviceOrProduct',
            'wa.other_information AS otherInformation',
            'wa.date AS date',
            'staff.name AS staffName',
            'client.name AS clientName',
            'wa.work_status as workStatus',
            'wa.product_name as productName',
            'wa.service as service',
            'wa.amount as amount',
        ])
            .leftJoin(staff_entity_1.StaffEntity, 'staff', 'staff.id=wa.staff_id')
            .leftJoin(client_entity_1.ClientEntity, 'client', 'wa.client_id=client.id')
            .where('wa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode });
        if (req.workAllocationNumber) {
            query.andWhere('wa.work_allocation_number = :workAllocationNumber', { workAllocationNumber: req.workAllocationNumber });
        }
        if (req.serviceOrProduct) {
            query.andWhere('wa.service_or_product = :serviceOrProduct', { serviceOrProduct: req.serviceOrProduct });
        }
        if (req.clientName) {
            query.andWhere('client.name = :clientName', { clientName: req.clientName });
        }
        const result = await query.getRawMany();
        return result;
    }
    async getTotalWorkAllocation(req) {
        const query = this.createQueryBuilder('wa')
            .select([
            'wa.staff_id AS staffId',
            'staff.name AS staffName',
            'v.amount as amount',
            'COUNT(wa.id) AS totalAppointments',
            'SUM(CASE WHEN wa.work_status = :completed THEN 1 ELSE 0 END) AS totalSuccessAppointments'
        ])
            .leftJoin(staff_entity_1.StaffEntity, 'staff', 'wa.staff_id = staff.id')
            .leftJoin(voucher_entity_1.VoucherEntity, 'v', 'wa.voucher_id = v.id')
            .where('wa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('staff.staff_id = :staffId', { staffId: req.staffId })
            .groupBy('wa.staff_id')
            .addGroupBy('staff.name')
            .addGroupBy('v.amount');
        const result = await query.setParameter('completed', work_status_enum_1.WorkStatusEnum.COMPLETED).getRawMany();
        return result;
    }
    async getMonthTotalWorkAllocation(req) {
        const query = this.createQueryBuilder('wa')
            .select([
            'YEAR(wa.date) AS year',
            'MONTH(wa.date) AS month',
            'COUNT(wa.id) AS totalAppointments',
            'SUM(CASE WHEN wa.work_status = :completed THEN 1 ELSE 0 END) AS totalSuccessAppointments',
            'SUM(ve.amount) AS totalSalesAmount',
        ])
            .leftJoin(staff_entity_1.StaffEntity, 'staff', 'wa.staff_id = staff.id')
            .leftJoin(voucher_entity_1.VoucherEntity, 've', 'wa.voucher_id = ve.id')
            .where('wa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('wa.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('staff.staff_id = :staffId', { staffId: req.staffId })
            .andWhere('YEAR(wa.date) = :year', { year: req.year })
            .groupBy('YEAR(wa.date), MONTH(wa.date)')
            .addGroupBy('staff.name')
            .orderBy('YEAR(wa.date), MONTH(wa.date)');
        const result = await query.setParameter('completed', work_status_enum_1.WorkStatusEnum.COMPLETED).getRawMany();
        return result;
    }
    async getTotalPendingAndCompletedPercentage(req) {
        const query = this.createQueryBuilder('ve')
            .select([
            `YEAR(ve.date) AS year`,
            `MONTH(ve.date) AS month`,
            `branch.name AS branchName`,
            `COUNT(ve.id) AS totalWorks`,
            `SUM(CASE WHEN ve.work_status = 'pending' THEN 1 ELSE 0 END) AS totalPending`,
            `SUM(CASE WHEN ve.work_status = 'completed' THEN 1 ELSE 0 END) AS totalCompleted`,
            `ROUND((SUM(CASE WHEN ve.work_status = 'pending' THEN 1 ELSE 0 END) / NULLIF(COUNT(ve.id), 0)) * 100, 2) AS pendingPercentage`,
            `ROUND((SUM(CASE WHEN ve.work_status = 'completed' THEN 1 ELSE 0 END) / NULLIF(COUNT(ve.id), 0)) * 100, 2) AS completedPercentage`
        ])
            .leftJoin(branch_entity_1.BranchEntity, 'branch', 'branch.id = ve.branch_id')
            .where(`ve.company_code = :companyCode`, { companyCode: req.companyCode })
            .andWhere(`ve.unit_code = :unitCode`, { unitCode: req.unitCode });
        if (req.date) {
            const year = Number(req.date);
            if (isNaN(year)) {
                throw new Error('Invalid year provided');
            }
            query.andWhere(`YEAR(ve.date) = :year`, { year });
        }
        if (req.branchName) {
            query.andWhere(`LOWER(branch.name) = LOWER(:branchName)`, { branchName: req.branchName });
        }
        query.groupBy('branch.name, YEAR(ve.date), MONTH(ve.date)')
            .orderBy('YEAR(ve.date)', 'ASC')
            .addOrderBy('MONTH(ve.date)', 'ASC')
            .addOrderBy('branch.name', 'ASC');
        return query.getRawMany();
    }
};
exports.WorkAllocationRepository = WorkAllocationRepository;
exports.WorkAllocationRepository = WorkAllocationRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], WorkAllocationRepository);
//# sourceMappingURL=work-allocation.repo.js.map