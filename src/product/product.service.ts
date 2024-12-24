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

@Injectable()
export class ProductService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly vendorRepository: VendorRepository,
        private readonly voucherRepository: VoucherRepository
    ) { }

    async bulkUploadProducts(file: Express.Multer.File): Promise<CommonResponse> {
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
                        price: parseFloat(row.getCell(10).value as string),
                        productDescription: row.getCell(11).value,
                        voucherId: voucherId,
                        companyCode: row.getCell(13).value,
                        unitCode: row.getCell(14).value
                    });
                }
            });

            const productEntities = await Promise.all(
                data.map(async (product) => {
                    const productEntity = new ProductEntity();
                    productEntity.productName = product.productName;
                    productEntity.emiNumber = product.emiNumber;
                    productEntity.dateOfPurchase = new Date(product.dateOfPurchase);
                    productEntity.imeiNumber = product.imeiNumber;
                    productEntity.categoryName = product.categoryName;
                    productEntity.price = product.price;
                    productEntity.productDescription = product.productDescription;
                    productEntity.companyCode = product.companyCode;
                    productEntity.unitCode = product.unitCode
                    let vendor = await this.vendorRepository.findOne({
                        where: { emailId: product.vendorEmailId },
                    });

                    if (!vendor) {
                        vendor = new VendorEntity();
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
                        } else {
                            throw new ErrorResponse(400, `Voucher with ID ${product.voucherId} not found`);
                        }
                    }

                    return productEntity;
                }),
            );
            await this.productRepository.save(productEntities);

            return new CommonResponse(true, 201, 'Products uploaded successfully');
        } catch (error) {
            console.error('Error in bulk upload', error);
            throw new ErrorResponse(500, 'Error uploading products');
        }
    }

    async uploadProductPhoto(productId: number, photo: Express.Multer.File): Promise<CommonResponse> {
        try {
            const product = await this.productRepository.findOne({ where: { id: productId } });

            if (!product) {
                return new CommonResponse(false, 404, 'product not found');
            }

            const filePath = join(__dirname, '../../uploads/product_photos', `${productId}-${Date.now()}.jpg`);
            await fs.writeFile(filePath, photo.buffer);

            product.productPhoto = filePath;
            await this.productRepository.save(product);

            return new CommonResponse(true, 200, 'Photo uploaded successfully', { photoPath: filePath });
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }
}
