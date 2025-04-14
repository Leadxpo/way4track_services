import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ProductAssignEntity } from "../entity/product-assign.entity";
import { BranchEntity } from "src/branch/entity/branch.entity";
import { ProductEntity } from "src/product/entity/product.entity";
import { StaffEntity } from "src/staff/entity/staff.entity";
import { RequestRaiseEntity } from "src/request-raise/entity/request-raise.entity";
import { CommonReq } from "src/models/common-req";
import { ProductIdDto } from "src/product/dto/product.id.dto";
import { ProductTypeEntity } from "src/product-type/entity/product-type.entity";
import { SubDealerEntity } from "src/sub-dealer/entity/sub-dealer.entity";



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
                // 'COUNT(pa.id) AS totalpas',
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
                'pa.id AS productId',
                'pa.sim_number_from as simNumberFrom',
                'pa.sim_number_to as simNumberTo'
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

    async getSearchDetailProduct(req: ProductIdDto) {
        const query = this.createQueryBuilder('productAssign')
            .select([
                'pr.id AS productId',
                'pr.product_name AS productName',
                'pr.product_description AS productDescription',
                'vendor.name AS vendorName',
                'pr.imei_number AS imeiNumber',
                'staff.staff_id as staffId',
                'pr.location as location',
                'SUM(CASE WHEN pr.status = \'isAssign\' THEN pa.quantity ELSE 0 END) AS inAssignStock',
                'SUM(CASE WHEN pr.status = \'inHand\' THEN pa.quantity ELSE 0 END) AS inHandStock',
                'SUM(CASE WHEN pr.status = \'not_assigned\' THEN pa.quantity ELSE 0 END) AS presentStock',
                'pr.product_status as productStatus',
                'productAssign.sim_number_from as simNumberFrom',
                'productAssign.sim_number_to as simNumberTo'
            ])
            .leftJoin(StaffEntity, 'staff', 'staff.id = productAssign.staff_id')
            .leftJoin(ProductEntity, 'pr', 'pr.id = productAssign.product_id')
            .leftJoin('pr.vendorId', 'vendor')
            .leftJoin('pr.voucherId', 'voucher')
            .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode });

        // Apply filters if provided
        if (req.id) {
            query.andWhere('pr.id = :productId', { productId: req.id });
        }


        if (req.fromDate) {
            query.andWhere('DATE(productAssign.assign_time) >= :fromDate', { fromDate: req.fromDate });
        }
        if (req.toDate) {
            query.andWhere('DATE(productAssign.assign_time) <= :toDate', { toDate: req.toDate });
        }

        if (req.productName) {
            query.andWhere('pr.product_name LIKE :productName', { productName: `%${req.productName}%` });
        }

        if (req.location) {
            query.andWhere('pr.location LIKE :location', { location: `%${req.location}%` });
        }

        if (req.staffId) {
            query.andWhere('staff.staff_id = :staffId', { staffId: req.staffId });
        }

        // Add staff_id to GROUP BY clause
        query.groupBy('pr.id, pr.product_name, pr.product_description, vendor.name, pr.imei_number, pr.location, staff.staff_id');

        // Execute and return the result
        const result = await query.getRawMany();

        // Optional: log result for debugging
        console.log(result);

        return result;
    }

    async totalProducts(req: CommonReq): Promise<any> {
        const query = this.createQueryBuilder('pa')
            .select([
                'sum(pa.number_of_products) AS totalProducts',
            ]);

        const monthResult = await query.andWhere(`DATE(pa.created_at) BETWEEN DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND CURDATE()`)
            .where(`pa.company_code = "${req.companyCode}"`)
            .andWhere(`pa.unit_code = "${req.unitCode}"`)
            .getRawOne();

        const weekResult = await query.andWhere(`DATE(pa.created_at) BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE()`)
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

    async getProductAssignmentSummary(req: { unitCode: string; companyCode: string; branch?: string, staffId?: string }) {
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

            // Query for total in-hands quantity (handle staffId if provided)
            let totalInHandsQtyQuery = this.createQueryBuilder('productAssign')
                .select('SUM(productAssign.number_of_products)', 'totalInHandsQty')
                .leftJoin(BranchEntity, 'br', 'br.id = productAssign.branch_id')
                .leftJoin(StaffEntity, 'staff', 'staff.id = productAssign.staff_id')
                .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode })
                .andWhere('productAssign.in_hands = :inHands', { inHands: 'true' });

            // If a specific branch is selected, filter for that branch
            if (req.branch) {
                totalInHandsQtyQuery.andWhere('br.name = :branchName', { branchName: req.branch });
            }

            // If staffId is provided, filter for the specific staff
            if (req.staffId) {
                totalInHandsQtyQuery.andWhere('staff.id = :staffId', { staffId: req.staffId });
            }

            const totalInHandsQty = await totalInHandsQtyQuery.getRawOne();

            // Query for total quantity (assigned + in-hands)
            let totalQtyQuery = this.createQueryBuilder('productAssign')
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
            // Query for grouped product details
            const groupedProductQuery = this.createQueryBuilder('productAssign')
                .select([
                    'pa.id AS productId',
                    'pa.product_name AS productName',
                    'pt.name AS productType',
                    'br.name AS branchName',
                    'SUM(productAssign.number_of_products) AS totalProducts',
                    'SUM(CASE WHEN productAssign.in_hands = true THEN productAssign.number_of_products ELSE 0 END) AS totalInHandsQty',
                    'productAssign.status AS status'
                ])
                .leftJoin(BranchEntity, 'br', 'br.id = productAssign.branch_id')
                .leftJoin(ProductEntity, 'pa', 'pa.id = productAssign.product_id')
                .leftJoin(ProductTypeEntity, 'pt', 'pt.id = productAssign.product_type_id')
                .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode });

            // If a specific branch is selected, filter for that branch
            if (req.branch) {
                groupedProductQuery.andWhere('br.name = :branchName', { branchName: req.branch });
            }

            groupedProductQuery.groupBy('pa.id, pa.product_name, br.name, pt.name, productAssign.status');

            // Execute query for grouped product details
            const productDetails = await groupedProductQuery.getRawMany();

            // Query to fetch product photos separately
            const photoQuery = this.createQueryBuilder('productAssign')
                .select([
                    'pt.id AS productTypeId',
                    'pt.product_photo AS productAssignPhoto'
                ])
                .leftJoin(ProductTypeEntity, 'pt', 'pt.id = productAssign.product_type_id')
                .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode });

            if (req.branch) {
                photoQuery.andWhere('productAssign.branch_id IN (SELECT id FROM branch WHERE name = :branchName)', { branchName: req.branch });
            }

            const productPhotos = await photoQuery.getRawMany();

            // Map photos to products
            const productPhotoMap = new Map<string, string>();
            productPhotos.forEach(photo => {
                productPhotoMap.set(photo.productTypeId, photo.productAssignPhoto);
            });

            // Transform data into the required format
            const branchesMap = new Map<string, any>();

            productDetails.forEach((product) => {
                const { productId, productName, productType, branchName, totalProducts, totalInHandsQty, productTypeId } = product;

                if (!branchesMap.has(branchName)) {
                    branchesMap.set(branchName, {
                        branchName: branchName || 'N/A',
                        products: []
                    });
                }

                branchesMap.get(branchName)?.products.push({
                    id: Number(productId) || 0,
                    name: productName || 'N/A',
                    type: productType || 'N/A',
                    totalProducts: Number(totalProducts) || 0,
                    totalInHandsQty: Number(totalInHandsQty) || 0,
                    photo: productPhotoMap.get(productTypeId) || null // Assign photo from the mapped result
                });
            });

            return Array.from(branchesMap.values());
        } catch (error) {
            console.error('Error fetching product details by branch:', error);
            throw new Error('Failed to fetch product details by branch');
        }
    }



    async getProductWareHouseDetails(req: { unitCode: string; companyCode: string; }) {
        try {
            // Base query for grouping products by product name only
            const groupedProductQuery = this.createQueryBuilder('productAssign')
                .select([
                    'pa.id AS productId',
                    'pa.product_name AS productName',
                    'pt.name AS productType',
                    'productAssign.status AS status',
                    'SUM(productAssign.number_of_products) AS totalProducts',
                    'SUM(CASE WHEN productAssign.in_hands = true THEN productAssign.number_of_products ELSE 0 END) AS totalInHandsQty'
                ])
                .leftJoin(ProductEntity, 'pa', 'pa.id = productAssign.product_id')
                .leftJoin(ProductTypeEntity, 'pt', 'pt.id = productAssign.product_type_id')
                .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode });

            // Group by product name, product type, and status
            groupedProductQuery.groupBy('pa.id, pa.product_name, productAssign.status');

            // Execute query to fetch products with the total and in-hands quantity
            const productDetails = await groupedProductQuery.getRawMany();

            // Transform data into the required format (aggregating per product name)
            const productsMap = new Map<string, any>();

            productDetails.forEach((product) => {
                const { productId, productName, productType, status, totalProducts, totalInHandsQty } = product;

                // If the product is not yet added in the map, initialize it
                if (!productsMap.has(productName)) {
                    productsMap.set(productName, {
                        productName: productName || 'N/A',
                        productType: productType || 'N/A',
                        status: status || 'N/A',
                        totalProducts: 0,
                        totalInHandsQty: 0
                    });
                }

                // Accumulate the total products and in-hands quantity for each product
                const existingProduct = productsMap.get(productName);
                if (existingProduct) {
                    existingProduct.totalProducts += Number(totalProducts) || 0;
                    existingProduct.totalInHandsQty += Number(totalInHandsQty) || 0;
                }
            });

            // Convert the map to an array of product objects
            const results = Array.from(productsMap.values());

            return {
                status: true,
                errorCode: 200,
                internalMessage: "Data retrieved successfully",
                data: results
            };

        } catch (error) {
            console.error('Error fetching product details:', error);
            throw new Error('Failed to fetch product details');
        }
    }



    //New APIS


    async getBranchManagerDetailProduct(req: { companyCode: string, unitCode: string, branchName?: string }) {
        console.log('Request Object:', req);

        const query = this.createQueryBuilder('pa')
            .select([
                'pt.name AS productName',
                'SUM((pa.number_of_products, 0) ) AS presentStock',
                'br.name as branchName'
            ])
            .leftJoin(ProductTypeEntity, 'pt', 'pt.id = pr.product_type_id')
            .leftJoin(BranchEntity, 'br', 'br.id = productAssign.branch_id')
            .where('pr.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('pr.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy('pt.name'); // Grouping by the correct alias

        const result = await query.getRawMany();
        return result;
    }

    async getWareHouseProductDetailsByBranch(req: {
        unitCode: string;
        companyCode: string;
        branch?: string;
        fromDate?: string;
        toDate?: string;
    }) {
        try {
            // Base query
            const groupedProductQuery = this.createQueryBuilder('productAssign')
                .select([
                    'pa.id AS productId',
                    'pa.product_name AS productName',
                    'pt.name AS productType',
                    'br.name AS branchName',
                    'SUM(CASE WHEN pa.status = \'isAssign\' THEN productAssign.number_of_products ELSE 0 END) AS inAssignStock',
                    'SUM(CASE WHEN pa.status = \'inHand\' THEN productAssign.number_of_products ELSE 0 END) AS inHandStock',
                    'SUM(CASE WHEN pa.status = \'not_assigned\' THEN pa.quantity ELSE 0 END) AS presentStock',
                    'pa.product_status as productStatus',

                ])
                .leftJoin(BranchEntity, 'br', 'br.id = productAssign.branch_id')
                .leftJoin(ProductEntity, 'pa', 'pa.id = productAssign.product_id')
                .leftJoin(ProductTypeEntity, 'pt', 'pt.id = pa.product_type_id')
                .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode });

            // Apply filters dynamically
            if (req.branch) {
                groupedProductQuery.andWhere('br.name = :branchName', { branchName: req.branch });
            }
            if (req.fromDate) {
                groupedProductQuery.andWhere('DATE(productAssign.assign_time) >= :fromDate', { fromDate: req.fromDate });
            }
            if (req.toDate) {
                groupedProductQuery.andWhere('DATE(productAssign.assign_time) <= :toDate', { toDate: req.toDate });
            }

            // Grouping fields
            groupedProductQuery.groupBy('pa.id, pa.product_name, pt.name, br.name');

            // Execute query
            const productDetails = await groupedProductQuery.getRawMany();

            // Transform data into required format
            const branchesMap = new Map<string, any>();

            productDetails.forEach((product) => {
                const { productId, productName, productType, branchName, inAssignStock, inHandStock, presentStock } = product;

                const branchKey = branchName || 'WareHouse';

                // Initialize branch in map
                if (!branchesMap.has(branchKey)) {
                    branchesMap.set(branchKey, {
                        branchName: branchKey,
                        products: []
                    });
                }

                // Push product details into respective branch
                branchesMap.get(branchKey)?.products.push({
                    id: Number(productId) || 0,
                    name: productName || 'N/A',
                    type: productType || 'N/A',
                    inAssignStock: Number(inAssignStock) || 0,
                    inHandStock: Number(inHandStock) || 0,
                    presentStock: Number(presentStock) || 0
                });
            });

            // Convert map to array
            return Array.from(branchesMap.values());
        } catch (error) {
            console.error('Error fetching product details by branch:', error);
            throw new Error('Failed to fetch product details by branch');
        }
    }


    async getStockSummary(req: ProductIdDto) {
        const query = this.createQueryBuilder('productAssign')
            .select([
                'pr.product_name AS productName',
                'pr.product_description AS productDescription',
                'pr.imei_number AS imeiNumber',
                'pr.location AS location',
                'pt.name AS productType',
                'pr.status AS productStatus',
                'SUM(CASE WHEN pr.status = \'isAssign\' THEN productAssign.number_of_products ELSE 0 END) AS inAssignStock',
                'SUM(CASE WHEN pr.status = \'install\' THEN productAssign.number_of_products ELSE 0 END) AS installStock',
                'SUM(CASE WHEN pr.status = \'inHand\' THEN productAssign.number_of_products ELSE 0 END) AS inHandStock',
                'SUM(CASE WHEN pr.status = \'not_assigned\' THEN pr.quantity ELSE 0 END) AS presentStock',
                'br.name as branchName',
                'productAssign.sim_number_from as simNumberFrom',
                'productAssign.sim_number_to as simNumberTo'
            ])
            .leftJoin(BranchEntity, 'br', 'br.id = productAssign.branch_id')
            .leftJoin(ProductEntity, 'pr', 'pr.id = productAssign.product_id')
            .leftJoin(ProductTypeEntity, 'pt', 'pt.id = productAssign.product_type_id')
            .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode });
        if (req.branchName) {
            query.andWhere('br.name = :branchName', { branchName: req.branchName });
        }
        // Apply filters conditionally
        if (req.fromDate) {
            query.andWhere('DATE(productAssign.assign_time) >= :fromDate', { fromDate: req.fromDate });
        }
        if (req.toDate) {
            query.andWhere('DATE(productAssign.assign_time) <= :toDate', { toDate: req.toDate });
        }
        if (req.productType) {
            query.andWhere('pt.name LIKE :productType', { productType: `%${req.productType}%` });
        }
        if (req.status) {
            query.andWhere('pr.status = :status', { status: req.status });
        }

        // Grouping by all selected fields
        query.groupBy(' pr.product_name, pr.product_description, pr.imei_number, pr.location, pt.name, pr.status,br.name');

        // Execute and return results
        const result = await query.getRawMany();

        // Debugging log
        console.log(result);

        return result;
    }


    async getProductDetailsBy(req: {
        unitCode: string;
        companyCode: string;
        branch?: string;
        fromDate?: string;
        toDate?: string;
    }) {
        try {
            // Base query
            const groupedProductQuery = this.createQueryBuilder('productAssign')
                .select([
                    'pt.name AS productType',
                    'br.name AS branchName',
                    'SUM(CASE WHEN pa.status = \'isAssign\' THEN productAssign.number_of_products ELSE 0 END) AS inAssignStock',
                    'SUM(CASE WHEN pa.status = \'inHand\' THEN productAssign.number_of_products ELSE 0 END) AS inHandStock',
                    'SUM(CASE WHEN pa.status = \'not_assigned\' THEN pa.quantity ELSE 0 END) AS presentStock',
                    'ANY_VALUE(pa.product_status) as productStatus'
                ])
                .leftJoin(BranchEntity, 'br', 'br.id = productAssign.branch_id')
                .leftJoin(ProductEntity, 'pa', 'pa.id = productAssign.product_id')
                .leftJoin(ProductTypeEntity, 'pt', 'pt.id = pa.product_type_id')
                .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode });

            // Apply filters dynamically
            if (req.branch) {
                groupedProductQuery.andWhere('br.name = :branchName', { branchName: req.branch });
            }
            if (req.fromDate) {
                groupedProductQuery.andWhere('DATE(productAssign.assign_time) >= :fromDate', { fromDate: req.fromDate });
            }
            if (req.toDate) {
                groupedProductQuery.andWhere('DATE(productAssign.assign_time) <= :toDate', { toDate: req.toDate });
            }

            // Grouping fields
            groupedProductQuery.groupBy('pt.name, br.name');

            // Execute query
            const productDetails = await groupedProductQuery.getRawMany();

            // Transform data into required format
            const branchesMap = new Map<string, any>();

            productDetails.forEach((product) => {
                const { productType, branchName, inAssignStock, inHandStock, presentStock, productStatus } = product;

                const branchKey = branchName || 'WareHouse';

                // Initialize branch in map
                if (!branchesMap.has(branchKey)) {
                    branchesMap.set(branchKey, {
                        branchName: branchKey,
                        products: []
                    });
                }

                // Push product details into respective branch
                branchesMap.get(branchKey)?.products.push({
                    // id: Number(productId) || 0,
                    // name: productName || 'N/A',
                    type: productType || 'N/A',
                    inAssignStock: Number(inAssignStock) || 0,
                    inHandStock: Number(inHandStock) || 0,
                    presentStock: Number(presentStock) || 0,
                    productStatus: Number(productStatus) || 0
                });
            });

            // Convert map to array
            return Array.from(branchesMap.values());
        } catch (error) {
            console.error('Error fetching product details by branch:', error);
            throw new Error('Failed to fetch product details by branch');
        }
    }

    async productSubDealerAssignDetails(req: {
        subDealerId?: string;
        companyCode: string;
        unitCode: string;
        subDealerName?: string;

    }): Promise<{ result: any[]; rawResults: any[] }> {
        // Grouped branches query
        const groupedBranchesQuery = this.createQueryBuilder('pa')
            .select([
                'sb.name AS subDealerName',
                'sb.sub_dealer_id AS subDealerId',
            ])
            .leftJoin(SubDealerEntity, 'sb', 'sb.id = pa.sub_dealer_id')
            .where('pa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('pa.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.subDealerId) {
            groupedBranchesQuery.andWhere('sb.sub_dealer_id = :subDealerId', { subDealerId: req.subDealerId });
        }

        const result = await groupedBranchesQuery.groupBy('sb.sub_dealer_id').getRawMany();

        // Detailed assignment query
        const detailedAssignQuery = this.createQueryBuilder('pa')
            .select([
                're.request_id AS requestId',
                'pa.branch_person AS branchOrPerson',
                'pa.imei_number_from AS imeiNumberFrom',
                'pa.imei_number_to AS imeiNumberTo',
                'pa.number_of_products AS numberOfProducts',
                'pr.product_name AS productName',
                'pr.product_photo AS productPhoto',
                'pa.id AS productId',
                'sb.name AS subDealerName',
                'sb.sub_dealer_id AS subDealerId',
                'pa.sim_number_from as simNumberFrom',
                'pa.sim_number_to as simNumberTo'
            ])
            .leftJoin(ProductEntity, 'pr', 'pr.id = pa.product_id')
            .leftJoin(RequestRaiseEntity, 're', 're.id = pa.request_id')
            .leftJoin(SubDealerEntity, 'sb', 'sb.id = pa.sub_dealer_id')
            .where('pa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('pa.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.subDealerId) {
            detailedAssignQuery.andWhere('sb.sub_dealer_id = :subDealerId', { subDealerId: req.subDealerId });
        }

        if (req.subDealerName) {
            detailedAssignQuery.andWhere('sb.name = :subDealerName', { subDealerName: req.subDealerName });
        }

        const rawResults = await detailedAssignQuery.orderBy('sb.name', 'ASC').getRawMany();

        return { result, rawResults };
    }

    async getProductDetailsBySubDealer(req: {
        unitCode: string;
        companyCode: string;
        subDealerId?: string;
        fromDate?: string;
        toDate?: string;
    }) {
        try {
            // Base query
            const groupedProductQuery = this.createQueryBuilder('productAssign')
                .select([
                    'pt.name AS productType',
                    'sb.name AS subDealerName',
                    'sb.sub_dealer_id as subDealerId',
                    'SUM(CASE WHEN pa.status = \'isAssign\' THEN productAssign.number_of_products ELSE 0 END) AS inAssignStock',
                    'SUM(CASE WHEN pa.status = \'inHand\' THEN productAssign.number_of_products ELSE 0 END) AS inHandStock',
                    'ANY_VALUE(pa.product_status) as productStatus'
                ])
                .leftJoin(ProductEntity, 'pa', 'pa.id = productAssign.product_id')
                .leftJoin(ProductTypeEntity, 'pt', 'pt.id = pa.product_type_id')
                .leftJoin(SubDealerEntity, 'sb', 'sb.id = productAssign.sub_dealer_id')
                .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode });


            if (req.subDealerId) {
                groupedProductQuery.andWhere('sb.sub_dealer_id = :subDealerId', { subDealerId: req.subDealerId });
            }
            if (req.fromDate) {
                groupedProductQuery.andWhere('DATE(productAssign.assign_time) >= :fromDate', { fromDate: req.fromDate });
            }
            if (req.toDate) {
                groupedProductQuery.andWhere('DATE(productAssign.assign_time) <= :toDate', { toDate: req.toDate });
            }

            // Grouping fields
            groupedProductQuery.groupBy('pt.name, sb.name, sb.sub_dealer_id');
            

            // Execute query
            const productDetails = await groupedProductQuery.getRawMany();

            // Transform data into required format
            const branchesMap = new Map<string, any>();

            productDetails.forEach((product) => {
                const { productType, subDealerId, inAssignStock, inHandStock, productStatus } = product;

                const branchKey = subDealerId || 'WareHouse';

                // Initialize branch in map
                if (!branchesMap.has(branchKey)) {
                    branchesMap.set(branchKey, {
                        subDealerId: branchKey,
                        products: []
                    });
                }

                // Push product details into respective branch
                branchesMap.get(branchKey)?.products.push({
                    // id: Number(productId) || 0,
                    // name: productName || 'N/A',
                    type: productType || 'N/A',
                    inAssignStock: Number(inAssignStock) || 0,
                    inHandStock: Number(inHandStock) || 0,
                    productStatus: Number(productStatus) || 0
                });
            });

            // Convert map to array
            return Array.from(branchesMap.values());
        } catch (error) {
            console.error('Error fetching product details by branch:', error);
            throw new Error('Failed to fetch product details by branch');
        }
    }

    async getProductAssignmentSummaryBySubDealer(req: { unitCode: string; companyCode: string; subDealerId?: string }) {
        try {
            // Query for grouped branches
            const groupedBranchesQuery = this.createQueryBuilder('productAssign')
                .select(['sb.name AS subDealerName', 'sb.sub_dealer_id as subDealerId'])
                .leftJoin(SubDealerEntity, 'sb', 'sb.id = productAssign.sub_dealer_id')
                .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode });

            if (req.subDealerId) {
                groupedBranchesQuery.andWhere('sb.sub_dealer_id = :subDealerId', { subDealerId: req.subDealerId });
            }

            const groupedBranches = await groupedBranchesQuery.groupBy('sb.name, sb.sub_dealer_id').getRawMany();

            // Query for total assigned quantity
            const totalAssignedQtyQuery = this.createQueryBuilder('productAssign')
                .select('SUM(productAssign.number_of_products)', 'totalAssignedQty')
                .leftJoin(SubDealerEntity, 'sb', 'sb.id = productAssign.sub_dealer_id')
                .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode })
                .andWhere('productAssign.is_assign = :isAssign', { isAssign: true });

            if (req.subDealerId) {
                totalAssignedQtyQuery.andWhere('sb.sub_dealer_id = :subDealerId', { subDealerId: req.subDealerId });
            }

            const totalAssignedQty = await totalAssignedQtyQuery.getRawOne();

            // Query for total in-hands quantity
            const totalInHandsQtyQuery = this.createQueryBuilder('productAssign')
                .select('SUM(productAssign.number_of_products)', 'totalInHandsQty')
                .leftJoin(SubDealerEntity, 'sb', 'sb.id = productAssign.sub_dealer_id')
                .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode })
                .andWhere('productAssign.in_hands = :inHands', { inHands: true });

            if (req.subDealerId) {
                totalInHandsQtyQuery.andWhere('sb.sub_dealer_id = :subDealerId', { subDealerId: req.subDealerId });
            }

            const totalInHandsQty = await totalInHandsQtyQuery.getRawOne();

            // Combine results
            const results = {
                groupedSubDealers: groupedBranches?.map((branch) => ({
                    subDealerId: branch?.subDealerId || 'N/A',
                })) || [],
                totalAssignedQty: Number(totalAssignedQty?.totalAssignedQty ?? 0),
                totalInHandsQty: Number(totalInHandsQty?.totalInHandsQty ?? 0),
                totalQty:
                    Number(totalAssignedQty?.totalAssignedQty ?? 0) -
                    Number(totalInHandsQty?.totalInHandsQty ?? 0),
            };


            return results;

        } catch (error) {
            console.error('Error fetching product assignment summary:', error);
            throw new Error('Failed to fetch product assignment data');
        }
    }



}

