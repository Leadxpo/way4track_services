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
            'wa.company_code AS companyCode',
            'wa.unit_code AS unitCode'
        ])
            .leftJoin('wa.staffId', 'staff')
            .leftJoin('wa.clientId', 'client');
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
};
exports.WorkAllocationRepository = WorkAllocationRepository;
exports.WorkAllocationRepository = WorkAllocationRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], WorkAllocationRepository);
//# sourceMappingURL=work-allocation.repo.js.map