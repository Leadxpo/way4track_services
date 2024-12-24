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
exports.ProductAssignRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const product_assign_entity_1 = require("../entity/product-assign.entity");
const branch_entity_1 = require("../../branch/entity/branch.entity");
const product_entity_1 = require("../../product/entity/product.entity");
const staff_entity_1 = require("../../staff/entity/staff.entity");
const request_raise_entity_1 = require("../../request-raise/entity/request-raise.entity");
let ProductAssignRepository = class ProductAssignRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(product_assign_entity_1.ProductAssignEntity, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async productAssignDetails(req) {
        const query = await this.createQueryBuilder('pa')
            .select([
            're.request_id AS requestId',
            'pa.branch_person AS branchOrPerson',
            'pa.imei_number_from AS imeiNumberFrom',
            'pa.imei_number_to AS imeiNumberTo',
            'pa.number_of_products AS numberOfProducts',
            'sa.name AS staffName',
            'br.name AS branchName',
        ])
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = pa.branch_id')
            .leftJoin(product_entity_1.ProductEntity, 'pr', 'pr.id = pa.product_id')
            .leftJoin(staff_entity_1.StaffEntity, 'sa', 'sa.id = pa.staff_id')
            .leftJoin(request_raise_entity_1.RequestRaiseEntity, 're', 're.id = pa.request_id')
            .where(`pa.company_code = "${req.companyCode}"`)
            .andWhere(`pa.unit_code = "${req.unitCode}"`)
            .getRawMany();
        return query.map((item) => ({
            requestId: item.requestId,
            branchOrPerson: item.branchOrPerson,
            imeiNumberFrom: item.imeiNumberFrom,
            imeiNumberTo: item.imeiNumberTo,
            numberOfProducts: item.numberOfProducts,
            staffName: item.staffName,
            branchName: item.branchName,
        }));
    }
    async totalProducts(req) {
        const query = this.createQueryBuilder('pa')
            .select([
            'sum(pa.number_of_products) AS totalProducts',
        ]);
        const monthResult = await query.andWhere(`DATE(pa.date) BETWEEN DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND CURDATE()`)
            .where(`pa.company_code = "${req.companyCode}"`)
            .andWhere(`pa.unit_code = "${req.unitCode}"`)
            .getRawOne();
        const weekResult = await query.andWhere(`DATE(pa.date) BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE()`)
            .where(`pa.company_code = "${req.companyCode}"`)
            .andWhere(`pa.unit_code = "${req.unitCode}"`)
            .getRawOne();
        const last30DaysProducts = monthResult.totalProducts;
        const last7DaysProducts = weekResult.totalProducts;
        let percentageChange = 0;
        if (last7DaysProducts && last30DaysProducts) {
            percentageChange = ((last30DaysProducts - last7DaysProducts) / last7DaysProducts) * 100;
        }
        return {
            last30DaysProducts: last30DaysProducts,
            percentageChange: percentageChange.toFixed(2),
        };
    }
    async getTotalAssignedAndStockLast30Days(req) {
        const result = await this.createQueryBuilder('pa')
            .select('SUM(pa.assigned_qty)', 'totalAssigned')
            .leftJoin(product_entity_1.ProductEntity, 'p', 'p.id = pa.product_id')
            .where('DATE(pa.assign_time) BETWEEN DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND CURDATE()')
            .groupBy('pa.product_id')
            .where(`pa.company_code = "${req.companyCode}"`)
            .andWhere(`pa.unit_code = "${req.unitCode}"`)
            .getRawMany();
        const productStocks = await this.createQueryBuilder('pa')
            .addSelect('SUM(p.number_of_products)', 'numberOfProducts')
            .leftJoin(product_entity_1.ProductEntity, 'p', 'p.id = pa.product_id')
            .where('pa.product_id IN (:...productIds)', { productIds: result.map(item => item.productId) })
            .andWhere(`pa.company_code = "${req.companyCode}"`)
            .andWhere(`pa.unit_code = "${req.unitCode}"`)
            .getRawMany();
        const finalResult = result.map((item) => {
            const productStock = productStocks.find(stock => stock.productId === item.productId);
            return {
                totalAssigned: item.totalAssigned,
                numberOfProducts: item.numberOfProducts,
                currentStock: productStock ? productStock.numberOfProducts - item.totalAssigned : 0,
            };
        });
        return finalResult;
    }
    async getAssignedQtyLast30Days(req) {
        const result = await this.createQueryBuilder('productAssign')
            .innerJoinAndSelect('productAssign.product_id', 'product')
            .innerJoinAndSelect('productAssign.branch_id', 'branch')
            .select('branch.id', 'branchId')
            .addSelect('branch.name', 'branchName')
            .addSelect('product.product_name', 'productName')
            .addSelect('SUM(productAssign.assigned_qty)', 'totalAssignedQty')
            .where('productAssign.is_assign = :isAssign', { isAssign: true })
            .andWhere('productAssign.assign_time >= :startDate', { startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) })
            .andWhere(`productAssign.company_code = "${req.companyCode}"`)
            .andWhere(`productAssign.unit_code = "${req.unitCode}"`)
            .groupBy('branch.id')
            .addGroupBy('product.product_name')
            .getRawMany();
        return result;
    }
};
exports.ProductAssignRepository = ProductAssignRepository;
exports.ProductAssignRepository = ProductAssignRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], ProductAssignRepository);
//# sourceMappingURL=product-assign.repo.js.map