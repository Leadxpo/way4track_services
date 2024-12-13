import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ProductAssignEntity } from "../entity/product-assign.entity";
import { BranchEntity } from "src/branch/entity/branch.entity";
import { ProductEntity } from "src/product/entity/product.entity";
import { StaffEntity } from "src/staff/entity/staff.entity";
import { RequestRaiseEntity } from "src/request-raise/entity/request-raise.entity";



@Injectable()

export class ProductAssignRepository extends Repository<ProductAssignEntity> {

    constructor(private dataSource: DataSource) {
        super(ProductAssignEntity, dataSource.createEntityManager());
    }
    async productAssignDetails(): Promise<any> {
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
            .leftJoin(BranchEntity, 'br', 'br.id = pa.branch_id')
            .leftJoin(ProductEntity, 'pr', 'pr.id = pa.product_id')
            .leftJoin(StaffEntity, 'sa', 'sa.id = pa.staff_id')
            .leftJoin(RequestRaiseEntity, 're', 're.id = pa.request_id')
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

    async totalProducts(): Promise<any> {
        const query = this.createQueryBuilder('pa')
            .select([
                'sum(pa.number_of_products) AS totalProducts',
            ]);

        const monthResult = await query.andWhere(`DATE(pa.date) BETWEEN DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND CURDATE()`)
            .getRawOne();

        const weekResult = await query.andWhere(`DATE(pa.date) BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE()`)
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

    async getTotalAssignedAndStockLast30Days(): Promise<any> {
        const result = await this.createQueryBuilder('pa')
            .select('SUM(pa.assigned_qty)', 'totalAssigned')
            .leftJoin(ProductEntity, 'p', 'p.id = pa.product_id')
            .where('DATE(pa.assign_time) BETWEEN DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND CURDATE()')
            .groupBy('pa.product_id')
            .getRawMany();
        const productStocks = await this.createQueryBuilder('pa')
            .addSelect('SUM(p.number_of_products)', 'numberOfProducts')
            .leftJoin(ProductEntity, 'p', 'p.id = pa.product_id')
            .where('pa.productId IN (:...productIds)', { productIds: result.map(item => item.productId) })
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
}

