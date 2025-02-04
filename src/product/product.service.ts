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
import { Storage } from '@google-cloud/storage';

@Injectable()
export class ProductService {
    private storage: Storage;
    private bucketName: string;
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly vendorRepository: VendorRepository,
        private readonly voucherRepository: VoucherRepository,
        private dataSource: DataSource
    ) {
        this.storage = new Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });

        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }


    // async handleProductData(
    //     productDto: ProductDto,
    //     photo?: Express.Multer.File
    // ): Promise<ProductEntity> {
    //     let productEntity: ProductEntity;
    //     let filePath: string | null = null;

    //     // Save photo file if present
    //     if (photo) {
    //         filePath = join(
    //             __dirname,
    //             '../../uploads/product_photos',
    //             `${Date.now()}-${photo.originalname}`
    //         );
    //         await fs.writeFile(filePath, photo.buffer); // Corrected from photo.fieldname to photo.buffer
    //     }

    //     // Find existing product if ID is provided, or create a new one
    //     if (productDto.id) {
    //         productEntity = await this.productRepository.findOne({
    //             where: { id: productDto.id },
    //         });
    //         if (!productEntity) {
    //             throw new ErrorResponse(400, `Product with ID ${productDto.id} not found`);
    //         }
    //     } else {
    //         productEntity = new ProductEntity();
    //     }

    //     // Update fields from DTO or keep existing values
    //     Object.assign(productEntity, {
    //         SNO: productDto.SNO ?? productEntity.SNO,
    //         productName: productDto.productName ?? productEntity.productName,
    //         // emiNumber: productDto.emiNumber ?? productEntity.emiNumber,
    //         inDate: productDto.inDate
    //             ? new Date(productDto.inDate)
    //             : productEntity.dateOfPurchase,
    //         categoryName: productDto.categoryName ?? productEntity.categoryName,
    //         price: productDto.price ?? productEntity.price,
    //         productDescription: productDto.productDescription ?? productEntity.productDescription,
    //         companyCode: productDto.companyCode ?? productEntity.companyCode,
    //         unitCode: productDto.unitCode ?? productEntity.unitCode,
    //         primaryNo: productDto.primaryNo ?? productEntity.primaryNo,
    //         supplierName: productDto.supplierName ?? productEntity.supplierName,
    //         serialNumber: productDto.serialNumber ?? productEntity.serialNumber,
    //         secondaryNo: productDto.secondaryNo ?? productEntity.secondaryNo,
    //         primaryNetwork: productDto.primaryNetwork ?? productEntity.primaryNetwork,
    //         secondaryNetwork: productDto.secondaryNetwork ?? productEntity.secondaryNetwork,
    //         simStatus: productDto.simStatus ?? productEntity.simStatus,
    //         planName: productDto.planName ?? productEntity.planName,
    //         remarks1: productDto.remarks1 ?? productEntity.remarks1,
    //         remarks2: productDto.remarks2 ?? productEntity.remarks2,
    //         productPhoto: filePath || productEntity.productPhoto,
    //         deviceModel: productDto.deviceModel || productEntity.deviceModel,
    //         imeiNumber: productDto.imeiNumber || productEntity.imeiNumber,
    //         quantity: productDto.quantity || productEntity.quantity
    //     });
    //     if (productDto.vendorEmailId) {
    //         let vendor = await this.vendorRepository.findOne({
    //             where: { emailId: productDto.vendorEmailId },
    //         });
    //         if (!vendor) {
    //             vendor = new VendorEntity();
    //             Object.assign(vendor, {
    //                 name: productDto.vendorName,
    //                 vendorPhoneNumber: productDto.vendorPhoneNumber,
    //                 address: productDto.vendorAddress,
    //                 emailId: productDto.vendorEmailId,
    //                 companyCode: productDto.companyCode,
    //                 unitCode: productDto.unitCode
    //             });
    //             if (!vendor.vendorId) {
    //                 const allocationCount = await this.vendorRepository.count({});
    //                 vendor.vendorId = this.generateVendorId(allocationCount + 1);
    //             }
    //             await this.vendorRepository.save(vendor);
    //         }
    //         productEntity.vendorId = vendor;
    //     }
    //     // Handle voucher data
    //     if (productDto.voucherId) {
    //         const voucher = await this.voucherRepository.findOne({
    //             where: { id: productDto.voucherId },
    //         });
    //         if (!voucher) {
    //             throw new ErrorResponse(400, `Voucher with ID ${productDto.voucherId} not found`);
    //         }
    //         productEntity.voucherId = [voucher];
    //     }

    //     return productEntity;
    // }

    // async bulkUploadProducts(file: Express.Multer.File): Promise<CommonResponse> {


    //     const getCellValue = (cell: ExcelJS.Cell) => {
    //         if (cell.value === null || cell.value === undefined) {
    //             return null;
    //         }
    //         if (typeof cell.value === 'object') {
    //             return (cell.value as any).text || cell.value.toString();
    //         }
    //         return cell.value.toString();
    //     };

    //     // Function to validate and parse the date
    //     const parseDate = (dateString: string) => {
    //         const parsedDate = new Date(dateString);
    //         if (isNaN(parsedDate.getTime())) {
    //             return null; // Return null if the date is invalid
    //         }
    //         return parsedDate;
    //     };

    //     const queryRunner = this.dataSource.createQueryRunner();
    //     await queryRunner.connect();
    //     await queryRunner.startTransaction();

    //     try {
    //         const workbook = new ExcelJS.Workbook();
    //         await workbook.xlsx.load(file.buffer);
    //         const worksheet = workbook.worksheets[0];

    //         const data = [];
    //         worksheet.eachRow((row, rowIndex) => {
    //             if (rowIndex > 1) {
    //                 const voucherId = getCellValue(row.getCell(14));

    //                 data.push({
    //                     productName: getCellValue(row.getCell(1)),
    //                     dateOfPurchase: parseDate(getCellValue(row.getCell(2))),
    //                     vendorName: getCellValue(row.getCell(3)),
    //                     vendorEmailId: getCellValue(row.getCell(4)),
    //                     vendorAddress: getCellValue(row.getCell(5)),
    //                     imeiNumber: getCellValue(row.getCell(6)),
    //                     supplierName: getCellValue(row.getCell(7)),
    //                     serialNumber: getCellValue(row.getCell(8)),
    //                     primaryNo: getCellValue(row.getCell(9)),
    //                     secondaryNo: getCellValue(row.getCell(10)),
    //                     primaryNetwork: getCellValue(row.getCell(11)),
    //                     secondaryNetwork: getCellValue(row.getCell(12)),
    //                     categoryName: getCellValue(row.getCell(13)),
    //                     voucherId: voucherId,
    //                     price: parseFloat(getCellValue(row.getCell(15)) || '0'),
    //                     productDescription: getCellValue(row.getCell(16)),
    //                     companyCode: getCellValue(row.getCell(17)),
    //                     vendorPhoneNumber: getCellValue(row.getCell(18)),
    //                     deviceModel: getCellValue(row.getCell(19)),
    //                     unitCode: getCellValue(row.getCell(20)),
    //                     simStatus: getCellValue(row.getCell(21)),
    //                     planName: getCellValue(row.getCell(22)),
    //                     remarks1: getCellValue(row.getCell(23)),
    //                     remarks2: getCellValue(row.getCell(24)),
    //                     quantity: parseInt(getCellValue(row.getCell(25)) || '0', 10),
    //                     SNO: parseInt(getCellValue(row.getCell(26)) || '0'),

    //                 });
    //             }
    //         });
    //         console.log(data, "data")
    //         const productEntities = await Promise.all(
    //             data.map(async (productDto) => {
    //                 return this.handleProductData(productDto);
    //             })
    //         );
    //         console.log(productEntities, "productEntities")
    //         await queryRunner.manager.save(productEntities);
    //         await queryRunner.commitTransaction();
    //         return new CommonResponse(true, 201, 'Products uploaded successfully');
    //     } catch (error) {
    //         await queryRunner.rollbackTransaction();
    //         throw new ErrorResponse(500, 'Bulk upload failed');
    //     } finally {
    //         await queryRunner.release();
    //     }

    // }

    // async bulkUploadProducts(file: Express.Multer.File): Promise<CommonResponse> {
    //     const getCellValue = (cell: ExcelJS.Cell) => {
    //         if (cell.value === null || cell.value === undefined) {
    //             return null;
    //         }
    //         if (typeof cell.value === 'object') {
    //             return (cell.value as any).text || cell.value.toString();
    //         }
    //         return cell.value.toString();
    //     };

    //     const parseDate = (dateString: string) => {
    //         const parsedDate = new Date(dateString);
    //         return isNaN(parsedDate.getTime()) ? null : parsedDate;
    //     };

    //     const queryRunner = this.dataSource.createQueryRunner();
    //     await queryRunner.connect();
    //     await queryRunner.startTransaction();

    //     try {
    //         const workbook = new ExcelJS.Workbook();
    //         await workbook.xlsx.load(file.buffer);
    //         const worksheet = workbook.worksheets[0];

    //         // Map headers dynamically
    //         const headers: { [key: string]: number } = {};
    //         worksheet.getRow(1).eachCell((cell, colNumber) => {
    //             headers[getCellValue(cell).toLowerCase()] = colNumber;
    //         });

    //         const data = [];
    //         worksheet.eachRow((row, rowIndex) => {
    //             if (rowIndex > 1) {
    //                 data.push({
    //                     productName: getCellValue(row.getCell(headers['Product name'])),
    //                     dateOfPurchase: parseDate(getCellValue(row.getCell(headers['date of purchase']))),
    //                     vendorName: getCellValue(row.getCell(headers['vendor name'])),
    //                     vendorEmailId: getCellValue(row.getCell(headers['vendor email id'])),
    //                     vendorAddress: getCellValue(row.getCell(headers['vendor address'])),
    //                     imeiNumber: getCellValue(row.getCell(headers['imei number'])),
    //                     supplierName: getCellValue(row.getCell(headers['supplier name'])),
    //                     serialNumber: getCellValue(row.getCell(headers['serial number'])),
    //                     primaryNo: getCellValue(row.getCell(headers['primary no'])),
    //                     secondaryNo: getCellValue(row.getCell(headers['secondary no'])),
    //                     primaryNetwork: getCellValue(row.getCell(headers['primary network'])),
    //                     secondaryNetwork: getCellValue(row.getCell(headers['secondary network'])),
    //                     categoryName: getCellValue(row.getCell(headers['category name'])),
    //                     voucherId: getCellValue(row.getCell(headers['voucher id'])),
    //                     price: parseFloat(getCellValue(row.getCell(headers['price'])) || '0'),
    //                     productDescription: getCellValue(row.getCell(headers['product description'])),
    //                     companyCode: getCellValue(row.getCell(headers['company code'])),
    //                     vendorPhoneNumber: getCellValue(row.getCell(headers['vendor phone number'])),
    //                     deviceModel: getCellValue(row.getCell(headers['device model'])),
    //                     unitCode: getCellValue(row.getCell(headers['unit code'])),
    //                     simStatus: getCellValue(row.getCell(headers['sim status'])),
    //                     planName: getCellValue(row.getCell(headers['plan name'])),
    //                     remarks1: getCellValue(row.getCell(headers['remarks 1'])),
    //                     remarks2: getCellValue(row.getCell(headers['remarks 2'])),
    //                     quantity: parseInt(getCellValue(row.getCell(headers['quantity'])) || '0', 10),
    //                     SNO: parseInt(getCellValue(row.getCell(headers['sno'])) || '0'),
    //                 });
    //             }
    //         });

    //         const productEntities = await Promise.all(
    //             data.map(async (productDto) => this.handleProductData(productDto))
    //         );

    //         await queryRunner.manager.save(productEntities);
    //         await queryRunner.commitTransaction();

    //         return new CommonResponse(true, 201, 'Products uploaded successfully');
    //     } catch (error) {
    //         await queryRunner.rollbackTransaction();
    //         throw new ErrorResponse(500, 'Bulk upload failed');
    //     } finally {
    //         await queryRunner.release();
    //     }
    // }

    async bulkUploadProducts(file: Express.Multer.File): Promise<CommonResponse> {
        const getCellValue = (cell: ExcelJS.Cell) => {
            if (cell.value === null || cell.value === undefined) {
                return null;
            }
            if (typeof cell.value === 'object') {
                return (cell.value as any).text || cell.value.toString();
            }
            return cell.value.toString();
        };

        const parseDate = (dateString: string) => {
            const parsedDate = new Date(dateString);
            return isNaN(parsedDate.getTime()) ? null : parsedDate;
        };

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(file.buffer);
            const worksheet = workbook.worksheets[0];

            // Map headers dynamically, case-insensitively
            const headers: { [key: string]: number } = {};
            worksheet.getRow(1).eachCell((cell, colNumber) => {
                const headerName = getCellValue(cell)?.toLowerCase();
                if (headerName) {
                    headers[headerName] = colNumber;
                }
            });

            const data = [];
            worksheet.eachRow((row, rowIndex) => {
                if (rowIndex > 1) {
                    const getCellValueByHeader = (header: string) => {
                        const colNumber = headers[header.toLowerCase()];
                        return colNumber ? getCellValue(row.getCell(colNumber)) : null;
                    };

                    data.push({
                        productName: getCellValueByHeader('Product name'),
                        dateOfPurchase: parseDate(getCellValueByHeader('Date Of Purchase')),
                        vendorName: getCellValueByHeader('vendor name'),
                        vendorEmailId: getCellValueByHeader('vendor email id'),
                        vendorAddress: getCellValueByHeader('vendor address'),
                        imeiNumber: getCellValueByHeader('imei number'),
                        supplierName: getCellValueByHeader('supplier name'),
                        serialNumber: getCellValueByHeader('serial number'),
                        primaryNo: getCellValueByHeader('primary no'),
                        secondaryNo: getCellValueByHeader('secondary no'),
                        primaryNetwork: getCellValueByHeader('primary network'),
                        secondaryNetwork: getCellValueByHeader('secondary network'),
                        categoryName: getCellValueByHeader('category name'),
                        voucherId: getCellValueByHeader('voucher id'),
                        price: parseFloat(getCellValueByHeader('price') || '0'),
                        productDescription: getCellValueByHeader('product description'),
                        companyCode: getCellValueByHeader('company code'),
                        vendorPhoneNumber: getCellValueByHeader('vendor phone number'),
                        deviceModel: getCellValueByHeader('device model'),
                        unitCode: getCellValueByHeader('unit code'),
                        simStatus: getCellValueByHeader('sim status'),
                        planName: getCellValueByHeader('plan name'),
                        remarks1: getCellValueByHeader('remarks 1'),
                        remarks2: getCellValueByHeader('remarks 2'),
                        quantity: parseInt(getCellValueByHeader('quantity') || '0', 10),
                        SNO: parseInt(getCellValueByHeader('sno') || '0', 10),
                        ICCIDNo: getCellValueByHeader('ICCID No'),
                        hsnCode: getCellValueByHeader('hsn Code'),

                    });
                }
            });
            console.log(data, "datadata")
            const productEntities = await Promise.all(
                data.map(async (productDto) => this.handleProductData(productDto))
            );
            console.log(productEntities, "productEntitiesproductEntities")
            await queryRunner.manager.save(productEntities);
            await queryRunner.commitTransaction();

            return new CommonResponse(true, 201, 'Products uploaded successfully');
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new ErrorResponse(500, 'Bulk upload failed');
        } finally {
            await queryRunner.release();
        }
    }


    async handleProductData(productDto: ProductDto, photo?: Express.Multer.File): Promise<ProductEntity> {
        let productEntity: ProductEntity;

        if (productDto.id) {
            productEntity = await this.productRepository.findOne({ where: { id: productDto.id } });
            if (!productEntity) {
                throw new ErrorResponse(400, `Product with ID ${productDto.id} not found`);
            }
        } else {
            productEntity = new ProductEntity();
        }

        Object.assign(productEntity, {
            SNO: productDto.SNO ?? productEntity.SNO,
            productName: productDto.productName ?? productEntity.productName,
            dateOfPurchase: productDto.dateOfPurchase ?? productEntity.dateOfPurchase,
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
            deviceModel: productDto.deviceModel ?? productEntity.deviceModel,
            imeiNumber: productDto.imeiNumber ?? productEntity.imeiNumber,
            quantity: productDto.quantity ?? productEntity.quantity,
            vendorName: productDto.vendorName ?? productEntity.vendorName,
            vendorPhoneNumber: productDto.vendorPhoneNumber ?? productEntity.vendorPhoneNumber,
            vendorAddress: productDto.vendorAddress ?? productEntity.vendorAddress,
            vendorEmailId: productDto.vendorEmailId ?? productEntity.vendorEmailId,
            ICCIDNo: productDto.ICCIDNo ?? productEntity.ICCIDNo,
            hsnCode: productDto.hsnCode ?? productEntity.hsnCode
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
                    unitCode: productDto.unitCode,
                });
                vendor.vendorId = this.generateVendorId((await this.vendorRepository.count()) + 1);
                await this.vendorRepository.save(vendor);
            }
            productEntity.vendorId = vendor;
        }

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
            let photoPath: string | null = null

            if (photo) {
                const bucket = this.storage.bucket(this.bucketName);
                const uniqueFileName = `client_photos/${Date.now()}-${photo.originalname}`;
                const file = bucket.file(uniqueFileName);

                await file.save(photo.buffer, {
                    contentType: photo.mimetype,
                    resumable: false,
                });

                console.log(`File uploaded to GCS: ${uniqueFileName}`);
                photoPath = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
            }
            const productEntity = await this.handleProductData(productDto, photo);
            console.log(productEntity, productDto, "{{{{{{{{{{{{{{{{{{{{")
            await this.productRepository.save(productEntity);
            return new CommonResponse(true, 201, 'Product details created successfully');
        } catch (error) {
            console.error('Error creating or updating product', error);
            throw new ErrorResponse(500, 'Error creating or updating product');
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
