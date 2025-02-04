import { Injectable } from '@nestjs/common';
import { ClientEntity } from 'src/client/entity/client.entity';
import { ClientRepository } from 'src/client/repo/client.repo';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { ProductRepository } from 'src/product/repo/product.repo';
import { In, IsNull, Not } from 'typeorm';
import { EstimateIdDto } from './dto/estimate-id.dto';
import { EstimateResDto } from './dto/estimate-res.dto';
import { EstimateDto } from './dto/estimate.dto';
import { EstimateAdapter } from './estimate.adapter';
import { EstimateRepository } from './repo/estimate.repo';
import { CommonReq } from 'src/models/common-req';
import { Storage } from '@google-cloud/storage';
import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';
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

    async updateEstimateDetails(dto: EstimateDto): Promise<CommonResponse> {
        try {
            const existingEstimate = await this.estimateRepository.findOne({
                where: { id: dto.id },
                relations: ['products'],
            });

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
                const totalCost = product.price * productDetail.quantity;

                return {
                    productId: product.id,
                    productName: product.productName,
                    quantity: productDetail.quantity,
                    costPerUnit: product.price,
                    totalCost: totalCost,
                    hsnCode: product.hsnCode
                };
            });

            Object.assign(existingEstimate, this.estimateAdapter.convertDtoToEntity(dto));
            existingEstimate.clientId = client;
            existingEstimate.productDetails = productDetails;

            let estimatePdfUrl: string | null = existingEstimate.estimatePdfUrl;

            if (estimatePdfUrl && dto.estimatePdfUrl) {
                if (estimatePdfUrl !== dto.estimatePdfUrl) {
                    const existingFilePath = existingEstimate.estimatePdfUrl.replace(`https://storage.googleapis.com/${this.bucketName}/`, '');
                    const file = this.storage.bucket(this.bucketName).file(existingFilePath);

                    try {
                        await file.delete();
                        console.log(`Deleted old file from GCS: ${existingFilePath}`);
                    } catch (error) {
                        console.error(`Error deleting old file from GCS: ${error.message}`);
                    }
                }

                // Upload new PDF
                if (dto.estimatePdfUrl.startsWith('data:application/pdf;base64,')) {
                    // If the PDF is in base64 format
                    const base64Data = dto.estimatePdfUrl.split(',')[1];
                    const fileBuffer = Buffer.from(base64Data, 'base64');

                    // Save the file to Google Cloud Storage
                    const bucket = this.storage.bucket(this.bucketName);
                    const uniqueFileName = `estimate_pdfs/${Date.now()}-estimate.pdf`;
                    const gcsFile = bucket.file(uniqueFileName);

                    await gcsFile.save(fileBuffer, {
                        contentType: 'application/pdf',
                        resumable: false,
                    });

                    await gcsFile.makePublic(); // Make the file publicly accessible
                    estimatePdfUrl = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;

                    console.log(`PDF uploaded to GCS: ${estimatePdfUrl}`);
                } else {
                    // If the file is already a URL, store it directly
                    estimatePdfUrl = dto.estimatePdfUrl;
                }
            }

            // If converting to invoice, handle invoice PDF URL as well
            if (dto.convertToInvoice && dto.invoicePdfUrl) {
                let invoicePdfUrl: string | null = null;

                if (dto.invoicePdfUrl.startsWith('data:application/pdf;base64,')) {
                    const base64Data = dto.invoicePdfUrl.split(',')[1];
                    const fileBuffer = Buffer.from(base64Data, 'base64');

                    // Save the invoice PDF to Google Cloud Storage
                    const bucket = this.storage.bucket(this.bucketName);
                    const uniqueInvoiceFileName = `invoices_pdfs/${Date.now()}-invoice.pdf`;
                    const gcsFile = bucket.file(uniqueInvoiceFileName);

                    await gcsFile.save(fileBuffer, {
                        contentType: 'application/pdf',
                        resumable: false,
                    });

                    await gcsFile.makePublic(); // Make the file publicly accessible
                    invoicePdfUrl = `https://storage.googleapis.com/${this.bucketName}/${uniqueInvoiceFileName}`;

                    console.log(`Invoice PDF uploaded to GCS: ${invoicePdfUrl}`);
                } else {
                    // If the file is already a URL, store it directly
                    invoicePdfUrl = dto.invoicePdfUrl;
                }

                // Save the invoice PDF URL to the estimate
                existingEstimate.invoicePdfUrl = invoicePdfUrl;
            }

            // Calculate total amount
            const totalAmount = productDetails.reduce((sum, product) => sum + product.totalCost, 0);
            existingEstimate.amount = totalAmount;

            // Generate Invoice ID if converting to invoice
            if (dto.convertToInvoice) {
                existingEstimate.invoiceId = this.generateInvoiceId(await this.getInvoiceCount(client));
                existingEstimate.CGST = (totalAmount * dto.cgstPercentage) / 100;
                existingEstimate.SCST = (totalAmount * dto.scstPercentage) / 100;
            }

            // Save the updated estimate
            await this.estimateRepository.save(existingEstimate);

            return new CommonResponse(true, 200, 'Estimate details updated successfully');
        } catch (error) {
            console.error(`Error updating estimate details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to update estimate details: ${error.message}`);
        }
    }



    async createEstimateDetails(dto: EstimateDto): Promise<CommonResponse> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();

        try {
            let estimatePdfUrl: string | null = null;

            if (dto.estimatePdfUrl) {
                if (dto.estimatePdfUrl.startsWith('data:application/pdf;base64,')) {
                    const base64Data = dto.estimatePdfUrl.split(',')[1];
                    const fileBuffer = Buffer.from(base64Data, 'base64');

                    const bucket = this.storage.bucket(this.bucketName);
                    const uniqueFileName = `estimate_pdfs/${Date.now()}-estimate.pdf`;
                    const gcsFile = bucket.file(uniqueFileName);

                    await gcsFile.save(fileBuffer, {
                        contentType: 'application/pdf',
                        resumable: false,
                    });

                    await gcsFile.makePublic();
                    estimatePdfUrl = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
                    console.log(`PDF uploaded to GCS: ${estimatePdfUrl}`);
                } else {
                    estimatePdfUrl = dto.estimatePdfUrl;
                }
            }

            const client = await this.clientRepository.findOne({
                where: { clientId: dto.clientId },
            });

            if (!client) {
                return new CommonResponse(false, 400, `Client with ID ${dto.clientId} not found`);
            }

            const productDetails = await Promise.all(
                dto.productDetails.map(async (productDetail) => {
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
            newEstimate.estimatePdfUrl = estimatePdfUrl;

            console.log(newEstimate, "___________");

            await queryRunner.manager.save(newEstimate);

            await queryRunner.commitTransaction();
            return new CommonResponse(true, 201, 'Estimate details created successfully');
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error(`Error creating estimate details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to create estimate details: ${error.message}`);
        } finally {
            await queryRunner.release();
        }
    }


    private async getInvoiceCount(client: ClientEntity): Promise<number> {
        return this.estimateRepository.count({ where: { clientId: client, invoiceId: Not(IsNull()) } });
    }

    async handleEstimateDetails(dto: EstimateDto): Promise<CommonResponse> {
        if (dto.id || dto.estimateId) {
            return await this.updateEstimateDetails(dto);
        } else {
            return await this.createEstimateDetails(dto);
        }
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
                relations: ['clientId', 'products'],
                where: { estimateId: req.estimateId, companyCode: req.companyCode, unitCode: req.unitCode }
            });

            if (!estimate) {
                return new CommonResponse(false, 404, 'Estimate not found');
            }

            const data: EstimateResDto[] = this.estimateAdapter.convertEntityToResDto([estimate]);
            return new CommonResponse(true, 200, 'Estimate details fetched successfully', data);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getAllEstimateDetails(req: CommonReq): Promise<CommonResponse> {
        try {
            const estimate = await this.estimateRepository.find({
                relations: ['clientId', 'products'],
                where: { companyCode: req.companyCode, unitCode: req.unitCode }
            });

            if (!estimate) {
                return new CommonResponse(false, 404, 'Estimate not found');
            }

            const data: EstimateResDto[] = this.estimateAdapter.convertEntityToResDto(estimate);
            return new CommonResponse(true, 200, 'Estimate details fetched successfully', data);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }
}
