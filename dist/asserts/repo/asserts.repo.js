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
exports.AssertsRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const asserts_entity_1 = require("../entity/asserts-entity");
const branch_entity_1 = require("../../branch/entity/branch.entity");
let AssertsRepository = class AssertsRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(asserts_entity_1.AssertsEntity, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async assertsCardData(req) {
        try {
            const groupedBranchesQuery = this.createQueryBuilder('as')
                .select(['branch.name AS branchName'])
                .leftJoin(branch_entity_1.BranchEntity, 'branch', 'branch.id = as.branch_id')
                .where('as.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('as.unit_code = :unitCode', { unitCode: req.unitCode });
            if (req.branch) {
                groupedBranchesQuery.andWhere('branch.name = :branchName', { branchName: req.branch });
            }
            const groupedBranches = await groupedBranchesQuery.groupBy('branch.name').getRawMany();
            const officeAssertsQuery = this.createQueryBuilder('as')
                .select('SUM(as.quantity)', 'total_office_asserts')
                .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = as.branch_id')
                .where('as.asset_type = :officeAssetType', { officeAssetType: asserts_entity_1.AssetType.OFFICE_ASSET })
                .andWhere('as.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('as.unit_code = :unitCode', { unitCode: req.unitCode });
            if (req.branch) {
                officeAssertsQuery.andWhere('br.name = :branchName', { branchName: req.branch });
            }
            const officeAsserts = await officeAssertsQuery.getRawOne();
            const transportAssertsQuery = this.createQueryBuilder('as')
                .select('SUM(as.quantity)', 'total_transport_asserts')
                .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = as.branch_id')
                .where('as.asset_type = :transportAssetType', { transportAssetType: asserts_entity_1.AssetType.TRANSPORT_ASSET })
                .andWhere('as.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('as.unit_code = :unitCode', { unitCode: req.unitCode });
            if (req.branch) {
                transportAssertsQuery.andWhere('br.name = :branchName', { branchName: req.branch });
            }
            const transportAsserts = await transportAssertsQuery.getRawOne();
            const totalAssertsQuery = this.createQueryBuilder('as')
                .select('SUM(as.quantity)', 'total_asserts')
                .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = as.branch_id')
                .where('as.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('as.unit_code = :unitCode', { unitCode: req.unitCode });
            if (req.branch) {
                totalAssertsQuery.andWhere('br.name = :branchName', { branchName: req.branch });
            }
            const totalAsserts = await totalAssertsQuery.getRawOne();
            const results = {
                groupedBranches: groupedBranches.map(branch => ({
                    branchName: branch.branchName || 'N/A',
                })),
                officeAsserts: Number(officeAsserts?.total_office_asserts || 0),
                transportAsserts: Number(transportAsserts?.total_transport_asserts || 0),
                totalAsserts: Number(totalAsserts?.total_asserts || 0),
            };
            return results;
        }
        catch (error) {
            console.error('Error in assertsCardData:', error);
            throw new Error('Error retrieving asserts card data');
        }
    }
    async getAssetDataByDate(req) {
        const query = this.createQueryBuilder('asset')
            .select([
            'asset.description AS description',
            'asset.asset_type AS assetType',
            'asset.payment_type AS paymentType',
            'asset.purchase_date AS purchaseDate',
            'asset.asserts_name AS assetName',
            'asset.asserts_amount AS assetAmount',
            'asset.quantity AS quantity'
        ])
            .leftJoin(branch_entity_1.BranchEntity, 'branch', 'branch.id = asset.branch_id')
            .where('asset.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('asset.unit_code = :unitCode', { unitCode: req.unitCode });
        if (req.fromDate) {
            query.andWhere('asset.purchase_date >= :fromDate', { fromDate: req.fromDate });
        }
        if (req.toDate) {
            query.andWhere('asset.purchase_date <= :toDate', { toDate: req.toDate });
        }
        if (req.branch) {
            query.andWhere('branch.name = :branchName', { branchName: req.branch });
        }
        const result = await query.getRawMany();
        return result;
    }
};
exports.AssertsRepository = AssertsRepository;
exports.AssertsRepository = AssertsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], AssertsRepository);
//# sourceMappingURL=asserts.repo.js.map