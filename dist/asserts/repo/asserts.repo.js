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
            console.log('Service input:', req);
            const office_asserts = await this.createQueryBuilder('as')
                .select('SUM(as.quantity)', 'total_office_asserts')
                .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = as.branch_id')
                .where('as.asset_type = :officeAssetType', { officeAssetType: asserts_entity_1.AssetType.OFFICE_ASSET })
                .andWhere('as.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('as.unit_code = :unitCode', { unitCode: req.unitCode })
                .getRawOne();
            console.log(office_asserts?.total_office_asserts, "++++=");
            const transport_asserts = await this.createQueryBuilder('as')
                .select('SUM(as.quantity)', 'total_transport_asserts')
                .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = as.branch_id')
                .where('as.asset_type = :transportAssetType', { transportAssetType: asserts_entity_1.AssetType.TRANSPORT_ASSET })
                .andWhere('as.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('as.unit_code = :unitCode', { unitCode: req.unitCode })
                .getRawOne();
            console.log(transport_asserts?.total_transport_asserts, "++++=");
            const totalAsserts = await this.createQueryBuilder('as')
                .select('SUM(as.quantity)', 'total_asserts')
                .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = as.branch_id')
                .where('as.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('as.unit_code = :unitCode', { unitCode: req.unitCode })
                .getRawOne();
            console.log(totalAsserts?.total_asserts, "++++=");
            return {
                officeAsserts: office_asserts?.total_office_asserts || 0,
                transportAsserts: transport_asserts?.total_transport_asserts || 0,
                totalAsserts: totalAsserts?.total_asserts || 0,
            };
        }
        catch (error) {
            console.error("Error in assertsCardData:", error);
            throw new Error('Error retrieving asserts card data');
        }
    }
};
exports.AssertsRepository = AssertsRepository;
exports.AssertsRepository = AssertsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], AssertsRepository);
//# sourceMappingURL=asserts.repo.js.map