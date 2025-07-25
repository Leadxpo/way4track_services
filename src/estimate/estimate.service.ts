import { Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';
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
        estimatePdf?: string,
        invoicePath?: string
    ): Promise<CommonResponse> {
        try {

            const existingEstimate = await this.estimateRepository.findOne({
                where: { id: dto.id, estimateId: dto.estimateId || undefined },
            });
            if (!existingEstimate) {
                return new CommonResponse(false, 404, `Estimate with ID ${dto.id || dto.estimateId} not found`);
            }
            // Fields you want to ignore for safety (e.g., IDs, file URLs)
            const ignoreFields = ['id', 'estimateId', 'clientId', 'estimatePdfUrl', 'invoicePdfUrl'];

            // Dynamically copy valid fields from dto
            Object.keys(dto).forEach((key) => {
                if (
                    !ignoreFields.includes(key) &&
                    dto[key] !== undefined &&
                    dto[key] !== null
                ) {
                    (existingEstimate as any)[key] = dto[key];
                }
            });            const client = await this.clientRepository.findOne({ where: { clientId: dto.clientId } });
            if (!client) {
                return new CommonResponse(false, 400, `Client with ID ${dto.clientId} not found`);
            }

            let productDetails: ProductDetailDto[] = Array.isArray(dto.productDetails)
                ? dto.productDetails
                : dto.productDetails ? JSON.parse(dto.productDetails) : [];

            let updatedProductDetails = productDetails;

            const totalAmount = updatedProductDetails.reduce((sum, product) => sum + product.totalCost, 0);

            existingEstimate.productDetails = updatedProductDetails;
            existingEstimate.clientId = client;
            existingEstimate.amount = totalAmount;

            if (estimatePdf) {
                existingEstimate.estimatePdfUrl = await this.handleFileUpload(estimatePdf, existingEstimate.estimatePdfUrl, 'estimate_pdfs');
                dto.estimatePdfUrl = existingEstimate.estimatePdfUrl;
            }

            if (dto.convertToInvoice) {
                // existingEstimate.invoiceId = this.generateInvoiceId(await this.getInvoiceCount(existingEstimate.id));
                if (invoicePath) {
                    existingEstimate.invoicePdfUrl = await this.handleFileUpload(invoicePath, existingEstimate.invoicePdfUrl, 'invoices_pdfs');
                }
            }

            existingEstimate.CGST = (totalAmount * (dto.cgstPercentage || 0)) / 100;
            existingEstimate.TDS = (totalAmount * (dto.tdsPercentage || 0)) / 100;
            existingEstimate.SCST = (totalAmount * (dto.scstPercentage || 0)) / 100;

            await this.estimateRepository.save(existingEstimate);

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

    async createEstimateDetails(dto: EstimateDto, estimatePdf: string | null, invoicePath?: string): Promise<CommonResponse> {
        try {
            const client = await this.clientRepository.findOne({
                where: { clientId: dto.clientId },
            });

            if (!client) {
                return new CommonResponse(false, 400, `Client with ID ${dto.clientId} not found`);
            }
            const productDetailsArray: ProductDetailDto[] =
                typeof dto.productDetails === "string"
                    ? JSON.parse(dto.productDetails)
                    : dto.productDetails;

            if (!Array.isArray(productDetailsArray)) {
                throw new Error("Invalid productDetails format. Expected an array.");
            }
            dto.productDetails = productDetailsArray;

            const totalAmount = productDetailsArray.reduce((sum, product) => sum + (product.totalCost || 0), 0);

            const newEstimate = this.estimateAdapter.convertDtoToEntity(dto);
            newEstimate.clientId = client;
            newEstimate.productDetails = productDetailsArray;
            newEstimate.amount = totalAmount || 0;
            newEstimate.estimateId = dto.estimateId
            if (dto.convertToInvoice) {
                newEstimate.invoiceId = dto.invoiceId;
                if (invoicePath) {
                    newEstimate.invoicePdfUrl = await this.handleFileUpload(invoicePath, newEstimate.invoicePdfUrl, 'invoices_pdfs');
                }
            }

            newEstimate.CGST = (totalAmount * (dto.cgstPercentage || 0)) / 100 || 0;
            newEstimate.TDS = (totalAmount * (dto.tdsPercentage || 0)) / 100 || 0;
            newEstimate.SCST = (totalAmount * (dto.scstPercentage || 0)) / 100 || 0;

            if (estimatePdf) {
                newEstimate.estimatePdfUrl = await this.handleFileUpload(
                    estimatePdf,
                    newEstimate.estimatePdfUrl,
                    'estimate_pdfs'
                );
                dto.estimatePdfUrl = newEstimate.estimatePdfUrl
            }

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
            return (dto.id && dto.id !== null)
                ? await this.updateEstimateDetails(dto, estimatePath, invoicePath)
                : await this.createEstimateDetails(dto, estimatePath, invoicePath);
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
            // Find the client by client_id, companyCode, and unitCode
            const client = await this.estimateRepository.findOne({
                where: {
                    estimateId: String(dto.estimateId), // Ensure clientId is treated as a string
                    companyCode: dto.companyCode,
                    unitCode: dto.unitCode
                }
            });

            if (!client) {
                return new CommonResponse(false, 404, 'estimateId not found');
            }

            // Now delete using clientId (not id)
            await this.estimateRepository.delete({ estimateId: String(dto.estimateId) }); // Correct column is clientId

            return new CommonResponse(true, 200, 'estimateId details deleted successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getEstimateDetails(req: EstimateIdDto): Promise<CommonResponse> {
        try {
            const estimate = await this.estimateRepository.findOne({
                relations: ['clientId', 'products', 'vendorId', 'branchId'],  // ✅ Add 'vendorId' if needed
                where: { estimateId: req.estimateId, companyCode: req.companyCode, unitCode: req.unitCode }
            });

            if (!estimate) {
                return new CommonResponse(false, 404, 'Estimate not found');
            }

            const data = this.estimateAdapter.convertEntityToResDto([estimate]);

            return new CommonResponse(true, 200, 'Estimate details fetched successfully', data);
        } catch (error) {
            console.error('Error fetching estimate details:', error);
            throw new ErrorResponse(500, error.message);
        }
    }

    async getInvoiceDetails(req: EstimateIdDto): Promise<CommonResponse> {
        try {
            const invoice = await this.estimateRepository.findOne({
                relations: ['clientId', 'products', 'vendorId', 'branchId'],  // ✅ Add 'vendorId' if needed
                where: { invoiceId: req.invoiceId, companyCode: req.companyCode, unitCode: req.unitCode }
            });

            if (!invoice) {
                return new CommonResponse(false, 404, 'Estimate not found');
            }

            const data = this.estimateAdapter.convertEntityToResDto([invoice]);

            return new CommonResponse(true, 200, 'Invoice details fetched successfully', data);
        } catch (error) {
            console.error('Error fetching estimate details:', error);
            throw new ErrorResponse(500, error.message);
        }
    }


    async getEstimatePrefixDetails(req: EstimateIdDto): Promise<CommonResponse> {
      try {
        const entityManager = this.dataSource.manager;
    
        const result = await entityManager
          .createQueryBuilder('estimates', 'e')
          .select('e.prefix', 'prefix')
          .addSelect('COUNT(*)', 'count')
          .where('e.companyCode = :companyCode AND e.unitCode = :unitCode', {
            companyCode: req.companyCode,
            unitCode: req.unitCode,
          })
          .groupBy('e.prefix')
          .getRawMany();
    
        return new CommonResponse(true, 200, 'Prefix counts fetched successfully', result);
      } catch (error) {
        console.error('Error fetching prefix counts:', error);
        throw new ErrorResponse(500, error.message);
      }
    }

    async getEstimatInvoicePrefixeDetails(req: EstimateIdDto): Promise<CommonResponse> {
      try {
        const entityManager = this.dataSource.manager;
    
        const result = await entityManager
          .createQueryBuilder('estimates', 'e')
          .select('e.invoice_prefix', 'invoicePrefix')
          .addSelect('COUNT(*)', 'count')
          .where('e.companyCode = :companyCode AND e.unitCode = :unitCode', {
            companyCode: req.companyCode,
            unitCode: req.unitCode,
          })
          .groupBy('e.invoice_prefix')
          .getRawMany();
    
        return new CommonResponse(true, 200, 'Prefix counts fetched successfully', result);
      } catch (error) {
        console.error('Error fetching prefix counts:', error);
        throw new ErrorResponse(500, error.message);
      }
    }
    
    async getAllEstimateDetails(req: CommonReq): Promise<CommonResponse> {
        try {
            const estimate = await this.estimateRepository.find({
                relations: ['clientId', 'products', 'vendorId', 'branchId'],  // ✅ Add 'vendorId' if needed
                where: { companyCode: req.companyCode, unitCode: req.unitCode },
                order: {
                    createdAt: 'DESC'  // <- this is what adds the descending sort
                }
            });

            if (!estimate) {
                return new CommonResponse(false, 404, 'Estimate not found');
            }

            const data = this.estimateAdapter.convertEntityToResDto(estimate);

            return new CommonResponse(true, 200, 'Estimate details fetched successfully', data);
        } catch (error) {
            console.error('Error fetching estimate details:', error);
            throw new ErrorResponse(500, error.message);
        }
    }
}
