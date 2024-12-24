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
exports.EstimateRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const estimate_entity_1 = require("../entity/estimate.entity");
const client_entity_1 = require("../../client/entity/client.entity");
let EstimateRepository = class EstimateRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(estimate_entity_1.EstimateEntity, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async getEstimates(req) {
        const query = this.createQueryBuilder('estimate')
            .select([
            'estimate.estimate_id AS estimateNumber',
            'client.name AS clientName',
            'estimate.estimate_date AS estimateDate',
            'estimate.expire_date AS expiryDate',
            'estimate.amount AS amount',
            'client.status AS status',
        ])
            .leftJoin(client_entity_1.ClientEntity, 'client', 'client.id = estimate.client_id')
            .where('estimate.estimate_date BETWEEN :fromDate AND :toDate', {
            fromDate: req.fromDate,
            toDate: req.toDate,
        })
            .andWhere(`estimate.company_code = "${req.companyCode}"`)
            .andWhere(`estimate.unit_code = "${req.unitCode}"`);
        if (req.status) {
            query.andWhere('client.status = :status', { status: req.status });
        }
        const result = await query.getRawMany();
        return result;
    }
};
exports.EstimateRepository = EstimateRepository;
exports.EstimateRepository = EstimateRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], EstimateRepository);
//# sourceMappingURL=estimate.repo.js.map