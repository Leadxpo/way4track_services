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
    async productAssignDetails(req: CommonReq): Promise<any> {
        const query = await this.createQueryBuilder('pa')
            .select([
                're.request_id AS requestId',
                'pa.branch_person AS branchOrPerson',
                'pa.imei_number_from AS imeiNumberFrom',
                'pa.imei_number_to AS imeiNumberTo',
                'pa.number_of_products AS numberOfProducts',
                'sa.name AS staffName',
                'br.name AS branchName',
                'pr.product_name as productName',
                'pr.product_photo as productPhoto'
            ])
            .leftJoin(BranchEntity, 'br', 'br.id = pa.branch_id')
            .leftJoin(ProductEntity, 'pr', 'pr.id = pa.product_id')
            .leftJoin(StaffEntity, 'sa', 'sa.id = pa.staff_id')
            .leftJoin(RequestRaiseEntity, 're', 're.id = pa.request_id')
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
            productName: item.productName,
            productPhoto: item.productPhoto
        }));
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
            .select('SUM(pa.assigned_qty)', 'totalAssigned')
            .leftJoin(ProductEntity, 'p', 'p.id = pa.product_id')
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

    async getAssignedQtyLast30Days(req: CommonReq) {
        const result = await
            this.createQueryBuilder('productAssign')
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
}

