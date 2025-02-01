import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ProductAssignEntity } from "../entity/product-assign.entity";
import { BranchEntity } from "src/branch/entity/branch.entity";
import { ProductEntity } from "src/product/entity/product.entity";
import { StaffEntity } from "src/staff/entity/staff.entity";
import { RequestRaiseEntity } from "src/request-raise/entity/request-raise.entity";
import { CommonReq } from "src/models/common-req";



@Injectable()

export class ProductAssignRepository extends Repository<ProductAssignEntity> {

    constructor(private dataSource: DataSource) {
        super(ProductAssignEntity, dataSource.createEntityManager());
    }

    async productAssignDetails(req: {
        branchName?: string;
        companyCode?: string;
        unitCode?: string;
    }): Promise<any> {
        // Grouped branches query (modified to check if branchName is provided)
        const groupedBranchesQuery = this.createQueryBuilder('pa')
            .select([
                'br.name AS branchName',
                'COUNT(pa.id) AS totalpas',
            ])
            .leftJoin(BranchEntity, 'br', 'br.id = pa.branch_id')
            .where('pa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('pa.unit_code = :unitCode', { unitCode: req.unitCode });

        // If a branch name is provided, filter by that branch
        if (req.branchName) {
            groupedBranchesQuery.andWhere('br.name = :branchName', { branchName: req.branchName });
        }

        // Execute the grouped branches query
        const result = await groupedBranchesQuery.groupBy('br.name').getRawMany();

        // Detailed assignment query (modified to check if branchName is provided)
        const detailedAssignQuery = this.createQueryBuilder('pa')
            .select([
                're.request_id AS requestId',
                'pa.branch_person AS branchOrPerson',
                'pa.imei_number_from AS imeiNumberFrom',
                'pa.imei_number_to AS imeiNumberTo',
                'pa.number_of_products AS numberOfProducts',
                'sa.name AS staffName',
                'br.name AS branchName',
                'pr.product_name AS productName',
                'pr.product_photo AS productPhoto',
            ])
            .leftJoin(BranchEntity, 'br', 'br.id = pa.branch_id')
            .leftJoin(ProductEntity, 'pr', 'pr.id = pa.product_id')
            .leftJoin(StaffEntity, 'sa', 'sa.id = pa.staff_id')
            .leftJoin(RequestRaiseEntity, 're', 're.id = pa.request_id')
            .where('pa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('pa.unit_code = :unitCode', { unitCode: req.unitCode });

        // If a branch name is provided, filter the detailed assignment by that branch
        if (req.branchName) {
            detailedAssignQuery.andWhere('br.name = :branchName', { branchName: req.branchName });
        }

        // Execute the detailed assignment query
        const rawResults = await detailedAssignQuery.orderBy('br.name', 'ASC').getRawMany();

        // Return the grouped and detailed results
        return { result, rawResults };
    }




    async totalProducts(req: CommonReq): Promise<any> {
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

    async getTotalAssignedAndStockLast30Days(req: CommonReq): Promise<any> {
        const result = await this.createQueryBuilder('pa')
            .select('SUM(pa.number_of_products)', 'totalAssigned')
            .leftJoin(ProductEntity, 'p', 'p.id = pa.product_id')
            .leftJoinAndSelect(BranchEntity, 'branch', 'branch.id = pa.branch_id')
            // .leftJoin(StaffEntity, 'sf', 'sf.id = pa.staff_id')
            .where('DATE(pa.assign_time) BETWEEN DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND CURDATE()')
            .groupBy('pa.product_id')
            .where(`pa.company_code = "${req.companyCode}"`)
            .andWhere(`pa.unit_code = "${req.unitCode}"`)
            .getRawMany();
        const productStocks = await this.createQueryBuilder('pa')
            .addSelect('SUM(p.number_of_products)', 'numberOfProducts')
            .leftJoin(ProductEntity, 'p', 'p.id = pa.product_id')
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

    async getAssignedQty(req: CommonReq) {
        const result = await this.createQueryBuilder('productAssign')
            .leftJoinAndSelect(ProductEntity, 'product', 'product.id = productAssign.product_id')
            .leftJoinAndSelect(BranchEntity, 'branch', 'branch.id = productAssign.branch_id')
            .select('branch.id', 'branchId')
            .addSelect('branch.name', 'branchName')
            .addSelect('SUM(productAssign.number_of_products)', 'totalAssignedQty')
            .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy('branch.id') // Grouping by branch only
            .getRawMany();

        return result;
    }

    async getTotalInHandsQty(req: CommonReq) {
        const result = await this.createQueryBuilder('productAssign')
            .leftJoinAndSelect(ProductEntity, 'product', 'product.id = productAssign.product_id')
            .leftJoinAndSelect(StaffEntity, 'sf', 'sf.id = productAssign.staff_id')
            .select('sf.staff_id', 'staffID')
            .addSelect('sf.name', 'staffName')
            .addSelect('SUM(CASE WHEN productAssign.in_hands = :inHands THEN productAssign.number_of_products ELSE 0 END)', 'totalInHandsQty')
            .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('productAssign.in_hands = :inHands', { inHands: 'true' })
            .groupBy('sf.id')
            .getRawMany();

        return result;
    }

    async getTotalBranchAssignedQty(req: CommonReq) {
        const result = await this.createQueryBuilder('productAssign')
            .leftJoinAndSelect(ProductEntity, 'product', 'product.id = productAssign.product_id')
            .leftJoinAndSelect(BranchEntity, 'branch', 'branch.id = productAssign.branch_id')
            .select('branch.id', 'branchId')
            .addSelect('branch.name', 'branchName')
            .addSelect('SUM(CASE WHEN productAssign.is_assign = :isAssign THEN productAssign.number_of_products ELSE 0 END)', 'totalAssignedQty')
            .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('productAssign.is_assign = :isAssign', { isAssign: 'true' })  // Condition for is_assign
            .groupBy('branch.id')
            .setParameters({ isAssign: true, companyCode: req.companyCode, unitCode: req.unitCode })
            .getRawMany();

        return result;
    }



}

