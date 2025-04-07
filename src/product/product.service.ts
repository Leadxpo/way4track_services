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
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { ProductTypeRepository } from 'src/product-type/repo/product-type.repo';
import * as xlsx from 'xlsx';

@Injectable()
export class ProductService {
    private storage: Storage;
    private bucketName: string;
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly vendorRepository: VendorRepository,
        private readonly voucherRepository: VoucherRepository,
        private dataSource: DataSource,
        private readonly productTypeRepo: ProductTypeRepository
    ) {
        this.storage = new Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });

        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }

    // async bulkUploadProducts(file: Express.Multer.File): Promise<any[]> {
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

    //     try {
    //         const workbook = new ExcelJS.Workbook();
    //         await workbook.xlsx.load(file.buffer);
    //         const worksheet = workbook.worksheets[0];

    //         // Define header normalization mapping
    //         const headerMapping: { [key: string]: string } = {
    //             "product name": "productName",
    //             "date of purchase": "inDate",
    //             "vendor name": "vendorName",
    //             "vendor email id": "vendorEmailId",
    //             "vendor address": "vendorAddress",
    //             "imei number": "imeiNumber",
    //             "supplier name": "supplierName",
    //             "serial number": "serialNumber",
    //             "primary no": "primaryNo",
    //             "secondary no": "secondaryNo",
    //             "primary network": "primaryNetwork",
    //             "secondary network": "secondaryNetwork",
    //             "category name": "categoryName",
    //             "voucher id": "voucherId",
    //             "cost": "cost",
    //             "product description": "productDescription",
    //             "company code": "companyCode",
    //             "vendor phone number": "vendorPhoneNumber",
    //             "device model": "deviceModel",
    //             "unit code": "unitCode",
    //             "sim status": "simStatus",
    //             "plan name": "planName",
    //             "remarks 1": "remarks1",
    //             "remarks 2": "remarks2",
    //             "quantity": "quantity",
    //             "iccid no": "ICCIDNo",
    //             "hsn code": "hsnCode",
    //             "remarks3": "remarks3",
    //             "BASKET_NAME": "BASKET_NAME",
    //             "SIM_IMSI": "SIM_IMSI",
    //             "SIMNUMBER": "SIMNUMBER",
    //             "MOBILE_NUMBER": "MOBILE_NUMBER",
    //         };

    //         // Map headers dynamically, case-insensitively
    //         const headers: { [key: string]: number } = {};
    //         worksheet.getRow(1).eachCell((cell, colNumber) => {
    //             const headerName = getCellValue(cell)?.toLowerCase();
    //             if (headerName && headerMapping[headerName]) {
    //                 headers[headerMapping[headerName]] = colNumber;
    //             }
    //         });

    //         const data = [];
    //         worksheet.eachRow((row, rowIndex) => {
    //             if (rowIndex > 1) {
    //                 const getCellValueByHeader = (header: string) => {
    //                     const colNumber = headers[header];
    //                     return colNumber ? getCellValue(row.getCell(colNumber)) : null;
    //                 };

    //                 const imeiNumber = getCellValueByHeader('imeiNumber');
    //                 const ICCIDNo = getCellValueByHeader('ICCIDNo');

    //                 // Skip row if both imeiNumber and ICCIDNo are missing
    //                 if (!imeiNumber && !ICCIDNo) {
    //                     return;
    //                 }

    //                 data.push({
    //                     productName: getCellValueByHeader('productName'),
    //                     inDate: parseDate(getCellValueByHeader('inDate')),
    //                     vendorName: getCellValueByHeader('vendorName'),
    //                     vendorEmailId: getCellValueByHeader('vendorEmailId'),
    //                     vendorAddress: getCellValueByHeader('vendorAddress'),
    //                     imeiNumber,
    //                     supplierName: getCellValueByHeader('supplierName'),
    //                     serialNumber: getCellValueByHeader('serialNumber'),
    //                     primaryNo: getCellValueByHeader('primaryNo'),
    //                     secondaryNo: getCellValueByHeader('secondaryNo'),
    //                     primaryNetwork: getCellValueByHeader('primaryNetwork'),
    //                     secondaryNetwork: getCellValueByHeader('secondaryNetwork'),
    //                     categoryName: getCellValueByHeader('categoryName'),
    //                     voucherId: getCellValueByHeader('voucherId'),
    //                     cost: parseFloat(getCellValueByHeader('cost') || '0'),
    //                     productDescription: getCellValueByHeader('productDescription'),
    //                     companyCode: getCellValueByHeader('companyCode'),
    //                     vendorPhoneNumber: getCellValueByHeader('vendorPhoneNumber'),
    //                     deviceModel: getCellValueByHeader('deviceModel'),
    //                     unitCode: getCellValueByHeader('unitCode'),
    //                     simStatus: getCellValueByHeader('simStatus'),
    //                     planName: getCellValueByHeader('planName'),
    //                     remarks1: getCellValueByHeader('remarks1'),
    //                     remarks2: getCellValueByHeader('remarks2'),
    //                     quantity: parseInt(getCellValueByHeader('quantity') || '1'),
    //                     ICCIDNo,
    //                     hsnCode: getCellValueByHeader('hsnCode'),
    //                     remarks3: getCellValueByHeader('remarks3'),
    //                     BASKET_NAME: getCellValueByHeader('BASKET_NAME'),
    //                     SIM_IMSI: getCellValueByHeader('SIM_IMSI'),
    //                     SIMNUMBER: getCellValueByHeader('SIMNUMBER'),
    //                     MOBILE_NUMBER: getCellValueByHeader('MOBILE_NUMBER'),
    //                 });
    //             }
    //         });

    //         // const productEntities = await Promise.all(
    //         //     data.map(async (productDto) => this.handleProductData(productDto))
    //         // );

    //         return data;
    //     } catch (error) {
    //         throw new ErrorResponse(500, 'Error parsing Excel file');
    //     }
    // }

    async bulkUploadProducts(file: Express.Multer.File): Promise<any[]> {
        console.log(file, "+++++++")
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

        try {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(file.buffer);
            const worksheet = workbook.worksheets[0];

            const headerMapping: { [key: string]: string } = {
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
                // "voucher id": "voucherId",
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

            const headers: { [key: string]: number } = {};
            worksheet.getRow(1).eachCell((cell, colNumber) => {
                const headerName = getCellValue(cell)?.toLowerCase();
                if (headerName && headerMapping[headerName]) {
                    headers[headerMapping[headerName]] = colNumber;
                }
            });
            console.log(headers)
            const finalData = [];
            const results = [];


            for (let rowIndex = 2; rowIndex <= worksheet.rowCount; rowIndex++) {
                const row = worksheet.getRow(rowIndex);

                const getCellValueByHeader = (header: string) => {
                    const colNumber = headers[header];
                    return colNumber ? getCellValue(row.getCell(colNumber)) : null;
                };

                const imeiNumber = getCellValueByHeader('imeiNumber');
                const simNumber = getCellValueByHeader('SIM_Number');
                console.log(simNumber, "==")
                if (!imeiNumber && !simNumber) continue;

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
                    // voucherId: getCellValueByHeader('voucherId'),
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
                    mobileNumber: getCellValueByHeader('MOBILE_NUMBER'),
                    simNumber,
                };
                console.log(currentRow, "::::::::")

                let existing = null;

                if (imeiNumber && simNumber) {
                    existing = await this.productRepository.findOne({
                        where: [
                            { imeiNumber },
                            { simNumber: simNumber }
                        ],
                    });
                } else if (imeiNumber) {
                    existing = await this.productRepository.findOne({
                        where: { imeiNumber },
                    });
                } else if (simNumber) {
                    existing = await this.productRepository.findOne({
                        where: { simNumber: simNumber },
                    });
                }
                console.log(existing, "??????????")
                if (existing) {
                    const hasChanged = Object.keys(currentRow).some(key => {
                        return currentRow[key] !== existing[key];
                    });

                    if (hasChanged) {
                        await this.productRepository.update(existing.id, currentRow);
                        results.push({
                            row: rowIndex,
                            status: 'updated',
                            message: 'Product updated successfully.',
                            identifier: imeiNumber || simNumber
                        });
                    } else {
                        results.push({
                            row: rowIndex,
                            status: 'exists',
                            message: 'Product already exists with no changes.',
                            identifier: imeiNumber || simNumber
                        });
                    }
                } else {
                    finalData.push(currentRow);
                    results.push({
                        row: rowIndex,
                        status: 'inserted',
                        message: 'New product added.',
                        identifier: imeiNumber || simNumber
                    });
                }

            }
            console.log(finalData, ">>>>>>>>>")
            return finalData;
        } catch (error) {
            console.error("Error processing Excel:", error); // <-- log actual error
            throw new ErrorResponse(500, 'Error parsing Excel file');
        }

    }


    async handleProductData(productDto: ProductDto): Promise<ProductEntity> {
        let productEntity: ProductEntity;

        if (productDto.id || productDto.id !== null) {
            productEntity = await this.productRepository.findOne({ where: { id: productDto.id } });
            if (!productEntity) {
                throw new ErrorResponse(400, `Product with ID ${productDto.id} not found`);
            }
        } else {
            productEntity = new ProductEntity();
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

        // if (productDto.voucherId) {
        //     const voucher = await this.voucherRepository.findOne({
        //         where: { id: productDto.voucherId },
        //     });
        //     if (!voucher) {
        //         throw new ErrorResponse(400, `Voucher with ID ${productDto.voucherId} not found`);
        //     }
        //     productEntity.voucherId = [voucher];
        // }

        return productEntity;
    }

    private generateVendorId(sequenceNumber: number): string {
        const paddedNumber = sequenceNumber.toString().padStart(3, '0');
        return `v-${paddedNumber}`;
    }

    async createOrUpdateProduct(
        productDto: ProductDto,
        file: Express.Multer.File
    ): Promise<CommonResponse> {
        if (!file) {
            return new CommonResponse(false, 400, 'File is required');
        }
        console.log(file, "file")
        // Convert Excel file to JSON
        const jsonData = await this.bulkUploadProducts(file);
        console.log(jsonData, "jsonData")

        if (!jsonData || jsonData.length === 0) {
            return new CommonResponse(false, 400, 'Invalid or empty Excel file');
        }
        console.log(jsonData, "...........")
        let designationEntity = null;
        if (productDto.productTypeId) {
            designationEntity = await this.productTypeRepo.findOne({
                where: { id: productDto.productTypeId }
            });

            if (!designationEntity) {
                throw new Error(`productType with ID '${productDto.productTypeId}' not found.`);
            }
            console.log(designationEntity, 'designationEntity');

            productDto.productType = designationEntity.name; // Store name
            productDto.productTypeId = designationEntity; // Store relation
        }
        console.log(designationEntity, "}}}}}")
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
                vendor = await this.vendorRepository.save(vendor);
            }

            productDto.vendorId = vendor.id;
        }


        // if (productDto.voucherId) {
        //     const voucher = await this.voucherRepository.findOne({
        //         where: { id: productDto.voucherId },
        //     });

        //     if (!voucher) {
        //         return new CommonResponse(false, 400, `Voucher with ID ${productDto.voucherId} not found`);
        //     }
        // }

        const finalProductData = jsonData.map((excelRow) => ({
            ...excelRow,
            ...productDto,
            productTypeId: productDto.productTypeId,
            productType: productDto.productType
        }));

        console.log(finalProductData, "/////")
        await this.productRepository.save(finalProductData);

        return new CommonResponse(true, 201, 'Products saved successfully');
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

    async getDetailProduct(req: CommonReq): Promise<CommonResponse> {
        try {
            const product = await this.productRepository.getDetailProduct(req)
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
