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
exports.EstimateService = void 0;
const common_1 = require("@nestjs/common");
const client_repo_1 = require("../client/repo/client.repo");
const common_response_1 = require("../models/common-response");
const error_response_1 = require("../models/error-response");
const product_repo_1 = require("../product/repo/product.repo");
const typeorm_1 = require("typeorm");
const estimate_adapter_1 = require("./estimate.adapter");
const estimate_repo_1 = require("./repo/estimate.repo");
const storage_1 = require("@google-cloud/storage");
const typeorm_2 = require("typeorm");
let EstimateService = class EstimateService {
    constructor(estimateAdapter, estimateRepository, clientRepository, productRepository, dataSource) {
        this.estimateAdapter = estimateAdapter;
        this.estimateRepository = estimateRepository;
        this.clientRepository = clientRepository;
        this.productRepository = productRepository;
        this.dataSource = dataSource;
        this.storage = new storage_1.Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });
        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }
    async updateEstimateDetails(dto, estimatePdf, invoicePath) {
        try {
            const existingEstimate = await this.estimateRepository.findOne({
                where: { id: dto.id, estimateId: dto.estimateId || undefined },
            });
            if (!existingEstimate) {
                return new common_response_1.CommonResponse(false, 404, `Estimate with ID ${dto.id || dto.estimateId} not found`);
            }
            const client = await this.clientRepository.findOne({ where: { clientId: dto.clientId } });
            if (!client) {
                return new common_response_1.CommonResponse(false, 400, `Client with ID ${dto.clientId} not found`);
            }
            let productDetails = Array.isArray(dto.productDetails)
                ? dto.productDetails
                : dto.productDetails ? JSON.parse(dto.productDetails) : [];
            let updatedProductDetails = existingEstimate.productDetails || [];
            const totalAmount = updatedProductDetails.reduce((sum, product) => sum + product.totalCost, 0);
            existingEstimate.productDetails = updatedProductDetails;
            existingEstimate.clientId = client;
            existingEstimate.amount = totalAmount;
            if (estimatePdf) {
                existingEstimate.estimatePdfUrl = await this.handleFileUpload(estimatePdf, existingEstimate.estimatePdfUrl, 'estimate_pdfs');
            }
            if (dto.convertToInvoice) {
                existingEstimate.invoiceId = this.generateInvoiceId(await this.getInvoiceCount(existingEstimate.id));
                if (invoicePath) {
                    existingEstimate.invoicePdfUrl = await this.handleFileUpload(invoicePath, existingEstimate.invoicePdfUrl, 'invoices_pdfs');
                }
            }
            existingEstimate.CGST = (totalAmount * (dto.cgstPercentage || 0)) / 100;
            existingEstimate.SCST = (totalAmount * (dto.scstPercentage || 0)) / 100;
            await this.estimateRepository.save(existingEstimate);
            return new common_response_1.CommonResponse(true, 200, 'Estimate details updated successfully');
        }
        catch (error) {
            console.error(`Error updating estimate details: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(500, `Failed to update estimate details: ${error.message}`);
        }
    }
    async handleFileUpload(newFile, existingFileUrl, folder) {
        if (existingFileUrl && newFile !== existingFileUrl) {
            const existingFilePath = existingFileUrl.replace(`https://storage.googleapis.com/${this.bucketName}/`, '');
            const file = this.storage.bucket(this.bucketName).file(existingFilePath);
            try {
                await file.delete();
                console.log(`Deleted old file: ${existingFilePath}`);
            }
            catch (error) {
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
    async uploadFileToGCS(file, folder) {
        let url = null;
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
    async createEstimateDetails(dto, estimatePdf, invoicePath) {
        try {
            const client = await this.clientRepository.findOne({
                where: { clientId: dto.clientId },
            });
            if (!client) {
                return new common_response_1.CommonResponse(false, 400, `Client with ID ${dto.clientId} not found`);
            }
            const productDetailsArray = typeof dto.productDetails === "string"
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
            newEstimate.estimateId = `EST-${(await this.estimateRepository.count() + 1).toString().padStart(4, '0')}`;
            if (dto.convertToInvoice) {
                newEstimate.invoiceId = this.generateInvoiceId(await this.getInvoiceCount(newEstimate.id));
                if (invoicePath) {
                    newEstimate.invoicePdfUrl = await this.handleFileUpload(invoicePath, newEstimate.invoicePdfUrl, 'invoices_pdfs');
                }
            }
            newEstimate.CGST = (totalAmount * (dto.cgstPercentage || 0)) / 100 || 0;
            newEstimate.SCST = (totalAmount * (dto.scstPercentage || 0)) / 100 || 0;
            if (estimatePdf) {
                newEstimate.estimatePdfUrl = await this.handleFileUpload(estimatePdf, newEstimate.estimatePdfUrl, 'estimate_pdfs');
                dto.estimatePdfUrl = newEstimate.estimatePdfUrl;
            }
            console.log(newEstimate, "___________");
            await this.estimateRepository.insert(newEstimate);
            return new common_response_1.CommonResponse(true, 201, 'Estimate details created successfully');
        }
        catch (error) {
            console.error(`Error creating estimate details: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(500, `Failed to create estimate details: ${error.message}`);
        }
    }
    async uploadAndHandleEstimateDetails(dto, files) {
        try {
            let estimatePath = null;
            let invoicePath = null;
            if (files?.estimatePdf?.length) {
                estimatePath = await this.uploadFileToGCS(files.estimatePdf[0], 'estimate_Pdfs');
            }
            if (files?.invoicePDF?.length) {
                invoicePath = await this.uploadFileToGCS(files.invoicePDF[0], 'invoice_Pdfs');
            }
            return (dto.id && dto.id !== null) || (dto.estimateId && dto.estimateId.trim() !== '')
                ? await this.updateEstimateDetails(dto, estimatePath, invoicePath)
                : await this.createEstimateDetails(dto, estimatePath, invoicePath);
        }
        catch (error) {
            console.error('Error in uploadAndHandleEstimateDetails:', error);
            return new common_response_1.CommonResponse(false, 500, 'Error processing estimate details');
        }
    }
    async getInvoiceCount(id) {
        return this.estimateRepository.count({ where: { id: id, invoiceId: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) } });
    }
    generateInvoiceId(sequenceNumber) {
        const paddedNumber = sequenceNumber.toString().padStart(4, '0');
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        return `INV-${paddedNumber}-${timestamp}`;
    }
    async deleteEstimateDetails(dto) {
        try {
            const client = await this.estimateRepository.findOne({
                where: {
                    estimateId: String(dto.estimateId),
                    companyCode: dto.companyCode,
                    unitCode: dto.unitCode
                }
            });
            if (!client) {
                return new common_response_1.CommonResponse(false, 404, 'estimateId not found');
            }
            await this.estimateRepository.delete({ estimateId: String(dto.estimateId) });
            return new common_response_1.CommonResponse(true, 200, 'estimateId details deleted successfully');
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getEstimateDetails(req) {
        try {
            const estimate = await this.estimateRepository.findOne({
                relations: ['clientId', 'products', 'vendorId'],
                where: { estimateId: req.estimateId, companyCode: req.companyCode, unitCode: req.unitCode }
            });
            if (!estimate) {
                return new common_response_1.CommonResponse(false, 404, 'Estimate not found');
            }
            console.log(estimate, "<<< Raw Estimate Data");
            const data = this.estimateAdapter.convertEntityToResDto([estimate]);
            console.log(data, "<<< Converted DTO Data");
            return new common_response_1.CommonResponse(true, 200, 'Estimate details fetched successfully', data);
        }
        catch (error) {
            console.error('Error fetching estimate details:', error);
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getAllEstimateDetails(req) {
        try {
            const estimate = await this.estimateRepository.find({
                relations: ['clientId', 'products', 'vendorId'],
                where: { companyCode: req.companyCode, unitCode: req.unitCode }
            });
            if (!estimate) {
                return new common_response_1.CommonResponse(false, 404, 'Estimate not found');
            }
            console.log(estimate, "<<< Raw Estimate Data");
            const data = this.estimateAdapter.convertEntityToResDto(estimate);
            console.log(data, "<<< Converted DTO Data");
            return new common_response_1.CommonResponse(true, 200, 'Estimate details fetched successfully', data);
        }
        catch (error) {
            console.error('Error fetching estimate details:', error);
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
};
exports.EstimateService = EstimateService;
exports.EstimateService = EstimateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [estimate_adapter_1.EstimateAdapter,
        estimate_repo_1.EstimateRepository,
        client_repo_1.ClientRepository,
        product_repo_1.ProductRepository,
        typeorm_2.DataSource])
], EstimateService);
//# sourceMappingURL=estimate.service.js.map