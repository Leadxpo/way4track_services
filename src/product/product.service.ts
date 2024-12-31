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

@Injectable()
export class ProductService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly vendorRepository: VendorRepository,
        private readonly voucherRepository: VoucherRepository
    ) { }


    async createOrUpdateProduct(productDto: ProductDto, photo?: Express.Multer.File): Promise<CommonResponse> {
        try {
            let productEntity: ProductEntity;
            let filePath: string | null = null;

            // Handle photo upload
            if (photo) {
                filePath = join(__dirname, '../../uploads/product_photos', `${Date.now()}-${photo.originalname}`);
                await fs.writeFile(filePath, photo.fieldname); // Save the photo
            }
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

            productEntity.productName = productDto.productName;
            productEntity.emiNumber = productDto.emiNumber;
            productEntity.dateOfPurchase = new Date(productDto.dateOfPurchase);
            productEntity.imeiNumber = productDto.imeiNumber;
            productEntity.categoryName = productDto.categoryName;
            productEntity.price = productDto.price;
            productEntity.productDescription = productDto.productDescription;
            productEntity.companyCode = productDto.companyCode;
            productEntity.unitCode = productDto.unitCode;
            if (productDto.vendorId) {

                let vendor = await this.vendorRepository.findOne({
                    where: { id: productDto.vendorId },
                });
                if (vendor) {
                    productEntity.vendorId = vendor;
                } else {
                    throw new ErrorResponse(400, `Voucher with ID ${productDto.vendorId} not found`);
                }
                if (!vendor) {
                    vendor = new VendorEntity();
                    vendor.name = productDto.vendorName;
                    vendor.vendorPhoneNumber = productDto.vendorPhoneNumber;
                    vendor.address = productDto.vendorAddress;
                    vendor.emailId = productDto.vendorEmailId;
                    await this.vendorRepository.save(vendor);
                }

                productEntity.vendorId = vendor;
            }
            if (productDto.voucherId) {
                const voucher = await this.voucherRepository.findOne({
                    where: { id: productDto.voucherId },
                });
                if (voucher) {
                    productEntity.voucherId = voucher;
                } else {
                    throw new ErrorResponse(400, `Voucher with ID ${productDto.voucherId} not found`);
                }
            }
            if (filePath) {
                productEntity.productPhoto = filePath;
            }
            await this.productRepository.save(productEntity);
            return new CommonResponse(true, 201, 'product details created successfully');

        } catch (error) {
            console.error('Error creating or updating product', error);
            throw new ErrorResponse(500, 'Error creating or updating product');
        }
    }

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
            const product = await this.productRepository.find({ relations: ['vendorId', 'voucherId'], where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode } });
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
