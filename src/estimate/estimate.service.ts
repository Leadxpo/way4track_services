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

@Injectable()
export class EstimateService {
    constructor(
        private readonly estimateAdapter: EstimateAdapter,
        private readonly estimateRepository: EstimateRepository,
        private readonly clientRepository: ClientRepository,
        private readonly productRepository: ProductRepository
    ) { }

    async updateEstimateDetails(dto: EstimateDto): Promise<CommonResponse> {
        try {
            const existingEstimate = await this.estimateRepository.findOne({
                where: { id: dto.id },
                relations: ['productDetails'],
            });

            if (!existingEstimate) {
                return new CommonResponse(false, 404, `Estimate with ID ${dto.id} not found`);
            }

            const client = await this.clientRepository.findOne({ where: { id: dto.clientId } });
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
                };
            });

            // Update the estimate entity
            Object.assign(existingEstimate, this.estimateAdapter.convertDtoToEntity(dto));
            existingEstimate.clientId = client;
            existingEstimate.productDetails = productDetails;

            // Calculate total amount
            const totalAmount = productDetails.reduce((sum, product) => sum + product.totalCost, 0);
            existingEstimate.amount = totalAmount;

            // Generate Invoice ID if converting to invoice
            if (dto.convertToInvoice) {
                existingEstimate.invoiceId = this.generateInvoiceId(await this.getInvoiceCount(client));
                existingEstimate.CGST = (totalAmount * dto.cgstPercentage) / 100;
                existingEstimate.SCST = (totalAmount * dto.scstPercentage) / 100;
            }

            await this.estimateRepository.save(existingEstimate);

            return new CommonResponse(true, 200, 'Estimate details updated successfully');
        } catch (error) {
            console.error(`Error updating estimate details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to update estimate details: ${error.message}`);
        }
    }

    async createEstimateDetails(dto: EstimateDto): Promise<CommonResponse> {
        try {
            const client = await this.clientRepository.findOne({
                where: { id: dto.clientId },
            });

            if (!client) {
                return new CommonResponse(false, 400, `Client with ID ${dto.clientId} not found`);
            }

            // Fetch products and calculate total costs
            const productDetails = await Promise.all(
                dto.productDetails.map(async (productDetail) => {
                    const product = await this.productRepository.findOne({
                        where: { id: productDetail.productId },  // Ensure using correct property
                    });

                    if (!product) {
                        throw new Error(`Product with ID ${productDetail.productId} not found`);
                    }

                    const totalCost = product.price * productDetail.quantity;

                    // Return the product detail in the required format
                    return {
                        productId: product.id,
                        productName: product.productName,
                        quantity: productDetail.quantity,
                        costPerUnit: product.price,
                        totalCost: totalCost,
                    };
                })
            );
            // Ensure the productDetails are correctly associated



            const newEstimate = this.estimateAdapter.convertDtoToEntity(dto);
            newEstimate.clientId = client;
            // newEstimate.productDetails = productDetails;
            newEstimate.productDetails = productDetails.map((prodDetail) => ({
                ...prodDetail,  // spread to ensure each product is saved individually
                estimate: newEstimate, // associate each product with the estimate
            }));
            // Calculate total amount
            const totalAmount = productDetails.reduce((sum, product) => sum + product.totalCost, 0);
            newEstimate.amount = totalAmount;

            // Generate Estimate ID
            const estimateCount = await this.estimateRepository.count({
                where: { clientId: client },
            });
            newEstimate.estimateId = this.generateEstimateId(estimateCount + 1);

            await this.estimateRepository.save(newEstimate);

            return new CommonResponse(true, 201, 'Estimate details created successfully');
        } catch (error) {
            console.error(`Error creating estimate details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to create estimate details: ${error.message}`);
        }
    }

    private async getInvoiceCount(client: ClientEntity): Promise<number> {
        return this.estimateRepository.count({ where: { clientId: client, invoiceId: Not(IsNull()) } });
    }

    async handleEstimateDetails(dto: EstimateDto): Promise<CommonResponse> {
        if (dto.id || dto.estimateId) {
            // If an ID is provided, update the estimate details
            return await this.updateEstimateDetails(dto);
        } else {
            // If no ID is provided, create a new estimate record
            return await this.createEstimateDetails(dto);
        }
    }

    private generateEstimateId(sequenceNumber: number): string {
        const paddedNumber = sequenceNumber.toString().padStart(4, '0');
        return `EST-${paddedNumber}`;
    }

    private generateInvoiceId(sequenceNumber: number): string {
        const paddedNumber = sequenceNumber.toString().padStart(4, '0');
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        return `INV-${paddedNumber}-${timestamp}`;
    }

    async deleteEstimateDetails(dto: EstimateIdDto): Promise<CommonResponse> {
        try {
            const estimate = await this.estimateRepository.findOne({ where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode } });
            if (!estimate) {
                return new CommonResponse(false, 404, 'Estimate not found');
            }

            await this.estimateRepository.delete(dto.id);
            return new CommonResponse(true, 200, 'Estimate details deleted successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getEstimateDetails(req: EstimateIdDto): Promise<CommonResponse> {
        try {
            const estimate = await this.estimateRepository.findOne({
                relations: ['clientId'],
                where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode }
            });

            if (!estimate) {
                return new CommonResponse(false, 404, 'Estimate not found');
            }

            const data: EstimateResDto = this.estimateAdapter.convertEntityToResDto(estimate);
            return new CommonResponse(true, 200, 'Estimate details fetched successfully', data);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }
}
