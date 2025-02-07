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

            // Define header normalization mapping
            const headerMapping: { [key: string]: string } = {
                "product name": "productName",
                "date of purchase": "dateOfPurchase",
                "vendor name": "vendorName",
                "vendor email id": "vendorEmailId",
                "vendor address": "vendorAddress",
                "imei number": "imeiNumber",
                "supplier name": "supplierName",
                "serial number": "serialNumber",
                "device serial no": "serialNumber",
                "device serial number": "serialNumber",
                "primary no": "primaryNo",
                "secondary no": "secondaryNo",
                "primary network": "primaryNetwork",
                "secondary network": "secondaryNetwork",
                "category name": "categoryName",
                "voucher id": "voucherId",
                "price": "price",
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
                "sno": "SNO",
                "iccid no": "ICCIDNo",
                "hsn code": "hsnCode",
                "remarks3": "remarks3",
                "BASKET_NAME": "BASKET_NAME",
                "SIM_IMSI": "SIM_IMSI",
                "MOBILE_NUMBER": "MOBILE_NUMBER",

            };

            // Map headers dynamically, case-insensitively
            const headers: { [key: string]: number } = {};
            worksheet.getRow(1).eachCell((cell, colNumber) => {
                const headerName = getCellValue(cell)?.toLowerCase();
                if (headerName && headerMapping[headerName]) {
                    headers[headerMapping[headerName]] = colNumber;
                }
            });

            const data = [];
            worksheet.eachRow((row, rowIndex) => {
                if (rowIndex > 1) {
                    const getCellValueByHeader = (header: string) => {
                        const colNumber = headers[header];
                        return colNumber ? getCellValue(row.getCell(colNumber)) : null;
                    };

                    const imeiNumber = getCellValueByHeader('imeiNumber');
                    const ICCIDNo = getCellValueByHeader('ICCIDNo'); // SIM_IMSI equivalent

                    // Skip row if both imeiNumber and ICCIDNo are missing
                    if (!imeiNumber && !ICCIDNo) {
                        return;
                    }

                    data.push({
                        productName: getCellValueByHeader('productName'),
                        dateOfPurchase: parseDate(getCellValueByHeader('dateOfPurchase')),
                        vendorName: getCellValueByHeader('vendorName'),
                        vendorEmailId: getCellValueByHeader('vendorEmailId'),
                        vendorAddress: getCellValueByHeader('vendorAddress'),
                        imeiNumber,
                        supplierName: getCellValueByHeader('supplierName'),
                        serialNumber: getCellValueByHeader('serialNumber'), // Normalized column
                        primaryNo: getCellValueByHeader('primaryNo'),
                        secondaryNo: getCellValueByHeader('secondaryNo'),
                        primaryNetwork: getCellValueByHeader('primaryNetwork'),
                        secondaryNetwork: getCellValueByHeader('secondaryNetwork'),
                        categoryName: getCellValueByHeader('categoryName'),
                        voucherId: getCellValueByHeader('voucherId'),
                        price: parseFloat(getCellValueByHeader('price') || '0'),
                        productDescription: getCellValueByHeader('productDescription'),
                        companyCode: getCellValueByHeader('companyCode'),
                        vendorPhoneNumber: getCellValueByHeader('vendorPhoneNumber'),
                        deviceModel: getCellValueByHeader('deviceModel'),
                        unitCode: getCellValueByHeader('unitCode'),
                        simStatus: getCellValueByHeader('simStatus'),
                        planName: getCellValueByHeader('planName'),
                        remarks1: getCellValueByHeader('remarks1'),
                        remarks2: getCellValueByHeader('remarks2'),
                        quantity: parseInt(getCellValueByHeader('quantity') || '0', 10),
                        SNO: parseInt(getCellValueByHeader('SNO') || '0', 10),
                        ICCIDNo, // Normalized SIM_IMSI field
                        hsnCode: getCellValueByHeader('hsnCode'),
                        remarks3: getCellValueByHeader('remarks3'),
                        BASKET_NAME: getCellValueByHeader('BASKET_NAME'),
                        SIM_IMSI: getCellValueByHeader('SIM_IMSI'),
                        SIM_NO: getCellValueByHeader('SIM_NO'),
                        MOBILE_NUMBER: getCellValueByHeader('MOBILE_NUMBER'),
                    });
                }
            });

            // console.log(data, "Filtered Data");

            const productEntities = await Promise.all(
                data.map(async (productDto) => this.handleProductData(productDto))
            );

            // console.log(productEntities, "Product Entities");

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
            hsnCode: productDto.hsnCode ?? productEntity.hsnCode,
            remarks3: productDto.remarks3 ?? productEntity.remarks3,
            BASKET_NAME: productDto.BASKET_NAME ?? productEntity.basketName,
            SIM_IMSI: productDto.SIM_IMSI ?? productEntity.simImsi,
            SIM_NO: productDto.SIM_NO ?? productEntity.simNo,
            MOBILE_NUMBER: productDto.MOBILE_NUMBER ?? productEntity.mobileNumber

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

                // console.log(`File uploaded to GCS: ${uniqueFileName}`);
                photoPath = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
            }
            const productEntity = await this.handleProductData(productDto, photo);
            // console.log(productEntity, productDto, "{{{{{{{{{{{{{{{{{{{{")
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
