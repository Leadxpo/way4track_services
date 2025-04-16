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
exports.ProductRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const product_entity_1 = require("../entity/product.entity");
const product_type_entity_1 = require("../../product-type/entity/product-type.entity");
const branch_entity_1 = require("../../branch/entity/branch.entity");
const staff_entity_1 = require("../../staff/entity/staff.entity");
const sub_dealer_entity_1 = require("../../sub-dealer/entity/sub-dealer.entity");
let ProductRepository = class ProductRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(product_entity_1.ProductEntity, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async getSearchDetailProduct(req) {
        const query = this.createQueryBuilder('pr')
            .select([
            'pt.name AS productName',
            `SUM(CASE WHEN pr.status = 'not_assigned' THEN COALESCE(pr.quantity, 0) ELSE 0 END) AS notAssignedStock`,
            `SUM(CASE WHEN pr.status = 'assigned' THEN COALESCE(pr.quantity, 0) ELSE 0 END) AS assignedStock`,
            `SUM(CASE WHEN pr.status = 'inHand' THEN COALESCE(pr.quantity, 0) ELSE 0 END) AS inHandStock`,
        ])
            .leftJoin(product_type_entity_1.ProductTypeEntity, 'pt', 'pt.id = pr.product_type_id')
            .where('pr.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('pr.unit_code = :unitCode', { unitCode: req.unitCode });
        if (req.productName) {
            query.andWhere('pt.name LIKE :productName', { productName: `%${req.productName}%` });
        }
        if (req.fromDate) {
            query.andWhere('DATE(pr.assign_time) >= :fromDate', { fromDate: req.fromDate });
        }
        if (req.toDate) {
            query.andWhere('DATE(pr.assign_time) <= :toDate', { toDate: req.toDate });
        }
        query.groupBy('pt.name');
        return await query.getRawMany();
    }
    async getDetailProduct(req) {
        const query = this.createQueryBuilder('pr')
            .select([
            'SUM(CASE WHEN pr.status = \'not_assigned\' THEN COALESCE(pr.quantity, 0) ELSE 0 END) AS presentStock',
            `SUM(CASE WHEN pr.status = 'assigned' THEN COALESCE(pr.quantity, 0) ELSE 0 END) AS assignedStock`,
            `SUM(CASE WHEN pr.status = 'inHand' THEN COALESCE(pr.quantity, 0) ELSE 0 END) AS inHandStock`,
        ])
            .where('pr.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('pr.unit_code = :unitCode', { unitCode: req.unitCode });
        const result = await query.getRawOne();
        return result;
    }
    async productAssignDetails(req) {
        const response = {};
        const { companyCode, unitCode, fromDate, toDate, branchName, subDealerId, staffId } = req;
        const branchQuery = this.createQueryBuilder('pa')
            .select(['br.name AS branchName'])
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = pa.branch_id')
            .where('pa.company_code = :companyCode', { companyCode })
            .andWhere('pa.unit_code = :unitCode', { unitCode });
        if (branchName)
            branchQuery.andWhere('br.name = :branchName', { branchName });
        if (fromDate)
            branchQuery.andWhere('DATE(pa.assign_time) >= :fromDate', { fromDate });
        if (toDate)
            branchQuery.andWhere('DATE(pa.assign_time) <= :toDate', { toDate });
        const branchResults = await branchQuery.groupBy('br.name').getRawMany();
        response.branchList = branchResults.filter(b => b.branchName !== null);
        const detailedBranchAssignQuery = this.createQueryBuilder('pa')
            .select([
            'br.name AS branchName',
            'pa.product_name AS productName',
            'SUM(CASE WHEN pa.status = \'assigned\' THEN COALESCE(pa.quantity, 0) ELSE 0 END) AS presentStock',
            'SUM(CASE WHEN pa.status = \'inHand\' THEN COALESCE(pa.quantity, 0) ELSE 0 END) AS handStock',
            'pa.product_status AS productStatus',
            'pa.assign_time AS assignTime'
        ])
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = pa.branch_id')
            .where('pa.company_code = :companyCode', { companyCode })
            .andWhere('pa.unit_code = :unitCode', { unitCode });
        if (branchName)
            detailedBranchAssignQuery.andWhere('br.name = :branchName', { branchName });
        if (fromDate)
            detailedBranchAssignQuery.andWhere('DATE(pa.assign_time) >= :fromDate', { fromDate });
        if (toDate)
            detailedBranchAssignQuery.andWhere('DATE(pa.assign_time) <= :toDate', { toDate });
        const rawBranchResults = await detailedBranchAssignQuery
            .groupBy('pa.imei_number')
            .addGroupBy('br.name')
            .addGroupBy('sf.name')
            .addGroupBy('pa.product_name')
            .addGroupBy('pa.product_status')
            .orderBy('br.name', 'ASC')
            .getRawMany();
        response.branchDetails = rawBranchResults.filter(item => item.branchName !== null);
        const subDealerQuery = this.createQueryBuilder('pa')
            .select([
            'sb.name AS subDealerName',
            'sb.sub_dealer_id AS subDealerId'
        ])
            .leftJoin(sub_dealer_entity_1.SubDealerEntity, 'sb', 'sb.id = pa.sub_dealer_id')
            .where('pa.company_code = :companyCode', { companyCode })
            .andWhere('pa.unit_code = :unitCode', { unitCode });
        if (subDealerId)
            subDealerQuery.andWhere('sb.sub_dealer_id = :subDealerId', { subDealerId });
        if (fromDate)
            subDealerQuery.andWhere('DATE(pa.assign_time) >= :fromDate', { fromDate });
        if (toDate)
            subDealerQuery.andWhere('DATE(pa.assign_time) <= :toDate', { toDate });
        const subDealerResults = await subDealerQuery.groupBy('sb.sub_dealer_id, sb.name').getRawMany();
        response.subDealerList = subDealerResults.filter(sd => sd.subDealerName && sd.subDealerId);
        const detailedSubDealerAssignQuery = this.createQueryBuilder('pa')
            .select([
            'sb.name AS subDealerName',
            'sb.sub_dealer_id AS subDealerId',
            'pa.product_name AS productName',
            'SUM(CASE WHEN pa.status = \'assigned\' THEN COALESCE(pa.quantity, 0) ELSE 0 END) AS presentStock',
            'pa.product_status AS productStatus',
            'pa.assign_time AS assignTime'
        ])
            .leftJoin(sub_dealer_entity_1.SubDealerEntity, 'sb', 'sb.id = pa.sub_dealer_id')
            .where('pa.company_code = :companyCode', { companyCode })
            .andWhere('pa.unit_code = :unitCode', { unitCode });
        if (subDealerId)
            detailedSubDealerAssignQuery.andWhere('sb.sub_dealer_id = :subDealerId', { subDealerId });
        if (fromDate)
            detailedSubDealerAssignQuery.andWhere('DATE(pa.assign_time) >= :fromDate', { fromDate });
        if (toDate)
            detailedSubDealerAssignQuery.andWhere('DATE(pa.assign_time) <= :toDate', { toDate });
        const rawSubDealerResults = await detailedSubDealerAssignQuery
            .groupBy('sb.name')
            .addGroupBy('sb.sub_dealer_id')
            .addGroupBy('pa.product_name')
            .addGroupBy('pa.product_status')
            .orderBy('sb.sub_dealer_id')
            .getRawMany();
        response.subDealerDetails = rawSubDealerResults.filter(item => item.subDealerName && item.subDealerId);
        const staffQuery = this.createQueryBuilder('pa')
            .select(['sf.name AS staffName'])
            .leftJoin(staff_entity_1.StaffEntity, 'sf', 'sf.id = pa.staff_id')
            .where('pa.company_code = :companyCode', { companyCode })
            .andWhere('pa.unit_code = :unitCode', { unitCode });
        if (staffId)
            staffQuery.andWhere('sf.id = :staffId', { staffId });
        if (fromDate)
            staffQuery.andWhere('DATE(pa.assign_time) >= :fromDate', { fromDate });
        if (toDate)
            staffQuery.andWhere('DATE(pa.assign_time) <= :toDate', { toDate });
        const staffResults = await staffQuery.groupBy('sf.name').getRawMany();
        response.staffList = staffResults.filter(s => s.staffName !== null);
        const detailedStaffQuery = this.createQueryBuilder('pa')
            .select([
            'sf.name AS staffName',
            'pa.product_name AS productName',
            'SUM(CASE WHEN pa.status = \'inHand\' THEN COALESCE(pa.quantity, 0) ELSE 0 END) AS handStock',
            'pa.product_status AS productStatus',
            'pa.assign_time AS assignTime'
        ])
            .leftJoin(staff_entity_1.StaffEntity, 'sf', 'sf.id = pa.staff_id')
            .where('pa.company_code = :companyCode', { companyCode })
            .andWhere('pa.unit_code = :unitCode', { unitCode });
        if (staffId)
            detailedStaffQuery.andWhere('sf.id = :staffId', { staffId });
        if (fromDate)
            detailedStaffQuery.andWhere('DATE(pa.assign_time) >= :fromDate', { fromDate });
        if (toDate)
            detailedStaffQuery.andWhere('DATE(pa.assign_time) <= :toDate', { toDate });
        const rawStaffResults = await detailedStaffQuery
            .groupBy('sf.name')
            .addGroupBy('pa.product_name')
            .addGroupBy('pa.product_status')
            .getRawMany();
        response.staffDetails = rawStaffResults.filter(item => item.staffName !== null);
        return response;
    }
};
exports.ProductRepository = ProductRepository;
exports.ProductRepository = ProductRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], ProductRepository);
//# sourceMappingURL=product.repo.js.map