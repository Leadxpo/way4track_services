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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const common_response_1 = require("../models/common-response");
const error_response_1 = require("../models/error-response");
const ExcelJS = require("exceljs");
const product_repo_1 = require("./repo/product.repo");
const product_entity_1 = require("./entity/product.entity");
const vendor_entity_1 = require("../vendor/entity/vendor.entity");
const vendor_repo_1 = require("../vendor/repo/vendor.repo");
const voucher_repo_1 = require("../voucher/repo/voucher.repo");
const typeorm_1 = require("typeorm");
const storage_1 = require("@google-cloud/storage");
const product_type_repo_1 = require("../product-type/repo/product-type.repo");
const branch_repo_1 = require("../branch/repo/branch.repo");
const staff_repo_1 = require("../staff/repo/staff-repo");
const sub_dealer_repo_1 = require("../sub-dealer/repo/sub-dealer.repo");
let ProductService = class ProductService {
    constructor(productRepository, vendorRepository, voucherRepository, dataSource, productTypeRepo, branchRepo, staffRepo, subDalerRepo) {
        this.productRepository = productRepository;
        this.vendorRepository = vendorRepository;
        this.voucherRepository = voucherRepository;
        this.dataSource = dataSource;
        this.productTypeRepo = productTypeRepo;
        this.branchRepo = branchRepo;
        this.staffRepo = staffRepo;
        this.subDalerRepo = subDalerRepo;
        this.storage = new storage_1.Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });
        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }
    async bulkUploadProducts(file, subDealerId, staffId, branchId, assignTime) {
        console.log(file, "+++++++");
        const getCellValue = (cell) => {
            if (cell.value === null || cell.value === undefined)
                return null;
            if (typeof cell.value === 'object')
                return cell.value.text || cell.value.toString();
            return cell.value.toString();
        };
        const parseDate = (dateString) => {
            const parsedDate = new Date(dateString);
            return isNaN(parsedDate.getTime()) ? null : parsedDate;
        };
        try {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(file.buffer);
            const worksheet = workbook.worksheets[0];
            const headerMapping = {
                "product name": "productName",
                "date of purchase": "inDate",
                "vendor name": "vendorName",
                "vendor email id": "vendorEmailId",
                "vendor address": "vendorAddress",
                "imei number": "imeiNumber",
                "supplier name": "supplierName",
                "serial number": "serialNumber",
                "primary no": "primaryNo",
                "secondary no": "secondaryNo",
                "primary network": "primaryNetwork",
                "secondary network": "secondaryNetwork",
                "category name": "categoryName",
                "cost": "cost",
                "product description": "productDescription",
                "company code": "companyCode",
                "vendor phone number": "vendorPhoneNumber",
                "device model": "deviceModel",
                "unit code": "unitCode",
                "sim status": "simStatus",
                "plan name": "planName",
                "remarks 1": "remarks1",
                "remarks 2": "remarks2",
                "quantity": "quantity",
                "iccid no": "ICCIDNo",
                "hsn code": "hsnCode",
                "remarks 3": "remarks3",
                "basket name": "BASKET_NAME",
                "sim imsi": "SIM_IMSI",
                "sim number": "SIM_Number",
                "mobile number": "MOBILE_NUMBER",
            };
            const headers = {};
            worksheet.getRow(1).eachCell((cell, colNumber) => {
                const headerName = getCellValue(cell)?.toLowerCase();
                if (headerName && headerMapping[headerName]) {
                    headers[headerMapping[headerName]] = colNumber;
                }
            });
            const results = [];
            for (let rowIndex = 2; rowIndex <= worksheet.rowCount; rowIndex++) {
                const row = worksheet.getRow(rowIndex);
                const getCellValueByHeader = (header) => {
                    const colNumber = headers[header];
                    return colNumber ? getCellValue(row.getCell(colNumber)) : null;
                };
                const imeiNumber = getCellValueByHeader('imeiNumber');
                const simNumber = getCellValueByHeader('SIM_Number');
                if (!imeiNumber && !simNumber)
                    continue;
                const currentRow = {
                    productName: getCellValueByHeader('productName'),
                    inDate: parseDate(getCellValueByHeader('inDate')),
                    vendorName: getCellValueByHeader('vendorName'),
                    vendorEmailId: getCellValueByHeader('vendorEmailId'),
                    vendorAddress: getCellValueByHeader('vendorAddress'),
                    imeiNumber,
                    supplierName: getCellValueByHeader('supplierName'),
                    serialNumber: getCellValueByHeader('serialNumber'),
                    primaryNo: getCellValueByHeader('primaryNo'),
                    secondaryNo: getCellValueByHeader('secondaryNo'),
                    primaryNetwork: getCellValueByHeader('primaryNetwork'),
                    secondaryNetwork: getCellValueByHeader('secondaryNetwork'),
                    categoryName: getCellValueByHeader('categoryName'),
                    cost: parseFloat(getCellValueByHeader('cost') || '0'),
                    productDescription: getCellValueByHeader('productDescription'),
                    companyCode: getCellValueByHeader('companyCode'),
                    vendorPhoneNumber: getCellValueByHeader('vendorPhoneNumber'),
                    deviceModel: getCellValueByHeader('deviceModel'),
                    unitCode: getCellValueByHeader('unitCode'),
                    simStatus: getCellValueByHeader('simStatus'),
                    planName: getCellValueByHeader('planName'),
                    remarks1: getCellValueByHeader('remarks1'),
                    remarks2: getCellValueByHeader('remarks2'),
                    quantity: parseInt(getCellValueByHeader('quantity') || '1'),
                    ICCIDNo: getCellValueByHeader('ICCIDNo'),
                    hsnCode: getCellValueByHeader('hsnCode'),
                    remarks3: getCellValueByHeader('remarks3'),
                    simImsi: getCellValueByHeader('SIM_IMSI'),
                    basketName: getCellValueByHeader('BASKET_NAME'),
                    simNumber,
                    mobileNumber: getCellValueByHeader('MOBILE_NUMBER')
                };
                let existing = null;
                if (imeiNumber && simNumber) {
                    existing = await this.productRepository.findOne({
                        where: [
                            { imeiNumber },
                            { simNumber },
                        ],
                    });
                }
                else if (imeiNumber) {
                    existing = await this.productRepository.findOne({
                        where: {
                            imeiNumber,
                        },
                    });
                }
                else if (simNumber) {
                    existing = await this.productRepository.findOne({
                        where: {
                            simNumber,
                        },
                    });
                }
                if (existing) {
                    const updateData = {};
                    let hasChanged = false;
                    for (const key of Object.keys(currentRow)) {
                        const newValue = currentRow[key];
                        if (newValue !== null &&
                            newValue !== undefined &&
                            newValue !== '' &&
                            newValue !== existing[key]) {
                            updateData[key] = newValue;
                            hasChanged = true;
                        }
                    }
                    if (branchId && (!existing.branchId || existing.branchId.id !== branchId)) {
                        updateData.branchId = { id: branchId };
                        updateData.status = 'assigned';
                        updateData.assignTime = assignTime;
                        hasChanged = true;
                    }
                    if (subDealerId && (!existing.subDealerId || existing.subDealerId.id !== subDealerId)) {
                        updateData.subDealerId = { id: subDealerId };
                        updateData.status = 'assigned';
                        updateData.assignTime = assignTime;
                        hasChanged = true;
                    }
                    if (staffId && (!existing.staffId || existing.staffId.id !== staffId)) {
                        updateData.staffId = { id: staffId };
                        updateData.status = 'inHand';
                        hasChanged = true;
                    }
                    if (hasChanged) {
                        await this.productRepository.update(existing.id, updateData);
                        continue;
                    }
                }
                else {
                    results.push(currentRow);
                }
                console.log(results, ">>>>>>>>>");
            }
            return results;
        }
        catch (error) {
            console.error("Error processing Excel:", error);
            throw new error_response_1.ErrorResponse(500, 'Error parsing Excel file');
        }
    }
    async handleProductData(productDto) {
        let productEntity;
        if (productDto.id || productDto.id !== null) {
            productEntity = await this.productRepository.findOne({ where: { id: productDto.id } });
            if (!productEntity) {
                throw new error_response_1.ErrorResponse(400, `Product with ID ${productDto.id} not found`);
            }
        }
        else {
            productEntity = new product_entity_1.ProductEntity();
        }
        Object.assign(productEntity, {
            SNO: productDto.SNO ?? productEntity.SNO,
            productName: productDto.productName ?? productDto.productType,
            inDate: productDto.inDate ?? productEntity.inDate,
            categoryName: productDto.categoryName ?? productEntity.categoryName,
            cost: productDto.cost ?? productEntity.cost,
            productDescription: productDto.productDescription ?? productEntity.productDescription,
            companyCode: productDto.companyCode ?? productEntity.companyCode,
            unitCode: productDto.unitCode ?? productEntity.unitCode,
            primaryNo: productDto.primaryNo ?? productEntity.primaryNo,
            supplierName: productDto.supplierName ?? productEntity.supplierName,
            serialNumber: productDto.serialNumber ?? productEntity.serialNumber,
            secondaryNo: productDto.secondaryNo ?? productEntity.secondaryNo,
            primaryNetwork: productDto.primaryNetwork ?? productEntity.primaryNetwork,
            secondaryNetwork: productDto.secondaryNetwork ?? productEntity.secondaryNetwork,
            simStatus: productDto.simStatus ?? productEntity.simStatus,
            planName: productDto.planName ?? productEntity.planName,
            remarks1: productDto.remarks1 ?? productEntity.remarks1,
            remarks2: productDto.remarks2 ?? productEntity.remarks2,
            deviceModel: productDto.deviceModel ?? productEntity.deviceModel,
            imeiNumber: productDto.imeiNumber ?? productEntity.imeiNumber,
            quantity: productDto.quantity ?? productEntity.quantity,
            vendorName: productDto.vendorName ?? productEntity.vendorName,
            vendorPhoneNumber: productDto.vendorPhoneNumber ?? productEntity.vendorPhoneNumber,
            vendorAddress: productDto.vendorAddress ?? productEntity.vendorAddress,
            vendorEmailId: productDto.vendorEmailId ?? productEntity.vendorEmailId,
            ICCIDNo: productDto.ICCIDNo ?? productEntity.ICCIDNo,
            hsnCode: productDto.hsnCode ?? productEntity.hsnCode,
            remarks3: productDto.remarks3 ?? productEntity.remarks3,
            BASKET_NAME: productDto.BASKET_NAME ?? productEntity.basketName,
            SIM_IMSI: productDto.SIM_IMSI ?? productEntity.simImsi,
            SIMNUMBER: productDto.SIM_Number ?? productEntity.simNumber,
            MOBILE_NUMBER: productDto.MOBILE_NUMBER ?? productEntity.mobileNumber,
            productTypeId: productDto.productTypeId ?? productEntity.productTypeId
        });
        if (productDto.vendorEmailId) {
            let vendor = await this.vendorRepository.findOne({
                where: { emailId: productDto.vendorEmailId },
            });
            if (!vendor) {
                vendor = new vendor_entity_1.VendorEntity();
                Object.assign(vendor, {
                    name: productDto.vendorName,
                    vendorPhoneNumber: productDto.vendorPhoneNumber,
                    address: productDto.vendorAddress,
                    emailId: productDto.vendorEmailId,
                    companyCode: productDto.companyCode,
                    unitCode: productDto.unitCode,
                });
                vendor.vendorId = this.generateVendorId((await this.vendorRepository.count()) + 1);
                await this.vendorRepository.save(vendor);
            }
            productEntity.vendorId = vendor;
        }
        return productEntity;
    }
    generateVendorId(sequenceNumber) {
        const paddedNumber = sequenceNumber.toString().padStart(3, '0');
        return `v-${paddedNumber}`;
    }
    async createOrUpdateProduct(productDto, file) {
        if (!file) {
            return new common_response_1.CommonResponse(false, 400, 'File is required');
        }
        if (productDto.vendorEmailId) {
            let vendor = await this.vendorRepository.findOne({
                where: { emailId: productDto.vendorEmailId },
            });
            if (!vendor) {
                vendor = new vendor_entity_1.VendorEntity();
                Object.assign(vendor, {
                    name: productDto.vendorName,
                    vendorPhoneNumber: productDto.vendorPhoneNumber,
                    address: productDto.vendorAddress,
                    emailId: productDto.vendorEmailId,
                    companyCode: productDto.companyCode,
                    unitCode: productDto.unitCode,
                });
                vendor.vendorId = this.generateVendorId((await this.vendorRepository.count()) + 1);
                vendor = await this.vendorRepository.save(vendor);
            }
            productDto.vendorId = vendor.id;
        }
        let designationEntity = null;
        if (productDto.productTypeId) {
            designationEntity = await this.productTypeRepo.findOne({
                where: { id: productDto.productTypeId }
            });
            if (!designationEntity) {
                throw new Error(`productType with ID '${productDto.productTypeId}' not found.`);
            }
            console.log(designationEntity, 'designationEntity');
            productDto.productType = designationEntity.name;
            productDto.productTypeId = designationEntity;
        }
        if (productDto.branchId) {
            designationEntity = await this.branchRepo.findOne({
                where: { id: productDto.branchId }
            });
            if (!designationEntity) {
                throw new Error(`branch with ID '${productDto.branchId}' not found.`);
            }
            console.log(designationEntity, 'bramch');
        }
        if (productDto.staffId) {
            designationEntity = await this.staffRepo.findOne({
                where: { id: productDto.staffId }
            });
            if (!designationEntity) {
                throw new Error(`staff with ID '${productDto.staffId}' not found.`);
            }
            console.log(designationEntity, 'staff');
        }
        if (productDto.subDealerId) {
            designationEntity = await this.subDalerRepo.findOne({
                where: { id: productDto.subDealerId }
            });
            if (!designationEntity) {
                throw new Error(`subdealer with ID '${productDto.subDealerId}' not found.`);
            }
            console.log(designationEntity, 'subdealer');
        }
        const jsonData = await this.bulkUploadProducts(file, productDto?.subDealerId, productDto?.staffId, productDto?.branchId, productDto.assignTime);
        console.log(jsonData, "jsonData");
        const finalProductData = jsonData.map((excelRow) => ({
            ...excelRow,
            productTypeId: productDto.productTypeId,
            productType: productDto.productType,
        }));
        console.log(finalProductData, "/////");
        await this.productRepository.save(finalProductData);
        return new common_response_1.CommonResponse(true, 201, 'Products saved successfully');
    }
    async deleteProductDetails(dto) {
        try {
            const product = await this.productRepository.findOne({ where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode } });
            if (!product) {
                return new common_response_1.CommonResponse(false, 404, 'product not found');
            }
            await this.productRepository.delete(dto.id);
            return new common_response_1.CommonResponse(true, 200, 'product details deleted successfully');
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getproductDetails(req) {
        try {
            const product = await this.productRepository.findOne({ relations: ['vendorId', 'voucherId'], where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode } });
            if (!product) {
                return new common_response_1.CommonResponse(false, 404, 'product not found');
            }
            else {
                return new common_response_1.CommonResponse(true, 200, 'product details fetched successfully', product);
            }
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getAllproductDetails(req) {
        try {
            const product = await this.productRepository.find({ relations: ['vendorId', 'voucherId'], where: { companyCode: req.companyCode, unitCode: req.unitCode } });
            if (!product) {
                return new common_response_1.CommonResponse(false, 404, 'product not found');
            }
            else {
                return new common_response_1.CommonResponse(true, 200, 'product details fetched successfully', product);
            }
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getDetailProduct(req) {
        try {
            const product = await this.productRepository.getDetailProduct(req);
            if (!product) {
                return new common_response_1.CommonResponse(false, 404, 'product not found');
            }
            else {
                return new common_response_1.CommonResponse(true, 200, 'product details fetched successfully', product);
            }
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getSearchDetailProduct(req) {
        try {
            const product = await this.productRepository.getSearchDetailProduct(req);
            if (!product) {
                return new common_response_1.CommonResponse(false, 404, 'product not found');
            }
            else {
                return new common_response_1.CommonResponse(true, 200, 'product details fetched successfully', product);
            }
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getProductNamesDropDown() {
        const data = await this.productRepository.find({ select: ['productName', 'id', 'imeiNumber'] });
        if (data.length) {
            return new common_response_1.CommonResponse(true, 75483, "Data Retrieved Successfully", data);
        }
        else {
            return new common_response_1.CommonResponse(false, 4579, "There Is No branch names");
        }
    }
    async productAssignDetails(req) {
        try {
            const product = await this.productRepository.productAssignDetails(req);
            if (!product) {
                return new common_response_1.CommonResponse(false, 404, 'product not found');
            }
            else {
                return new common_response_1.CommonResponse(true, 200, 'product details fetched successfully', product);
            }
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [product_repo_1.ProductRepository,
        vendor_repo_1.VendorRepository,
        voucher_repo_1.VoucherRepository,
        typeorm_1.DataSource,
        product_type_repo_1.ProductTypeRepository,
        branch_repo_1.BranchRepository,
        staff_repo_1.StaffRepository,
        sub_dealer_repo_1.SubDealerRepository])
], ProductService);
//# sourceMappingURL=product.service.js.map