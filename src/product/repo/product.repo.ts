import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ProductEntity } from "../entity/product.entity";
import { ProductIdDto } from "../dto/product.id.dto";
import { CommonReq } from "src/models/common-req";
import { ProductTypeEntity } from "src/product-type/entity/product-type.entity";
import { BranchEntity } from "src/branch/entity/branch.entity";
import { StaffEntity } from "src/staff/entity/staff.entity";
import { RequestRaiseEntity } from "src/request-raise/entity/request-raise.entity";
import { SubDealerEntity } from "src/sub-dealer/entity/sub-dealer.entity";



@Injectable()

export class ProductRepository extends Repository<ProductEntity> {

    constructor(private dataSource: DataSource) {
        super(ProductEntity, dataSource.createEntityManager());
    }


    async getSearchDetailProduct(req: ProductIdDto) {
        const query = this.createQueryBuilder('pr')
            .select([
                'pt.name AS productType',
                'pr.product_name AS productName',
                `SUM(CASE WHEN pr.status = 'not_assigned' THEN COALESCE(pr.quantity, 0) ELSE 0 END) AS notAssignedStock`,
                `SUM(CASE WHEN pr.status = 'assigned' THEN COALESCE(pr.quantity, 0) ELSE 0 END) AS assignedStock`,
                `SUM(CASE WHEN pr.status = 'inHand' THEN COALESCE(pr.quantity, 0) ELSE 0 END) AS inHandStock`,
            ])
            .leftJoin(ProductTypeEntity, 'pt', 'pt.id = pr.product_type_id')
            .where('pr.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('pr.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.productName) {
            query.andWhere('pr.product_name LIKE :productName', { productName: `%${req.productName}%` });
        }

        if (req.fromDate) {
            query.andWhere('DATE(pr.assign_time) >= :fromDate', { fromDate: req.fromDate });
        }

        if (req.toDate) {
            query.andWhere('DATE(pr.assign_time) <= :toDate', { toDate: req.toDate });
        }

        query.groupBy('pt.name, pr.product_name');

        return await query.getRawMany();
    }



    async getDetailProduct(req: CommonReq) {

        const query = this.createQueryBuilder('pr')
            .select([
                'SUM(CASE WHEN pr.status = \'not_assigned\' THEN COALESCE(pr.quantity, 0) ELSE 0 END) AS presentStock',
                `SUM(CASE WHEN pr.status = 'assigned' THEN COALESCE(pr.quantity, 0) ELSE 0 END) AS assignedStock`,
                `SUM(CASE WHEN pr.status = 'inHand' THEN COALESCE(pr.quantity, 0) ELSE 0 END) AS inHandStock`,
            ])
            .where('pr.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('pr.unit_code = :unitCode', { unitCode: req.unitCode })

        const result = await query.getRawOne();
        return result;
    }

    async productAssignDetails(req: {
        branchName?: string;
        subDealerId?: string;
        companyCode?: string;
        unitCode?: string;
        fromDate?: string;
        toDate?: string;

    }): Promise<any> {
        const response: any = {};

        // === Branch logic ===
        const branchQuery = this.createQueryBuilder('pa')
            .select(['br.name AS branchName'])
            .leftJoin(BranchEntity, 'br', 'br.id = pa.branch_id')
            .where('pa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('pa.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.branchName) {
            branchQuery.andWhere('br.name = :branchName', { branchName: req.branchName });
        }

        if (req.fromDate) {
            branchQuery.andWhere('DATE(pa.assign_time) >= :fromDate', { fromDate: req.fromDate });
        }

        if (req.toDate) {
            branchQuery.andWhere('DATE(pa.assign_time) <= :toDate', { toDate: req.toDate });
        }

        const branchResults = await branchQuery.groupBy('br.name').getRawMany();
        response.result = branchResults.filter(b => b.branchName !== null);

        const detailedBranchAssignQuery = this.createQueryBuilder('pa')
            .select([
                'pa.imei_number AS imeiNumber',
                'br.name AS branchName',
                'sf.name AS staffName',
                'pa.product_name AS productName',
                'pa.sim_no AS simNumber',
                'SUM(CASE WHEN pa.status = \'assigned\' THEN COALESCE(pa.quantity, 0) ELSE 0 END) AS presentStock',
                'SUM(CASE WHEN pa.status = \'inHand\' THEN COALESCE(pa.quantity, 0) ELSE 0 END) AS handStock',
                'pa.product_status AS productStatus'
            ])
            .leftJoin(BranchEntity, 'br', 'br.id = pa.branch_id')
            .leftJoin(StaffEntity, 'sf', 'sf.id = pa.staff_id')
            .where('pa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('pa.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.branchName) {
            detailedBranchAssignQuery.andWhere('br.name = :branchName', { branchName: req.branchName });
        }

        if (req.fromDate) {
            detailedBranchAssignQuery.andWhere('DATE(pa.assign_time) >= :fromDate', { fromDate: req.fromDate });
        }

        if (req.toDate) {
            detailedBranchAssignQuery.andWhere('DATE(pa.assign_time) <= :toDate', { toDate: req.toDate });
        }
        const rawBranchResults = await detailedBranchAssignQuery
            .groupBy('pa.imei_number')
            .addGroupBy('br.name')
            .addGroupBy('sf.name')
            .addGroupBy('pa.product_name')
            .addGroupBy('pa.sim_no')
            .addGroupBy('pa.product_status')
            .orderBy('br.name', 'ASC')
            .getRawMany();

        response.rawResults = rawBranchResults.filter(item => item.branchName !== null);


        // === SubDealer logic ===
        const subDealerQuery = this.createQueryBuilder('pa')
            .select([
                'sb.name AS subDealerName',
                'sb.sub_dealer_id AS subDealerId'
            ])
            .leftJoin(SubDealerEntity, 'sb', 'sb.id = pa.sub_dealer_id')
            .where('pa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('pa.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.subDealerId) {
            subDealerQuery.andWhere('sb.sub_dealer_id = :subDealerId', { subDealerId: req.subDealerId });
        }

        if (req.fromDate) {
            subDealerQuery.andWhere('DATE(pa.assign_time) >= :fromDate', { fromDate: req.fromDate });
        }

        if (req.toDate) {
            subDealerQuery.andWhere('DATE(pa.assign_time) <= :toDate', { toDate: req.toDate });
        }

        const subDealerResults = await subDealerQuery.groupBy('sb.sub_dealer_id, sb.name').getRawMany();
        response.result1 = subDealerResults.filter(sd => sd.subDealerName !== null && sd.subDealerId !== null);

        const detailedSubDealerAssignQuery = this.createQueryBuilder('pa')
            .select([
                'pa.imei_number AS imeiNumber',
                'sb.name AS subDealerName',
                'sb.sub_dealer_id AS subDealerId',
                'pa.product_name AS productName',
                'pa.sim_no AS simNumber',
                'SUM(CASE WHEN pa.status = \'assigned\' THEN COALESCE(pa.quantity, 0) ELSE 0 END) AS presentStock',
                'pa.product_status AS productStatus'
            ])
            .leftJoin(SubDealerEntity, 'sb', 'sb.id = pa.sub_dealer_id')
            .where('pa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('pa.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.subDealerId) {
            detailedSubDealerAssignQuery.andWhere('sb.sub_dealer_id = :subDealerId', { subDealerId: req.subDealerId });
        }

        if (req.fromDate) {
            detailedSubDealerAssignQuery.andWhere('DATE(pa.assign_time) >= :fromDate', { fromDate: req.fromDate });
        }

        if (req.toDate) {
            detailedSubDealerAssignQuery.andWhere('DATE(pa.assign_time) <= :toDate', { toDate: req.toDate });
        }

        const rawSubDealerResults = await detailedSubDealerAssignQuery
            .groupBy('pa.imei_number')
            .addGroupBy('sb.name')
            .addGroupBy('sb.sub_dealer_id')
            .addGroupBy('pa.product_name')
            .addGroupBy('pa.sim_no')
            .addGroupBy('pa.product_status')
            .orderBy('sb.sub_dealer_id')
            .getRawMany();

        response.rawResult1 = rawSubDealerResults.filter(item => item.subDealerName !== null && item.subDealerId !== null);

        return response;
    }


}