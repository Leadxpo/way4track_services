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
const fs_1 = require("fs");
const path_1 = require("path");
let ProductService = class ProductService {
    constructor(productRepository, vendorRepository, voucherRepository) {
        this.productRepository = productRepository;
        this.vendorRepository = vendorRepository;
        this.voucherRepository = voucherRepository;
    }
    async bulkUploadProducts(file) {
        try {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(file.buffer);
            const worksheet = workbook.worksheets[0];
            const data = [];
            worksheet.eachRow((row, rowIndex) => {
                if (rowIndex > 1) {
                    const voucherId = row.getCell(12).value;
                    data.push({
                        productName: row.getCell(1).value,
                        emiNumber: row.getCell(2).value,
                        dateOfPurchase: row.getCell(3).value,
                        vendorName: row.getCell(4).value,
                        vendorNumber: row.getCell(5).value,
                        vendorAddress: row.getCell(6).value,
                        vendorEmailId: row.getCell(7).value,
                        imeiNumber: row.getCell(8).value,
                        categoryName: row.getCell(9).value,
                        price: parseFloat(row.getCell(10).value),
                        productDescription: row.getCell(11).value,
                        voucherId: voucherId,
                        companyCode: row.getCell(13).value,
                        unitCode: row.getCell(14).value
                    });
                }
            });
            const productEntities = await Promise.all(data.map(async (product) => {
                const productEntity = new product_entity_1.ProductEntity();
                productEntity.productName = product.productName;
                productEntity.emiNumber = product.emiNumber;
                productEntity.dateOfPurchase = new Date(product.dateOfPurchase);
                productEntity.imeiNumber = product.imeiNumber;
                productEntity.categoryName = product.categoryName;
                productEntity.price = product.price;
                productEntity.productDescription = product.productDescription;
                productEntity.companyCode = product.companyCode;
                productEntity.unitCode = product.unitCode;
                let vendor = await this.vendorRepository.findOne({
                    where: { emailId: product.vendorEmailId },
                });
                if (!vendor) {
                    vendor = new vendor_entity_1.VendorEntity();
                    vendor.name = product.vendorName;
                    vendor.vendorPhoneNumber = product.vendorNumber;
                    vendor.address = product.vendorAddress;
                    vendor.emailId = product.vendorEmailId;
                    await this.vendorRepository.save(vendor);
                }
                productEntity.vendorId = vendor;
                if (product.voucherId) {
                    const voucher = await this.voucherRepository.findOne({
                        where: { id: product.voucherId },
                    });
                    if (voucher) {
                        productEntity.voucherId = voucher;
                    }
                    else {
                        throw new error_response_1.ErrorResponse(400, `Voucher with ID ${product.voucherId} not found`);
                    }
                }
                return productEntity;
            }));
            await this.productRepository.save(productEntities);
            return new common_response_1.CommonResponse(true, 201, 'Products uploaded successfully');
        }
        catch (error) {
            console.error('Error in bulk upload', error);
            throw new error_response_1.ErrorResponse(500, 'Error uploading products');
        }
    }
    async uploadProductPhoto(productId, photo) {
        try {
            const product = await this.productRepository.findOne({ where: { id: productId } });
            if (!product) {
                return new common_response_1.CommonResponse(false, 404, 'product not found');
            }
            const filePath = (0, path_1.join)(__dirname, '../../uploads/product_photos', `${productId}-${Date.now()}.jpg`);
            await fs_1.promises.writeFile(filePath, photo.buffer);
            product.productPhoto = filePath;
            await this.productRepository.save(product);
            return new common_response_1.CommonResponse(true, 200, 'Photo uploaded successfully', { photoPath: filePath });
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
        voucher_repo_1.VoucherRepository])
], ProductService);
//# sourceMappingURL=product.service.js.map