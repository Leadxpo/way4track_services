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
    async getProductAssignmentSummary(req: { unitCode: string; companyCode: string; branch?: string }) {
        try {
            // Base query for grouping branches
            const groupedBranchesQuery = this.createQueryBuilder('productAssign')
                .select(['br.name AS branchName'])
                .leftJoin(BranchEntity, 'br', 'br.id = productAssign.branch_id')
                .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode });

            // If a specific branch is selected, filter for that branch
            if (req.branch) {
                groupedBranchesQuery.andWhere('br.name = :branchName', { branchName: req.branch });
            }

            const groupedBranches = await groupedBranchesQuery.groupBy('br.name').getRawMany();

            // Query for total assigned quantity
            const totalAssignedQtyQuery = this.createQueryBuilder('productAssign')
                .select('SUM(productAssign.number_of_products)', 'totalAssignedQty')
                .leftJoin(BranchEntity, 'br', 'br.id = productAssign.branch_id')
                .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode })
                .andWhere('productAssign.is_assign = :isAssign', { isAssign: 'true' });

            // If a specific branch is selected, filter for that branch
            if (req.branch) {
                totalAssignedQtyQuery.andWhere('br.name = :branchName', { branchName: req.branch });
            }

            const totalAssignedQty = await totalAssignedQtyQuery.getRawOne();

            // Query for total in-hands quantity
            const totalInHandsQtyQuery = this.createQueryBuilder('productAssign')
                .select('SUM(productAssign.number_of_products)', 'totalInHandsQty')
                .leftJoin(BranchEntity, 'br', 'br.id = productAssign.branch_id')
                .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode })
                .andWhere('productAssign.in_hands = :inHands', { inHands: 'true' });

            // If a specific branch is selected, filter for that branch
            if (req.branch) {
                totalInHandsQtyQuery.andWhere('br.name = :branchName', { branchName: req.branch });
            }

            const totalInHandsQty = await totalInHandsQtyQuery.getRawOne();

            // Query for total quantity (assigned + in-hands)
            const totalQtyQuery = this.createQueryBuilder('productAssign')
                .select('SUM(productAssign.number_of_products)', 'totalQty')
                .leftJoin(BranchEntity, 'br', 'br.id = productAssign.branch_id')
                .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode });

            // If a specific branch is selected, filter for that branch
            if (req.branch) {
                totalQtyQuery.andWhere('br.name = :branchName', { branchName: req.branch });
            }

            const totalQty = await totalQtyQuery.getRawOne();

            // Combining results into a single object
            const results = {
                groupedBranches: groupedBranches.map(branch => ({
                    branchName: branch.branchName || 'N/A',
                })),
                totalAssignedQty: Number(totalAssignedQty?.totalAssignedQty || 0),
                totalInHandsQty: Number(totalInHandsQty?.totalInHandsQty || 0),
                totalQty: Number(totalQty?.totalQty || 0),
            };

            return results;

        } catch (error) {
            console.error('Error fetching product assignment summary:', error);
            throw new Error('Failed to fetch product assignment data');
        }
    }

    async getProductDetailsByBranch(req: { unitCode: string; companyCode: string; branch?: string }) {
        try {
            // Base query for grouping products by branch
            const groupedProductQuery = this.createQueryBuilder('productAssign')
                .select([
                    'pa.id AS productId',
                    'pa.product_name AS productName',
                    'productAssign.product_type AS productType',
                    'br.name AS branchName',
                    'SUM(productAssign.number_of_products) AS totalProducts'
                ])
                .leftJoin(BranchEntity, 'br', 'br.id = productAssign.branch_id')
                .leftJoin(ProductEntity, 'pa', 'pa.id = productAssign.product_id')
                .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode })
                .groupBy('productAssign.product_id, pa.product_name, productAssign.product_type, br.name');

            // If a specific branch is selected, filter for that branch
            if (req.branch) {
                groupedProductQuery.andWhere('br.name = :branchName', { branchName: req.branch });
            }

            // Execute query to fetch products grouped by branch
            const productDetails = await groupedProductQuery.getRawMany();

            // Transform data into the required format
            const branchesMap = new Map<string, any>();

            productDetails.forEach((product) => {
                // For each product, we are grouping by branch name
                const { productId, productName, productType, branchName, totalProducts, productImg } = product;

                // If the branch is not yet added in the map, initialize it
                if (!branchesMap.has(branchName)) {
                    branchesMap.set(branchName, {
                        branchName: branchName || 'N/A',
                        products: []
                    });
                }

                // Push the product details into the respective branch
                branchesMap.get(branchName)?.products.push({
                    id: Number(productId) || 0,
                    name: productName || 'N/A',
                    type: productType || 'N/A',
                    count: Number(totalProducts) || 0
                });
            });

            // Convert the map to an array of branch objects
            const results = Array.from(branchesMap.values());

            return results;

        } catch (error) {
            console.error('Error fetching product details by branch:', error);
            throw new Error('Failed to fetch product details by branch');
        }
    }
}

