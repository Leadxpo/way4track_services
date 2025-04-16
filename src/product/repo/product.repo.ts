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
                'pt.name AS productName',
                `SUM(CASE WHEN pr.status = 'not_assigned' THEN COALESCE(pr.quantity, 0) ELSE 0 END) AS notAssignedStock`,
                `SUM(CASE WHEN pr.status = 'assigned' THEN COALESCE(pr.quantity, 0) ELSE 0 END) AS assignedStock`,
                `SUM(CASE WHEN pr.status = 'inHand' THEN COALESCE(pr.quantity, 0) ELSE 0 END) AS inHandStock`,
            ])
            .leftJoin(ProductTypeEntity, 'pt', 'pt.id = pr.product_type_id')
            .where('pt.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('pt.unit_code = :unitCode', { unitCode: req.unitCode });

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
    // async productAssignDetails(req: {
    //     branchName?: string;
    //     subDealerId?: string;
    //     staffId?: string;
    //     companyCode?: string;
    //     unitCode?: string;
    //     fromDate?: string;
    //     toDate?: string;
    // }): Promise<any> {
    //     const response: any = {};

    //     const { companyCode, unitCode, fromDate, toDate, branchName, subDealerId, staffId } = req;

    //     // ====================== BRANCH ======================
    //     const branchQuery = this.createQueryBuilder('pa')
    //         .select(['br.name AS branchName'])
    //         .leftJoin(BranchEntity, 'br', 'br.id = pa.branch_id')
    //         .where('pa.company_code = :companyCode', { companyCode })
    //         .andWhere('pa.unit_code = :unitCode', { unitCode });

    //     if (branchName) branchQuery.andWhere('br.name = :branchName', { branchName });
    //     if (fromDate) branchQuery.andWhere('DATE(pa.assign_time) >= :fromDate', { fromDate });
    //     if (toDate) branchQuery.andWhere('DATE(pa.assign_time) <= :toDate', { toDate });

    //     const branchResults = await branchQuery.groupBy('br.name').getRawMany();
    //     response.branchList = branchResults.filter(b => b.branchName !== null);

    //     const detailedBranchAssignQuery = this.createQueryBuilder('pa')
    //         .select([
    //             'br.name AS branchName',
    //             'pa.product_name AS productName',
    //             'SUM(CASE WHEN pa.status = \'assigned\' THEN COALESCE(pa.quantity, 0) ELSE 0 END) AS presentStock',
    //             'SUM(CASE WHEN pa.status = \'inHand\' THEN COALESCE(pa.quantity, 0) ELSE 0 END) AS handStock',
    //             'pa.product_status AS productStatus',
    //             'pa.assign_time AS assignTime'
    //         ])
    //         .leftJoin(BranchEntity, 'br', 'br.id = pa.branch_id')
    //         .where('pa.company_code = :companyCode', { companyCode })
    //         .andWhere('pa.unit_code = :unitCode', { unitCode });

    //     if (branchName) detailedBranchAssignQuery.andWhere('br.name = :branchName', { branchName });
    //     if (fromDate) detailedBranchAssignQuery.andWhere('DATE(pa.assign_time) >= :fromDate', { fromDate });
    //     if (toDate) detailedBranchAssignQuery.andWhere('DATE(pa.assign_time) <= :toDate', { toDate });

    //     const rawBranchResults = await detailedBranchAssignQuery
    //         .groupBy('pa.imei_number')
    //         .addGroupBy('br.name')
    //         .addGroupBy('pa.product_name')
    //         .addGroupBy('pa.product_status')
    //         .orderBy('br.name', 'ASC')
    //         .getRawMany();

    //     response.branchDetails = rawBranchResults.filter(item => item.branchName !== null);

    //     // ====================== SUB DEALER ======================
    //     const subDealerQuery = this.createQueryBuilder('pa')
    //         .select([
    //             'sb.name AS subDealerName',
    //             'sb.sub_dealer_id AS subDealerId'
    //         ])
    //         .leftJoin(SubDealerEntity, 'sb', 'sb.id = pa.sub_dealer_id')
    //         .where('pa.company_code = :companyCode', { companyCode })
    //         .andWhere('pa.unit_code = :unitCode', { unitCode });

    //     if (subDealerId) subDealerQuery.andWhere('sb.sub_dealer_id = :subDealerId', { subDealerId });
    //     if (fromDate) subDealerQuery.andWhere('DATE(pa.assign_time) >= :fromDate', { fromDate });
    //     if (toDate) subDealerQuery.andWhere('DATE(pa.assign_time) <= :toDate', { toDate });

    //     const subDealerResults = await subDealerQuery.groupBy('sb.sub_dealer_id, sb.name').getRawMany();
    //     response.subDealerList = subDealerResults.filter(sd => sd.subDealerName && sd.subDealerId);

    //     const detailedSubDealerAssignQuery = this.createQueryBuilder('pa')
    //         .select([
    //             'sb.name AS subDealerName',
    //             'sb.sub_dealer_id AS subDealerId',
    //             'pa.product_name AS productName',
    //             'SUM(CASE WHEN pa.status = \'assigned\' THEN COALESCE(pa.quantity, 0) ELSE 0 END) AS presentStock',
    //             'pa.product_status AS productStatus',
    //             'pa.assign_time AS assignTime'
    //         ])
    //         .leftJoin(SubDealerEntity, 'sb', 'sb.id = pa.sub_dealer_id')
    //         .where('pa.company_code = :companyCode', { companyCode })
    //         .andWhere('pa.unit_code = :unitCode', { unitCode });

    //     if (subDealerId) detailedSubDealerAssignQuery.andWhere('sb.sub_dealer_id = :subDealerId', { subDealerId });
    //     if (fromDate) detailedSubDealerAssignQuery.andWhere('DATE(pa.assign_time) >= :fromDate', { fromDate });
    //     if (toDate) detailedSubDealerAssignQuery.andWhere('DATE(pa.assign_time) <= :toDate', { toDate });

    //     const rawSubDealerResults = await detailedSubDealerAssignQuery
    //         .groupBy('sb.name')
    //         .addGroupBy('sb.sub_dealer_id')
    //         .addGroupBy('pa.product_name')
    //         .addGroupBy('pa.product_status')
    //         .orderBy('sb.sub_dealer_id')
    //         .getRawMany();

    //     response.subDealerDetails = rawSubDealerResults.filter(item => item.subDealerName && item.subDealerId);

    //     // ====================== STAFF ======================
    //     const staffQuery = this.createQueryBuilder('pa')
    //         .select(['sf.name AS staffName'])
    //         .leftJoin(StaffEntity, 'sf', 'sf.id = pa.staff_id')
    //         .where('pa.company_code = :companyCode', { companyCode })
    //         .andWhere('pa.unit_code = :unitCode', { unitCode });

    //     if (staffId) staffQuery.andWhere('sf.id = :staffId', { staffId });
    //     if (fromDate) staffQuery.andWhere('DATE(pa.assign_time) >= :fromDate', { fromDate });
    //     if (toDate) staffQuery.andWhere('DATE(pa.assign_time) <= :toDate', { toDate });

    //     const staffResults = await staffQuery.groupBy('sf.name').getRawMany();
    //     response.staffList = staffResults.filter(s => s.staffName !== null);

    //     const detailedStaffQuery = this.createQueryBuilder('pa')
    //         .select([
    //             'sf.name AS staffName',
    //             'pa.product_name AS productName',
    //             'SUM(CASE WHEN pa.status = \'inHand\' THEN COALESCE(pa.quantity, 0) ELSE 0 END) AS handStock',
    //             'pa.product_status AS productStatus',
    //             'pa.assign_time AS assignTime'
    //         ])
    //         .leftJoin(StaffEntity, 'sf', 'sf.id = pa.staff_id')
    //         .where('pa.company_code = :companyCode', { companyCode })
    //         .andWhere('pa.unit_code = :unitCode', { unitCode });

    //     if (staffId) detailedStaffQuery.andWhere('sf.id = :staffId', { staffId });
    //     if (fromDate) detailedStaffQuery.andWhere('DATE(pa.assign_time) >= :fromDate', { fromDate });
    //     if (toDate) detailedStaffQuery.andWhere('DATE(pa.assign_time) <= :toDate', { toDate });

    //     const rawStaffResults = await detailedStaffQuery
    //         .groupBy('sf.name')
    //         .addGroupBy('pa.product_name')
    //         .addGroupBy('pa.product_status')
    //         .getRawMany();

    //     response.staffDetails = rawStaffResults.filter(item => item.staffName !== null);

    //     return response;
    // }

    async productAssignDetails(req: {
        branchName?: string;
        subDealerId?: string;
        staffId?: string;
        companyCode?: string;
        unitCode?: string;
        fromDate?: string;
        toDate?: string;
    }): Promise<any> {
        const response: any = {};
        const { companyCode, unitCode, fromDate, toDate, branchName, subDealerId, staffId } = req;

        // ========== BRANCH ==========
        const branchQuery = this.createQueryBuilder('pa')
            .select(['br.name AS branchName'])
            .leftJoin(BranchEntity, 'br', 'br.id = pa.branch_id')
            .where('br.company_code = :companyCode', { companyCode })
            .andWhere('br.unit_code = :unitCode', { unitCode });

        if (branchName) branchQuery.andWhere('br.name = :branchName', { branchName });
        if (fromDate) branchQuery.andWhere('DATE(pa.assign_time) >= :fromDate', { fromDate });
        if (toDate) branchQuery.andWhere('DATE(pa.assign_time) <= :toDate', { toDate });

        const branchResults = await branchQuery.groupBy('br.name').getRawMany();
        response.branchList = branchResults.filter(b => b.branchName !== null);

        const detailedBranchAssignQuery = this.createQueryBuilder('pa')
            .select([
                'br.name AS branchName',
                'pa.product_name AS productName',
                'SUM(CASE WHEN pa.status = \'assigned\' THEN COALESCE(pa.quantity, 0) ELSE 0 END) AS presentStock',
                'SUM(CASE WHEN pa.status = \'inHand\' THEN COALESCE(pa.quantity, 0) ELSE 0 END) AS handStock',
                'pa.product_status AS productStatus',
                'MAX(pa.assign_time) AS assignTime'
            ])
            .leftJoin(BranchEntity, 'br', 'br.id = pa.branch_id')
            .where('br.company_code = :companyCode', { companyCode })
            .andWhere('br.unit_code = :unitCode', { unitCode });

        if (branchName) detailedBranchAssignQuery.andWhere('br.name = :branchName', { branchName });
        if (fromDate) detailedBranchAssignQuery.andWhere('DATE(pa.assign_time) >= :fromDate', { fromDate });
        if (toDate) detailedBranchAssignQuery.andWhere('DATE(pa.assign_time) <= :toDate', { toDate });

        const rawBranchResults = await detailedBranchAssignQuery
            .groupBy('br.name')
            .addGroupBy('pa.product_name')
            .addGroupBy('pa.product_status')
            .orderBy('br.name', 'ASC')
            .getRawMany();

        response.branchDetails = rawBranchResults.filter(item => item.branchName !== null);

        // ========== SUB DEALER ==========
        const subDealerQuery = this.createQueryBuilder('pa')
            .select([
                'sb.name AS subDealerName',
                'sb.sub_dealer_id AS subDealerId'
            ])
            .leftJoin(SubDealerEntity, 'sb', 'sb.id = pa.sub_dealer_id')
            .where('sb.company_code = :companyCode', { companyCode })
            .andWhere('sb.unit_code = :unitCode', { unitCode });

        if (subDealerId) subDealerQuery.andWhere('sb.sub_dealer_id = :subDealerId', { subDealerId });
        if (fromDate) subDealerQuery.andWhere('DATE(pa.assign_time) >= :fromDate', { fromDate });
        if (toDate) subDealerQuery.andWhere('DATE(pa.assign_time) <= :toDate', { toDate });

        const subDealerResults = await subDealerQuery.groupBy('sb.sub_dealer_id, sb.name').getRawMany();
        response.subDealerList = subDealerResults.filter(sd => sd.subDealerName && sd.subDealerId);

        const detailedSubDealerAssignQuery = this.createQueryBuilder('pa')
            .select([
                'sb.name AS subDealerName',
                'sb.sub_dealer_id AS subDealerId',
                'pa.product_name AS productName',
                'SUM(CASE WHEN pa.status = \'assigned\' THEN COALESCE(pa.quantity, 0) ELSE 0 END) AS presentStock',
                'pa.product_status AS productStatus',
                'MAX(pa.assign_time) AS assignTime'
            ])
            .leftJoin(SubDealerEntity, 'sb', 'sb.id = pa.sub_dealer_id')
            .where('sb.company_code = :companyCode', { companyCode })
            .andWhere('sb.unit_code = :unitCode', { unitCode });

        if (subDealerId) detailedSubDealerAssignQuery.andWhere('sb.sub_dealer_id = :subDealerId', { subDealerId });
        if (fromDate) detailedSubDealerAssignQuery.andWhere('DATE(pa.assign_time) >= :fromDate', { fromDate });
        if (toDate) detailedSubDealerAssignQuery.andWhere('DATE(pa.assign_time) <= :toDate', { toDate });

        const rawSubDealerResults = await detailedSubDealerAssignQuery
            .groupBy('sb.name')
            .addGroupBy('sb.sub_dealer_id')
            .addGroupBy('pa.product_name')
            .addGroupBy('pa.product_status')
            .orderBy('sb.sub_dealer_id')
            .getRawMany();

        response.subDealerDetails = rawSubDealerResults.filter(item => item.subDealerName && item.subDealerId);

        // ========== STAFF ==========
        const staffQuery = this.createQueryBuilder('pa')
            .select(['sf.name AS staffName'])
            .leftJoin(StaffEntity, 'sf', 'sf.id = pa.staff_id')
            .where('sf.company_code = :companyCode', { companyCode })
            .andWhere('sf.unit_code = :unitCode', { unitCode });

        if (staffId) staffQuery.andWhere('sf.id = :staffId', { staffId });
        if (fromDate) staffQuery.andWhere('DATE(pa.assign_time) >= :fromDate', { fromDate });
        if (toDate) staffQuery.andWhere('DATE(pa.assign_time) <= :toDate', { toDate });

        const staffResults = await staffQuery.groupBy('sf.name').getRawMany();
        response.staffList = staffResults.filter(s => s.staffName !== null);

        const detailedStaffQuery = this.createQueryBuilder('pa')
            .select([
                'sf.name AS staffName',
                'pa.product_name AS productName',
                'SUM(CASE WHEN pa.status = \'inHand\' THEN COALESCE(pa.quantity, 0) ELSE 0 END) AS handStock',
                'pa.product_status AS productStatus',
                'MAX(pa.assign_time) AS assignTime'
            ])
            .leftJoin(StaffEntity, 'sf', 'sf.id = pa.staff_id')
            .where('sf.company_code = :companyCode', { companyCode })
            .andWhere('sf.unit_code = :unitCode', { unitCode });

        if (staffId) detailedStaffQuery.andWhere('sf.staff_id = :staffId', { staffId });
        if (fromDate) detailedStaffQuery.andWhere('DATE(pa.assign_time) >= :fromDate', { fromDate });
        if (toDate) detailedStaffQuery.andWhere('DATE(pa.assign_time) <= :toDate', { toDate });

        const rawStaffResults = await detailedStaffQuery
            .groupBy('sf.name')
            .addGroupBy('pa.product_name')
            .addGroupBy('pa.product_status')
            .getRawMany();

        response.staffDetails = rawStaffResults.filter(item => item.staffName !== null);

        return response;
    }

}