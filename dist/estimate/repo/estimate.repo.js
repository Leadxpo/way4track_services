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
const client_entity_1 = require("../../client/entity/client.entity");
const typeorm_1 = require("typeorm");
const estimate_entity_1 = require("../entity/estimate.entity");
const vendor_entity_1 = require("../../vendor/entity/vendor.entity");
let EstimateRepository = class EstimateRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(estimate_entity_1.EstimateEntity, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async getEstimates(req) {
        const fromDate = req.fromDate || '';
        const toDate = req.toDate || '';
        const query = this.createQueryBuilder('estimate')
            .select([
            'estimate.id as id',
            'estimate.estimate_id AS estimateNumber',
            'client.name AS clientName',
            'estimate.estimate_date AS estimateDate',
            'estimate.expire_date AS expiryDate',
            'estimate.amount AS estimateAmount',
            'estimate.product_details as productDetails'
        ])
            .leftJoin(client_entity_1.ClientEntity, 'client', 'client.id = estimate.client_id')
            .leftJoin(vendor_entity_1.VendorEntity, 'vendor', 'vendor.id = estimate.vendor_id')
            .leftJoin('estimate.products', 'pa')
            .where('estimate.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('estimate.unit_code = :unitCode', { unitCode: req.unitCode });
        if (req.fromDate || req.toDate) {
            query.andWhere('estimate.estimate_date BETWEEN :fromDate AND :toDate', {
                fromDate,
                toDate,
            });
        }
        if (req.status) {
            query.andWhere('estimate.status = :status', { status: req.status });
        }
        const result = await query.getRawMany();
        return result;
    }
    async getEstimatesForReport(req) {
        const query = this.createQueryBuilder('estimate')
            .select([
            'estimate.id as id',
            'estimate.estimate_id AS estimateNumber',
            'client.name AS clientName',
            'estimate.estimate_date AS estimateDate',
            'estimate.expire_date AS expiryDate',
            'estimate.amount AS amount',
            'estimate.estimatePdfUrl',
        ])
            .leftJoinAndSelect(client_entity_1.ClientEntity, 'client', 'client.id = estimate.client_id')
            .leftJoinAndSelect(vendor_entity_1.VendorEntity, 'vendor', 'vendor.id = estimate.vendor_id')
            .leftJoinAndSelect('estimate.products', 'pa')
            .andWhere(`estimate.company_code = "${req.companyCode}"`)
            .andWhere(`estimate.unit_code = "${req.unitCode}"`);
        query.andWhere('estimate.estimate_id = :estimateId', { estimateId: req.estimateId });
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