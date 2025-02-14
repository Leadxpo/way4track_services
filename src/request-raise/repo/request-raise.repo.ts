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
        const query = this.createQueryBuilder('re')
            .select([
                'br.name AS branch',  // 'branch' is the alias for 'br.name'
                'pr.product_name AS productName',
                'SUM(pa.number_of_products) AS totalProducts' // Sum of products per product name
            ])
            .leftJoin(BranchEntity, 'br', 'br.id = re.branch_id')
            .leftJoin(ProductAssignEntity, 'pa', 'pa.request_id = re.id') // Proper join
            .leftJoin(ProductEntity, 'pr', 'pr.id = pa.product_id') // Proper join
            .where('re.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('re.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('re.status = :status', { status: ClientStatusEnum.pending }) // Status filter
          

        query.groupBy('br.name, pr.product_name');

        const result = await query.getRawMany();

        // Transforming the result to match the desired structure
        const transformedResult = [];

        result.forEach((item) => {
            // Find if the branch already exists based on 'branch' (the alias for 'br.name')
            const existingBranch = transformedResult.find(branch => branch.location === item.branch);

            // If branch exists, push the product request to that branch
            if (existingBranch) {
                existingBranch.requests.push({
                    name: item.productName,
                    count: Number(item.totalProducts),
                });
            } else {
                // If branch doesn't exist, create a new branch object with 'location' as 'branch'
                transformedResult.push({
                    location: item.branch,  // The 'branch' is the alias for 'br.name'
                    requests: [{
                        name: item.productName,
                        count: Number(item.totalProducts),
                    }],
                });
            }
        });

        return transformedResult;
    }



}