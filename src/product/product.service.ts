import { Injectable } from '@nestjs/common';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import * as ExcelJS from 'exceljs';
import { ProductRepository } from './repo/product.repo';
import { ProductEntity } from './entity/product.entity';
import { VendorEntity } from 'src/vendor/entity/vendor.entity';
import { VendorRepository } from 'src/vendor/repo/vendor.repo';
import { VoucherRepository } from 'src/voucher/repo/voucher.repo';
import { promises as fs } from 'fs';
import { join } from 'path';
import { ProductDto } from './dto/product.dto';
import { ProductIdDto } from './dto/product.id.dto';
import { DataSource } from "typeorm";
import { CommonReq } from 'src/models/common-req';
@Injectable()
export class ProductService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly vendorRepository: VendorRepository,
        private readonly voucherRepository: VoucherRepository,
        private dataSource: DataSource
    ) { }


    async handleProductData(
        productDto: ProductDto,
        photo?: Express.Multer.File
    ): Promise<ProductEntity> {
        let productEntity: ProductEntity;
        let filePath: string | null = null;

        // Save photo file if present
        if (photo) {
            filePath = join(
                __dirname,
                '../../uploads/product_photos',
                `${Date.now()}-${photo.originalname}`
            );
            await fs.writeFile(filePath, photo.buffer); // Corrected from photo.fieldname to photo.buffer
        }

        // Find existing product if ID is provided, or create a new one
        if (productDto.id) {
            productEntity = await this.productRepository.findOne({
                where: { id: productDto.id },
            });
            if (!productEntity) {
                throw new ErrorResponse(400, `Product with ID ${productDto.id} not found`);
            }
        } else {
            productEntity = new ProductEntity();
        }

        // Update fields from DTO or keep existing values
        Object.assign(productEntity, {
            productName: productDto.productName ?? productEntity.productName,
            // emiNumber: productDto.emiNumber ?? productEntity.emiNumber,
            dateOfPurchase: productDto.dateOfPurchase
                ? new Date(productDto.dateOfPurchase)
                : productEntity.dateOfPurchase,
            categoryName: productDto.categoryName ?? productEntity.categoryName,
            price: productDto.price ?? productEntity.price,
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
            productPhoto: filePath || productEntity.productPhoto,
            deviceModel: productDto.deviceModel || productEntity.deviceModel,
            imeiNumber: productDto.imeiNumber || productEntity.imeiNumber,
            quantity: productDto.quantity || productEntity.quantity
        });
        if (productDto.vendorEmailId) {
            let vendor = await this.vendorRepository.findOne({
                where: { emailId: productDto.vendorEmailId },
            });
            if (!vendor) {
                vendor = new VendorEntity();
                Object.assign(vendor, {
                    name: productDto.vendorName,
                    vendorPhoneNumber: productDto.vendorPhoneNumber,
                    address: productDto.vendorAddress,
                    emailId: productDto.vendorEmailId,
                    companyCode: productDto.companyCode,
                    unitCode: productDto.unitCode
                });
                if (!vendor.vendorId) {
                    const allocationCount = await this.vendorRepository.count({});
                    vendor.vendorId = this.generateVendorId(allocationCount + 1);
                }
                await this.vendorRepository.save(vendor);
            }
            productEntity.vendorId = vendor;
        }
        // Handle voucher data
        if (productDto.voucherId) {
            const voucher = await this.voucherRepository.findOne({
                where: { id: productDto.voucherId },
            });
            if (!voucher) {
                throw new ErrorResponse(400, `Voucher with ID ${productDto.voucherId} not found`);
            }
            productEntity.voucherId = [voucher];
        }

        return productEntity;
    }
    private generateVendorId(sequenceNumber: number): string {
        const paddedNumber = sequenceNumber.toString().padStart(3, '0');
        return `v-${paddedNumber}`;
    }
    async createOrUpdateProduct(productDto: ProductDto, photo?: Express.Multer.File): Promise<CommonResponse> {
        try {
            const productEntity = await this.handleProductData(productDto, photo);
            console.log(productEntity, productDto, "{{{{{{{{{{{{{{{{{{{{")
            await this.productRepository.save(productEntity);
            return new CommonResponse(true, 201, 'Product details created successfully');
        } catch (error) {
            console.error('Error creating or updating product', error);
            throw new ErrorResponse(500, 'Error creating or updating product');
        }
    }

    async bulkUploadProducts(file: Express.Multer.File): Promise<CommonResponse> {

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(file.buffer);
            const worksheet = workbook.worksheets[0];

            const data = [];
            worksheet.eachRow((row, rowIndex) => {
                if (rowIndex > 1) {
                    const voucherId = row.getCell(15).value;

                    data.push({
                        productName: row.getCell(1).value,
                        emiNumber: row.getCell(2).value,
                        dateOfPurchase: row.getCell(3).value,
                        vendorName: row.getCell(4).value,
                        vendorEmailId: row.getCell(5).value,
                        vendorAddress: row.getCell(6).value,
                        imeiNumber: row.getCell(7).value,
                        supplierName: row.getCell(8).value,
                        serialNumber: row.getCell(9).value,
                        primaryNo: row.getCell(10).value,
                        secondaryNo: row.getCell(11).value,
                        primaryNetwork: row.getCell(12).value,
                        secondaryNetwork: row.getCell(13).value,
                        categoryName: row.getCell(14).value,
                        voucherId: voucherId,
                        price: parseFloat(row.getCell(16).value as string),
                        productDescription: row.getCell(17).value,
                        companyCode: row.getCell(18).value,
                        vendorPhoneNumber: row.getCell(19)?.value,
                        deviceModel: row.getCell(20)?.value, // Ensure you are fetching the phone number from the row
                    });
                }
            });

            const productEntities = await Promise.all(
                data.map(async (productDto) => {
                    return this.handleProductData(productDto);
                })
            );
            await queryRunner.manager.save(productEntities);
            await queryRunner.commitTransaction();
            return new CommonResponse(true, 201, 'Products uploaded successfully');
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new ErrorResponse(500, 'Bulk upload failed');
        }
        finally {
            await queryRunner.release();
        }
    }

    async deleteProductDetails(dto: ProductIdDto): Promise<CommonResponse> {
        try {
            const product = await this.productRepository.findOne({ where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode } });
            if (!product) {
                return new CommonResponse(false, 404, 'product not found');
            }
            await this.productRepository.delete(dto.id);
            return new CommonResponse(true, 200, 'product details deleted successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getproductDetails(req: ProductIdDto): Promise<CommonResponse> {
        try {
            const product = await this.productRepository.findOne({ relations: ['vendorId', 'voucherId'], where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode } });
            if (!product) {
                return new CommonResponse(false, 404, 'product not found');
            }
            else {
                return new CommonResponse(true, 200, 'product details fetched successfully', product);
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getAllproductDetails(req: CommonReq): Promise<CommonResponse> {
        try {
            const product = await this.productRepository.find({ relations: ['vendorId', 'voucherId'], where: { companyCode: req.companyCode, unitCode: req.unitCode } });
            if (!product) {
                return new CommonResponse(false, 404, 'product not found');
            }
            else {
                return new CommonResponse(true, 200, 'product details fetched successfully', product);
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }


    async getSearchDetailProduct(req: ProductIdDto): Promise<CommonResponse> {
        try {
            const product = await this.productRepository.getSearchDetailProduct(req)
            if (!product) {
                return new CommonResponse(false, 404, 'product not found');
            }
            else {
                return new CommonResponse(true, 200, 'product details fetched successfully', product);
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }



    async getProductNamesDropDown(): Promise<CommonResponse> {
        const data = await this.productRepository.find({ select: ['productName', 'id', 'imeiNumber'] });
        if (data.length) {
            return new CommonResponse(true, 75483, "Data Retrieved Successfully", data)
        } else {
            return new CommonResponse(false, 4579, "There Is No branch names")
        }
    }

}
