import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { RequestRaiseEntity, RequestType } from "../entity/request-raise.entity";
import { BranchEntity } from "src/branch/entity/branch.entity";
import { ProductEntity } from "src/product/entity/product.entity";
import { ProductAssignEntity } from "src/product-assign/entity/product-assign.entity";
import { ClientStatusEnum } from "src/client/enum/client-status.enum";
import { RequestTypeProducts } from "../dto/request-raise.dto";



@Injectable()

export class RequestRaiseRepository extends Repository<RequestRaiseEntity> {

    constructor(private dataSource: DataSource) {
        super(RequestRaiseEntity, dataSource.createEntityManager());
    }
    //New APi ware house manager 
    async getRequestBranchWise(req: { companyCode: string, unitCode: string, branch?: string, fromDate?: string, toDate?: string }) {
        const query = this.createQueryBuilder('re')
            .select([
                'br.name AS branch',  // Branch name
                're.products AS products',  // JSON column containing product requests
            ])
            .leftJoin(BranchEntity, 'br', 'br.id = re.branch_id')
            .where('re.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('re.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('re.status = :status', { status: ClientStatusEnum.pending }) // Pending requests
            .andWhere('re.request_type = :requestType', { requestType: RequestType.products }); // Only "products" type requests

        if (req.branch) {
            query.andWhere('br.name = :branch', { branch: req.branch });
        }

      

        query.groupBy('br.name, re.products'); 

        const result = await query.getRawMany();

        // Transform the result
        const transformedResult = [];

        result.forEach((item) => {
            const existingBranch = transformedResult.find(branch => branch.location === item.branch);

            // Parse JSON column 'products'
            const productList: RequestTypeProducts[] = typeof item.products === 'string'
                ? JSON.parse(item.products)
                : item.products || [];

            if (existingBranch) {
                // Add products to existing branch
                productList.forEach((product) => {
                    const existingProduct = existingBranch.requests.find(req => req.name === product.productType);
                    if (existingProduct) {
                        existingProduct.count += product.quantity;
                    } else {
                        existingBranch.requests.push({
                            name: product.productType,
                            count: product.quantity,
                        });
                    }
                });
            } else {
                // Create a new branch entry
                transformedResult.push({
                    location: item.branch,
                    requests: productList.map(product => ({
                        name: product.productType,
                        count: product.quantity,
                    })),
                });
            }
        });

        return transformedResult;
    }




}