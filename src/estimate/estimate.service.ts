import { Injectable } from '@nestjs/common';
import { ClientEntity } from 'src/client/entity/client.entity';
import { ClientRepository } from 'src/client/repo/client.repo';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { ProductRepository } from 'src/product/repo/product.repo';
import { In, IsNull, Not } from 'typeorm';
import { EstimateIdDto } from './dto/estimate-id.dto';
import { EstimateResDto } from './dto/estimate-res.dto';
import { EstimateDto, ProductDetailDto } from './dto/estimate.dto';
import { EstimateAdapter } from './estimate.adapter';
import { EstimateRepository } from './repo/estimate.repo';
import { CommonReq } from 'src/models/common-req';
import { Storage } from '@google-cloud/storage';
import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { EstimateEntity } from './entity/estimate.entity';
@Injectable()
export class EstimateService {
    private storage: Storage;
    private bucketName: string;
    constructor(
        private readonly estimateAdapter: EstimateAdapter,
        private readonly estimateRepository: EstimateRepository,
        private readonly clientRepository: ClientRepository,
        private readonly productRepository: ProductRepository,
        private readonly dataSource: DataSource
    ) {
        this.storage = new Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });

        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }

    async updateEstimateDetails(
        dto: EstimateDto,
        estimatePdf: string | null,
        invoicePath: string | null
    ): Promise<CommonResponse> {
        try {

            let existingEstimate: EstimateEntity | null = null;

            if (!dto.id && !dto.estimateId) {
                return new CommonResponse(false, 400, 'Either Estimate ID or Estimate ID must be provided');
            }
            if (dto.id) {
                existingEstimate = await this.estimateRepository.findOne({ where: { id: dto.id } });
            } else if (dto.clientId) {
                existingEstimate = await this.estimateRepository.findOne({ where: { estimateId: dto.estimateId } });
            }

            if (!existingEstimate) {
                return new CommonResponse(false, 404, `Estimate with ID ${dto.id || dto.estimateId} not found`);
            }


            if (!existingEstimate) {
                return new CommonResponse(false, 404, `Estimate with ID ${dto.id} not found`);
            }

            const client = await this.clientRepository.findOne({ where: { clientId: dto.clientId } });
            if (!client) {
                return new CommonResponse(false, 400, `Client with ID ${dto.clientId} not found`);
            }

            const productIds = dto.productDetails.map((p) => p.productId);
            const products = await this.productRepository.find({ where: { id: In(productIds) } });

            if (products.length !== productIds.length) {
                throw new Error('Some products in the provided details do not exist');
            }

            const productDetails = dto.productDetails.map((productDetail) => {
                const product = products.find((p) => p.id === productDetail.productId);
                return {
                    productId: product.id,
                    productName: product.productName,
                    quantity: productDetail.quantity,
                    costPerUnit: product.price,
                    totalCost: product.price * productDetail.quantity,
                    hsnCode: product.hsnCode,
                };
            });

            const totalAmount = productDetails.reduce((sum, product) => sum + product.totalCost, 0);


            existingEstimate.clientId = client;
            existingEstimate.productDetails = productDetails;
            existingEstimate.amount = totalAmount;


            // Handle Estimate PDF Upload

            const updatedValues = this.estimateAdapter.convertDtoToEntity(dto);
            updatedValues.clientId = client
            if (estimatePdf) {
                existingEstimate.estimatePdfUrl = await this.handleFileUpload(
                    estimatePdf,
                    existingEstimate.estimatePdfUrl,
                    'estimate_pdfs'
                );
                dto.estimatePdfUrl = existingEstimate.estimatePdfUrl
                updatedValues.estimatePdfUrl = existingEstimate.estimatePdfUrl;

            }
            updatedValues.productDetails = productDetails
            updatedValues.amount = totalAmount
            if (dto.convertToInvoice) {
                const invoiceId = this.generateInvoiceId(await this.getInvoiceCount(existingEstimate.id));
                dto.invoiceId = invoiceId
                updatedValues.invoiceId = invoiceId;

                // existingEstimate.CGST = (totalAmount * dto.cgstPercentage) / 100;
                // existingEstimate.SCST = (totalAmount * dto.scstPercentage) / 100;
                if (invoicePath) {
                    existingEstimate.invoicePdfUrl = await this.handleFileUpload(
                        invoicePath,
                        existingEstimate.invoicePdfUrl,
                        'invoices_pdfs'
                    );
                    dto.invoicePdfUrl = existingEstimate.invoicePdfUrl
                    updatedValues.invoicePdfUrl = existingEstimate.invoicePdfUrl;

                }
            }
            updatedValues.CGST = (totalAmount * dto.cgstPercentage) / 100;
            updatedValues.SCST = (totalAmount * dto.scstPercentage) / 100;
            Object.assign(existingEstimate, updatedValues);
            await this.estimateRepository.update({ estimateId: existingEstimate.estimateId }, updatedValues);

            // await this.estimateRepository.save(existingEstimate);
            return new CommonResponse(true, 200, 'Estimate details updated successfully');
        } catch (error) {
            console.error(`Error updating estimate details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to update estimate details: ${error.message}`);
        }
    }

    private async handleFileUpload(newFile: string, existingFileUrl: string | null, folder: string): Promise<string> {
        if (existingFileUrl && newFile !== existingFileUrl) {
            const existingFilePath = existingFileUrl.replace(`https://storage.googleapis.com/${this.bucketName}/`, '');
            const file = this.storage.bucket(this.bucketName).file(existingFilePath);
            try {
                await file.delete();
                console.log(`Deleted old file: ${existingFilePath}`);
            } catch (error) {
                console.error(`Error deleting old file: ${error.message}`);
            }
        }

        if (newFile.startsWith('data:application/pdf;base64,')) {
            const base64Data = newFile.split(',')[1];
            const fileBuffer = Buffer.from(base64Data, 'base64');

            const uniqueFileName = `${folder}/${Date.now()}.pdf`;
            const gcsFile = this.storage.bucket(this.bucketName).file(uniqueFileName);

            await gcsFile.save(fileBuffer, {
                contentType: 'application/pdf',
                resumable: false,
            });

            await gcsFile.makePublic();
            return `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
        }
        return newFile;
    }

    private async uploadFileToGCS(file: Express.Multer.File, folder: string): Promise<string> {
        let url: string | null = null
        const bucket = this.storage.bucket(this.bucketName);
        const uniqueFileName = `${folder}/${Date.now()}-${file.originalname}`;
        const gcsFile = bucket.file(uniqueFileName);

        await gcsFile.save(file.buffer, {
            contentType: file.mimetype,
            resumable: false,
        });

        console.log(`File uploaded to GCS: ${uniqueFileName}`);
        url = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
        return url;
    }


    async createEstimateDetails(dto: EstimateDto, estimatePdf: string | null): Promise<CommonResponse> {
        try {
            console.log(dto, "{{{{{{{{{{{{{{{");

            const client = await this.clientRepository.findOne({
                where: { clientId: dto.clientId },
            });

            if (!client) {
                return new CommonResponse(false, 400, `Client with ID ${dto.clientId} not found`);
            }

            // Ensure productDetails is always an array
            const productDetailsArray: ProductDetailDto[] =
                typeof dto.productDetails === "string"
                    ? JSON.parse(dto.productDetails)
                    : dto.productDetails;

            if (!Array.isArray(productDetailsArray)) {
                throw new Error("Invalid productDetails format. Expected an array.");
            }
            console.log(productDetailsArray, "productDetailsArray")
            const productDetails = await Promise.all(
                productDetailsArray.map(async (productDetail) => {
                    const product = await this.productRepository.findOne({
                        where: { id: productDetail.productId },
                    });
                    if (!product) {
                        throw new Error(`Product with ID ${productDetail.productId} not found`);
                    }

                    const quantity = productDetail.quantity ? parseInt(productDetail.quantity.toString(), 10) : 0;
                    if (quantity <= 0) {
                        throw new Error(`Quantity for product ${product.productName} must be greater than 0`);
                    }

                    const costPerUnit = parseFloat(product.price.toString()) || 0;
                    if (costPerUnit <= 0) {
                        throw new Error(`Cost per unit for product ${product.productName} must be greater than 0`);
                    }

                    const totalCost = costPerUnit * quantity;

                    return {
                        productId: product.id,
                        productName: product.productName,
                        quantity: quantity,
                        costPerUnit: costPerUnit,
                        totalCost: totalCost || 0,
                        hsnCode: product.hsnCode,
                    };
                })
            );

            const totalAmount = productDetails.reduce((sum, product) => sum + (product.totalCost || 0), 0);

            const newEstimate = this.estimateAdapter.convertDtoToEntity(dto);
            newEstimate.clientId = client;
            newEstimate.productDetails = productDetails;
            newEstimate.amount = totalAmount || 0;
            newEstimate.estimateId = `EST-${(await this.estimateRepository.count() + 1).toString().padStart(4, '0')}`;


            if (estimatePdf) {
                newEstimate.estimatePdfUrl = await this.handleFileUpload(
                    estimatePdf,
                    newEstimate.estimatePdfUrl,
                    'estimate_pdfs'
                );
                dto.estimatePdfUrl = newEstimate.estimatePdfUrl
            }
            console.log(newEstimate, "___________");

            await this.estimateRepository.insert(newEstimate);

            return new CommonResponse(true, 201, 'Estimate details created successfully');
        } catch (error) {
            console.error(`Error creating estimate details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to create estimate details: ${error.message}`);
        }
    }


    async uploadAndHandleEstimateDetails(
        dto: EstimateDto,
        files: { estimatePdf?: Express.Multer.File[], invoicePDF?: Express.Multer.File[] }
    ): Promise<CommonResponse> {
        try {
            let estimatePath: string | null = null;
            let invoicePath: string | null = null;

            if (files?.estimatePdf?.length) {
                estimatePath = await this.uploadFileToGCS(files.estimatePdf[0], 'estimate_Pdfs');
            }

            if (files?.invoicePDF?.length) {
                invoicePath = await this.uploadFileToGCS(files.invoicePDF[0], 'invoice_Pdfs');
            }
            return (dto.id && dto.id !== null) || (dto.estimateId && dto.estimateId.trim() !== '')
                ? await this.updateEstimateDetails(dto, estimatePath, invoicePath)
                : await this.createEstimateDetails(dto, estimatePath);
        } catch (error) {
            console.error('Error in uploadAndHandleEstimateDetails:', error);
            return new CommonResponse(false, 500, 'Error processing estimate details');
        }
    }



    private async getInvoiceCount(id: number): Promise<number> {
        return this.estimateRepository.count({ where: { id: id, invoiceId: Not(IsNull()) } });
    }

    private generateInvoiceId(sequenceNumber: number): string {
        const paddedNumber = sequenceNumber.toString().padStart(4, '0');
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        return `INV-${paddedNumber}-${timestamp}`;
    }

    async deleteEstimateDetails(dto: EstimateIdDto): Promise<CommonResponse> {
        try {
            const estimate = await this.estimateRepository.findOne({ where: { estimateId: dto.estimateId, companyCode: dto.companyCode, unitCode: dto.unitCode } });
            if (!estimate) {
                return new CommonResponse(false, 404, 'Estimate not found');
            }

            await this.estimateRepository.delete(dto.estimateId);
            return new CommonResponse(true, 200, 'Estimate details deleted successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }


    async getEstimateDetails(req: EstimateIdDto): Promise<CommonResponse> {
        try {
            const estimate = await this.estimateRepository.findOne({
                relations: ['clientId', 'products', 'vendorId'],  // ✅ Add 'vendorId' if needed
                where: { estimateId: req.estimateId, companyCode: req.companyCode, unitCode: req.unitCode }
            });

            if (!estimate) {
                return new CommonResponse(false, 404, 'Estimate not found');
            }

            console.log(estimate, "<<< Raw Estimate Data");

            const data = this.estimateAdapter.convertEntityToResDto([estimate]);

            console.log(data, "<<< Converted DTO Data");

            return new CommonResponse(true, 200, 'Estimate details fetched successfully', data);
        } catch (error) {
            console.error('Error fetching estimate details:', error);
            throw new ErrorResponse(500, error.message);
        }
    }

    async getAllEstimateDetails(req: CommonReq): Promise<CommonResponse> {
        try {
            const estimate = await this.estimateRepository.find({
                relations: ['clientId', 'products', 'vendorId'],  // ✅ Add 'vendorId' if needed
                where: { companyCode: req.companyCode, unitCode: req.unitCode }
            });

            if (!estimate) {
                return new CommonResponse(false, 404, 'Estimate not found');
            }

            console.log(estimate, "<<< Raw Estimate Data");

            const data = this.estimateAdapter.convertEntityToResDto(estimate);

            console.log(data, "<<< Converted DTO Data");

            return new CommonResponse(true, 200, 'Estimate details fetched successfully', data);
        } catch (error) {
            console.error('Error fetching estimate details:', error);
            throw new ErrorResponse(500, error.message);
        }
    }
}
