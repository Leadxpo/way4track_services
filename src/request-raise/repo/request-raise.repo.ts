import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { RequestRaiseEntity } from "../entity/request-raise.entity";
import { BranchEntity } from "src/branch/entity/branch.entity";
import { ProductEntity } from "src/product/entity/product.entity";
import { ProductAssignEntity } from "src/product-assign/entity/product-assign.entity";
import { ClientStatusEnum } from "src/client/enum/client-status.enum";



@Injectable()

export class RequestRaiseRepository extends Repository<RequestRaiseEntity> {

    constructor(private dataSource: DataSource) {
        super(RequestRaiseEntity, dataSource.createEntityManager());
    }

    async getTodayRequestBranchWise(req: { companyCode: string, unitCode: string, branch?: string }) {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0]; // Extract YYYY-MM-DD

        const query = this.createQueryBuilder('re')
            .select([
                'br.name AS branch',
                'pr.product_name AS productName',
                'SUM(pa.number_of_products) AS totalProducts' // Sum of products per product name
            ])
            .leftJoin(BranchEntity, 'br', 'br.id = re.branch_id')
            .leftJoin(ProductAssignEntity, 'pa', 'pa.request_id = re.id') // Proper join
            .leftJoin(ProductEntity, 'pr', 'pr.id = pa.product_id') // Proper join

            .where('re.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('re.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('re.status = :status', { status: ClientStatusEnum.pending }) // Status filter
            .andWhere('DATE(re.created_at) = :today', { today: todayStr }); // Only today’s records

        // if (req.branch) {
        //     query.andWhere('br.name = :branchName', { branchName: req.branch });
        // }

        query.groupBy('br.name, pr.product_name');

        return query.getRawMany();
    }


}