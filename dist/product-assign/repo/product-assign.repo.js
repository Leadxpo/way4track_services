"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductAssignRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const product_assign_entity_1 = require("../entity/product-assign.entity");
const branch_entity_1 = require("../../branch/entity/branch.entity");
const product_entity_1 = require("../../product/entity/product.entity");
const staff_entity_1 = require("../../staff/entity/staff.entity");
const request_raise_entity_1 = require("../../request-raise/entity/request-raise.entity");
const product_type_entity_1 = require("../../product-type/entity/product-type.entity");
const sub_dealer_entity_1 = require("../../sub-dealer/entity/sub-dealer.entity");
let ProductAssignRepository = class ProductAssignRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(product_assign_entity_1.ProductAssignEntity, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async productAssignDetails(req) {
        const groupedBranchesQuery = this.createQueryBuilder('pa')
            .select([
            'br.name AS branchName',
        ])
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = pa.branch_id')
            .where('pa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('pa.unit_code = :unitCode', { unitCode: req.unitCode });
        if (req.branchName) {
            groupedBranchesQuery.andWhere('br.name = :branchName', { branchName: req.branchName });
        }
        const result = await groupedBranchesQuery.groupBy('br.name').getRawMany();
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
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = pa.branch_id')
            .leftJoin(product_entity_1.ProductEntity, 'pr', 'pr.id = pa.product_id')
            .leftJoin(staff_entity_1.StaffEntity, 'sa', 'sa.id = pa.staff_id')
            .leftJoin(request_raise_entity_1.RequestRaiseEntity, 're', 're.id = pa.request_id')
            .where('pa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('pa.unit_code = :unitCode', { unitCode: req.unitCode });
        if (req.branchName) {
            detailedAssignQuery.andWhere('br.name = :branchName', { branchName: req.branchName });
        }
        const rawResults = await detailedAssignQuery.orderBy('br.name', 'ASC').getRawMany();
        return { result, rawResults };
    }
    async getSearchDetailProduct(req) {
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
            .leftJoin(staff_entity_1.StaffEntity, 'staff', 'staff.id = productAssign.staff_id')
            .leftJoin(product_entity_1.ProductEntity, 'pr', 'pr.id = productAssign.product_id')
            .leftJoin('pr.vendorId', 'vendor')
            .leftJoin('pr.voucherId', 'voucher')
            .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode });
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
        query.groupBy('pr.id, pr.product_name, pr.product_description, vendor.name, pr.imei_number, pr.location, staff.staff_id');
        const result = await query.getRawMany();
        console.log(result);
        return result;
    }
    async totalProducts(req) {
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
    async getTotalAssignedAndStockLast30Days(req) {
        const result = await this.createQueryBuilder('pa')
            .select('SUM(pa.number_of_products)', 'totalAssigned')
            .leftJoin(product_entity_1.ProductEntity, 'p', 'p.id = pa.product_id')
            .leftJoinAndSelect(branch_entity_1.BranchEntity, 'branch', 'branch.id = pa.branch_id')
            .where('DATE(pa.assign_time) BETWEEN DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND CURDATE()')
            .groupBy('pa.product_id')
            .where(`pa.company_code = "${req.companyCode}"`)
            .andWhere(`pa.unit_code = "${req.unitCode}"`)
            .getRawMany();
        const productStocks = await this.createQueryBuilder('pa')
            .addSelect('SUM(p.number_of_products)', 'numberOfProducts')
            .leftJoin(product_entity_1.ProductEntity, 'p', 'p.id = pa.product_id')
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
    async getProductAssignmentSummary(req) {
        try {
            const groupedBranchesQuery = this.createQueryBuilder('productAssign')
                .select(['br.name AS branchName'])
                .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = productAssign.branch_id')
                .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode });
            if (req.branch) {
                groupedBranchesQuery.andWhere('br.name = :branchName', { branchName: req.branch });
            }
            const groupedBranches = await groupedBranchesQuery.groupBy('br.name').getRawMany();
            const totalAssignedQtyQuery = this.createQueryBuilder('productAssign')
                .select('SUM(productAssign.number_of_products)', 'totalAssignedQty')
                .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = productAssign.branch_id')
                .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode })
                .andWhere('productAssign.is_assign = :isAssign', { isAssign: 'true' });
            if (req.branch) {
                totalAssignedQtyQuery.andWhere('br.name = :branchName', { branchName: req.branch });
            }
            const totalAssignedQty = await totalAssignedQtyQuery.getRawOne();
            let totalInHandsQtyQuery = this.createQueryBuilder('productAssign')
                .select('SUM(productAssign.number_of_products)', 'totalInHandsQty')
                .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = productAssign.branch_id')
                .leftJoin(staff_entity_1.StaffEntity, 'staff', 'staff.id = productAssign.staff_id')
                .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode })
                .andWhere('productAssign.in_hands = :inHands', { inHands: 'true' });
            if (req.branch) {
                totalInHandsQtyQuery.andWhere('br.name = :branchName', { branchName: req.branch });
            }
            if (req.staffId) {
                totalInHandsQtyQuery.andWhere('staff.id = :staffId', { staffId: req.staffId });
            }
            const totalInHandsQty = await totalInHandsQtyQuery.getRawOne();
            let totalQtyQuery = this.createQueryBuilder('productAssign')
                .select('SUM(productAssign.number_of_products)', 'totalQty')
                .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = productAssign.branch_id')
                .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode });
            if (req.branch) {
                totalQtyQuery.andWhere('br.name = :branchName', { branchName: req.branch });
            }
            const totalQty = await totalQtyQuery.getRawOne();
            const results = {
                groupedBranches: groupedBranches.map(branch => ({
                    branchName: branch.branchName || 'N/A',
                })),
                totalAssignedQty: Number(totalAssignedQty?.totalAssignedQty || 0),
                totalInHandsQty: Number(totalInHandsQty?.totalInHandsQty || 0),
                totalQty: Number(totalQty?.totalQty || 0),
            };
            return results;
        }
        catch (error) {
            console.error('Error fetching product assignment summary:', error);
            throw new Error('Failed to fetch product assignment data');
        }
    }
    async getProductDetailsByBranch(req) {
        try {
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
                .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = productAssign.branch_id')
                .leftJoin(product_entity_1.ProductEntity, 'pa', 'pa.id = productAssign.product_id')
                .leftJoin(product_type_entity_1.ProductTypeEntity, 'pt', 'pt.id = productAssign.product_type_id')
                .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode });
            if (req.branch) {
                groupedProductQuery.andWhere('br.name = :branchName', { branchName: req.branch });
            }
            groupedProductQuery.groupBy('pa.id, pa.product_name, br.name, pt.name, productAssign.status');
            const productDetails = await groupedProductQuery.getRawMany();
            const photoQuery = this.createQueryBuilder('productAssign')
                .select([
                'pt.id AS productTypeId',
                'pt.product_photo AS productAssignPhoto'
            ])
                .leftJoin(product_type_entity_1.ProductTypeEntity, 'pt', 'pt.id = productAssign.product_type_id')
                .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode });
            if (req.branch) {
                photoQuery.andWhere('productAssign.branch_id IN (SELECT id FROM branch WHERE name = :branchName)', { branchName: req.branch });
            }
            const productPhotos = await photoQuery.getRawMany();
            const productPhotoMap = new Map();
            productPhotos.forEach(photo => {
                productPhotoMap.set(photo.productTypeId, photo.productAssignPhoto);
            });
            const branchesMap = new Map();
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
                    photo: productPhotoMap.get(productTypeId) || null
                });
            });
            return Array.from(branchesMap.values());
        }
        catch (error) {
            console.error('Error fetching product details by branch:', error);
            throw new Error('Failed to fetch product details by branch');
        }
    }
    async getProductWareHouseDetails(req) {
        try {
            const groupedProductQuery = this.createQueryBuilder('productAssign')
                .select([
                'pa.id AS productId',
                'pa.product_name AS productName',
                'pt.name AS productType',
                'productAssign.status AS status',
                'SUM(productAssign.number_of_products) AS totalProducts',
                'SUM(CASE WHEN productAssign.in_hands = true THEN productAssign.number_of_products ELSE 0 END) AS totalInHandsQty'
            ])
                .leftJoin(product_entity_1.ProductEntity, 'pa', 'pa.id = productAssign.product_id')
                .leftJoin(product_type_entity_1.ProductTypeEntity, 'pt', 'pt.id = productAssign.product_type_id')
                .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode });
            groupedProductQuery.groupBy('pa.id, pa.product_name, productAssign.status');
            const productDetails = await groupedProductQuery.getRawMany();
            const productsMap = new Map();
            productDetails.forEach((product) => {
                const { productId, productName, productType, status, totalProducts, totalInHandsQty } = product;
                if (!productsMap.has(productName)) {
                    productsMap.set(productName, {
                        productName: productName || 'N/A',
                        productType: productType || 'N/A',
                        status: status || 'N/A',
                        totalProducts: 0,
                        totalInHandsQty: 0
                    });
                }
                const existingProduct = productsMap.get(productName);
                if (existingProduct) {
                    existingProduct.totalProducts += Number(totalProducts) || 0;
                    existingProduct.totalInHandsQty += Number(totalInHandsQty) || 0;
                }
            });
            const results = Array.from(productsMap.values());
            return {
                status: true,
                errorCode: 200,
                internalMessage: "Data retrieved successfully",
                data: results
            };
        }
        catch (error) {
            console.error('Error fetching product details:', error);
            throw new Error('Failed to fetch product details');
        }
    }
    async getBranchManagerDetailProduct(req) {
        console.log('Request Object:', req);
        const query = this.createQueryBuilder('pa')
            .select([
            'pt.name AS productName',
            'SUM((pa.number_of_products, 0) ) AS presentStock',
            'br.name as branchName'
        ])
            .leftJoin(product_type_entity_1.ProductTypeEntity, 'pt', 'pt.id = pr.product_type_id')
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = productAssign.branch_id')
            .where('pr.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('pr.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy('pt.name');
        const result = await query.getRawMany();
        return result;
    }
    async getWareHouseProductDetailsByBranch(req) {
        try {
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
                .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = productAssign.branch_id')
                .leftJoin(product_entity_1.ProductEntity, 'pa', 'pa.id = productAssign.product_id')
                .leftJoin(product_type_entity_1.ProductTypeEntity, 'pt', 'pt.id = pa.product_type_id')
                .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode });
            if (req.branch) {
                groupedProductQuery.andWhere('br.name = :branchName', { branchName: req.branch });
            }
            if (req.fromDate) {
                groupedProductQuery.andWhere('DATE(productAssign.assign_time) >= :fromDate', { fromDate: req.fromDate });
            }
            if (req.toDate) {
                groupedProductQuery.andWhere('DATE(productAssign.assign_time) <= :toDate', { toDate: req.toDate });
            }
            groupedProductQuery.groupBy('pa.id, pa.product_name, pt.name, br.name');
            const productDetails = await groupedProductQuery.getRawMany();
            const branchesMap = new Map();
            productDetails.forEach((product) => {
                const { productId, productName, productType, branchName, inAssignStock, inHandStock, presentStock } = product;
                const branchKey = branchName || 'WareHouse';
                if (!branchesMap.has(branchKey)) {
                    branchesMap.set(branchKey, {
                        branchName: branchKey,
                        products: []
                    });
                }
                branchesMap.get(branchKey)?.products.push({
                    id: Number(productId) || 0,
                    name: productName || 'N/A',
                    type: productType || 'N/A',
                    inAssignStock: Number(inAssignStock) || 0,
                    inHandStock: Number(inHandStock) || 0,
                    presentStock: Number(presentStock) || 0
                });
            });
            return Array.from(branchesMap.values());
        }
        catch (error) {
            console.error('Error fetching product details by branch:', error);
            throw new Error('Failed to fetch product details by branch');
        }
    }
    async getStockSummary(req) {
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
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = productAssign.branch_id')
            .leftJoin(product_entity_1.ProductEntity, 'pr', 'pr.id = productAssign.product_id')
            .leftJoin(product_type_entity_1.ProductTypeEntity, 'pt', 'pt.id = productAssign.product_type_id')
            .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode });
        if (req.branchName) {
            query.andWhere('br.name = :branchName', { branchName: req.branchName });
        }
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
        query.groupBy(' pr.product_name, pr.product_description, pr.imei_number, pr.location, pt.name, pr.status,br.name');
        const result = await query.getRawMany();
        console.log(result);
        return result;
    }
    async getProductDetailsBy(req) {
        try {
            const groupedProductQuery = this.createQueryBuilder('productAssign')
                .select([
                'pt.name AS productType',
                'br.name AS branchName',
                'SUM(CASE WHEN pa.status = \'isAssign\' THEN productAssign.number_of_products ELSE 0 END) AS inAssignStock',
                'SUM(CASE WHEN pa.status = \'inHand\' THEN productAssign.number_of_products ELSE 0 END) AS inHandStock',
                'SUM(CASE WHEN pa.status = \'not_assigned\' THEN pa.quantity ELSE 0 END) AS presentStock',
                'ANY_VALUE(pa.product_status) as productStatus'
            ])
                .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = productAssign.branch_id')
                .leftJoin(product_entity_1.ProductEntity, 'pa', 'pa.id = productAssign.product_id')
                .leftJoin(product_type_entity_1.ProductTypeEntity, 'pt', 'pt.id = pa.product_type_id')
                .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode });
            if (req.branch) {
                groupedProductQuery.andWhere('br.name = :branchName', { branchName: req.branch });
            }
            if (req.fromDate) {
                groupedProductQuery.andWhere('DATE(productAssign.assign_time) >= :fromDate', { fromDate: req.fromDate });
            }
            if (req.toDate) {
                groupedProductQuery.andWhere('DATE(productAssign.assign_time) <= :toDate', { toDate: req.toDate });
            }
            groupedProductQuery.groupBy('pt.name, br.name');
            const productDetails = await groupedProductQuery.getRawMany();
            const branchesMap = new Map();
            productDetails.forEach((product) => {
                const { productType, branchName, inAssignStock, inHandStock, presentStock, productStatus } = product;
                const branchKey = branchName || 'WareHouse';
                if (!branchesMap.has(branchKey)) {
                    branchesMap.set(branchKey, {
                        branchName: branchKey,
                        products: []
                    });
                }
                branchesMap.get(branchKey)?.products.push({
                    type: productType || 'N/A',
                    inAssignStock: Number(inAssignStock) || 0,
                    inHandStock: Number(inHandStock) || 0,
                    presentStock: Number(presentStock) || 0,
                    productStatus: Number(productStatus) || 0
                });
            });
            return Array.from(branchesMap.values());
        }
        catch (error) {
            console.error('Error fetching product details by branch:', error);
            throw new Error('Failed to fetch product details by branch');
        }
    }
    async productSubDealerAssignDetails(req) {
        const groupedBranchesQuery = this.createQueryBuilder('pa')
            .select([
            'sb.name AS subDealerName',
            'sb.sub_dealer_id AS subDealerId',
        ])
            .leftJoin(sub_dealer_entity_1.SubDealerEntity, 'sb', 'sb.id = pa.sub_dealer_id')
            .where('pa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('pa.unit_code = :unitCode', { unitCode: req.unitCode });
        if (req.subDealerId) {
            groupedBranchesQuery.andWhere('sb.sub_dealer_id = :subDealerId', { subDealerId: req.subDealerId });
        }
        const result = await groupedBranchesQuery.groupBy('sb.sub_dealer_id').getRawMany();
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
            .leftJoin(product_entity_1.ProductEntity, 'pr', 'pr.id = pa.product_id')
            .leftJoin(request_raise_entity_1.RequestRaiseEntity, 're', 're.id = pa.request_id')
            .leftJoin(sub_dealer_entity_1.SubDealerEntity, 'sb', 'sb.id = pa.sub_dealer_id')
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
    async getProductDetailsBySubDealer(req) {
        try {
            const groupedProductQuery = this.createQueryBuilder('productAssign')
                .select([
                'pt.name AS productType',
                'sb.name AS subDealerName',
                'sb.sub_dealer_id as subDealerId',
                'SUM(CASE WHEN pa.status = \'isAssign\' THEN productAssign.number_of_products ELSE 0 END) AS inAssignStock',
                'SUM(CASE WHEN pa.status = \'inHand\' THEN productAssign.number_of_products ELSE 0 END) AS inHandStock',
                'ANY_VALUE(pa.product_status) as productStatus'
            ])
                .leftJoin(product_entity_1.ProductEntity, 'pa', 'pa.id = productAssign.product_id')
                .leftJoin(product_type_entity_1.ProductTypeEntity, 'pt', 'pt.id = pa.product_type_id')
                .leftJoin(sub_dealer_entity_1.SubDealerEntity, 'sb', 'sb.id = productAssign.sub_dealer_id')
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
            groupedProductQuery.groupBy('pt.name, sb.name, sb.sub_dealer_id');
            const productDetails = await groupedProductQuery.getRawMany();
            const branchesMap = new Map();
            productDetails.forEach((product) => {
                const { productType, subDealerId, inAssignStock, inHandStock, productStatus } = product;
                const branchKey = subDealerId || 'WareHouse';
                if (!branchesMap.has(branchKey)) {
                    branchesMap.set(branchKey, {
                        subDealerId: branchKey,
                        products: []
                    });
                }
                branchesMap.get(branchKey)?.products.push({
                    type: productType || 'N/A',
                    inAssignStock: Number(inAssignStock) || 0,
                    inHandStock: Number(inHandStock) || 0,
                    productStatus: Number(productStatus) || 0
                });
            });
            return Array.from(branchesMap.values());
        }
        catch (error) {
            console.error('Error fetching product details by branch:', error);
            throw new Error('Failed to fetch product details by branch');
        }
    }
    async getProductAssignmentSummaryBySubDealer(req) {
        try {
            const groupedBranchesQuery = this.createQueryBuilder('productAssign')
                .select(['sb.name AS subDealerName', 'sb.sub_dealer_id as subDealerId'])
                .leftJoin(sub_dealer_entity_1.SubDealerEntity, 'sb', 'sb.id = productAssign.sub_dealer_id')
                .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode });
            if (req.subDealerId) {
                groupedBranchesQuery.andWhere('sb.sub_dealer_id = :subDealerId', { subDealerId: req.subDealerId });
            }
            const groupedBranches = await groupedBranchesQuery.groupBy('sb.name, sb.sub_dealer_id').getRawMany();
            const totalAssignedQtyQuery = this.createQueryBuilder('productAssign')
                .select('SUM(productAssign.number_of_products)', 'totalAssignedQty')
                .leftJoin(sub_dealer_entity_1.SubDealerEntity, 'sb', 'sb.id = productAssign.sub_dealer_id')
                .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode })
                .andWhere('productAssign.is_assign = :isAssign', { isAssign: true });
            if (req.subDealerId) {
                totalAssignedQtyQuery.andWhere('sb.sub_dealer_id = :subDealerId', { subDealerId: req.subDealerId });
            }
            const totalAssignedQty = await totalAssignedQtyQuery.getRawOne();
            const totalInHandsQtyQuery = this.createQueryBuilder('productAssign')
                .select('SUM(productAssign.number_of_products)', 'totalInHandsQty')
                .leftJoin(sub_dealer_entity_1.SubDealerEntity, 'sb', 'sb.id = productAssign.sub_dealer_id')
                .where('productAssign.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('productAssign.unit_code = :unitCode', { unitCode: req.unitCode })
                .andWhere('productAssign.in_hands = :inHands', { inHands: true });
            if (req.subDealerId) {
                totalInHandsQtyQuery.andWhere('sb.sub_dealer_id = :subDealerId', { subDealerId: req.subDealerId });
            }
            const totalInHandsQty = await totalInHandsQtyQuery.getRawOne();
            const results = {
                groupedSubDealers: groupedBranches?.map((branch) => ({
                    subDealerId: branch?.subDealerId || 'N/A',
                })) || [],
                totalAssignedQty: Number(totalAssignedQty?.totalAssignedQty ?? 0),
                totalInHandsQty: Number(totalInHandsQty?.totalInHandsQty ?? 0),
                totalQty: Number(totalAssignedQty?.totalAssignedQty ?? 0) -
                    Number(totalInHandsQty?.totalInHandsQty ?? 0),
            };
            return results;
        }
        catch (error) {
            console.error('Error fetching product assignment summary:', error);
            throw new Error('Failed to fetch product assignment data');
        }
    }
};
exports.ProductAssignRepository = ProductAssignRepository;
exports.ProductAssignRepository = ProductAssignRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], ProductAssignRepository);
//# sourceMappingURL=product-assign.repo.js.map