import { Injectable } from '@nestjs/common';
import { ProductAssignDto } from './dto/product-assign.dto';
import { CommonResponse } from 'src/models/common-response';
import { ProductAssignAdapter } from './product-assign.adapter';
import { ProductAssignRepository } from './repo/product-assign.repo';
import { ErrorResponse } from 'src/models/error-response';
import { ProductAssignIdDto } from './dto/product-assign-id.dto';
import { ProductAssignResDto } from './dto/product-assign-res.dto';
import { ProductAssignEntity } from './entity/product-assign.entity';
import { join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class ProductAssignService {
    constructor(
        private readonly productAssignRepository: ProductAssignRepository,
        private readonly productAssignAdapter: ProductAssignAdapter,
    ) { }


    async saveProductAssign(dto: ProductAssignDto, photoPath: string | null): Promise<CommonResponse> {
        try {
            const entity = this.productAssignAdapter.convertDtoToEntity(dto);

            if (photoPath) {
                entity.productAssignPhoto = photoPath;
            }
            await this.productAssignRepository.insert(entity);
            return new CommonResponse(true, 201, 'Product details created successfully');
        } catch (error) {
            console.error(`Error creating Product details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to create Product details: ${error.message}`);
        }
    }

    async updateProductAssign(dto: ProductAssignDto, photoPath: string | null): Promise<CommonResponse> {
        try {
            const existingProduct = await this.productAssignRepository.findOne({ where: { id: dto.id } });
            if (!existingProduct) {
                throw new Error('Product not found');
            }

            const entity = this.productAssignAdapter.convertDtoToEntity(dto);

            // Merge existing Product details with new data
            const updatedProduct = {
                ...existingProduct,
                ...entity,
                productAssignPhoto: photoPath || existingProduct.productAssignPhoto,
            };

            await this.productAssignRepository.save(updatedProduct);

            return new CommonResponse(true, 200, 'Product details updated successfully');
        } catch (error) {
            console.error(`Error updating Product details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to update Product details: ${error.message}`);
        }
    }
    async handleProductDetails(dto: ProductAssignDto, file?: Express.Multer.File): Promise<CommonResponse> {
        try {
            let photoPath: string | null = null;

            // Handle photo upload
            if (file) {
                photoPath = await this.uploadproductAssignPhoto(file);
            }

            if (dto.id) {
                // If ID exists, validate it before updating
                const existingProduct = await this.productAssignRepository.findOne({ where: { id: dto.id } });
                if (!existingProduct) {
                    throw new ErrorResponse(404, `Product with ID ${dto.id} not found`);
                }
                return await this.updateProductAssign(dto, photoPath);
            } else {
                // Create a new Product
                return await this.saveProductAssign(dto, photoPath);
            }
        } catch (error) {
            console.error(`Error handling Product details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to handle Product details: ${error.message}`);
        }
    }

    async getProductAssign(dto: ProductAssignIdDto): Promise<CommonResponse> {
        try {
            const productAssign = await this.productAssignRepository.findOne({
                where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode },
                relations: ['branchId', 'staffId', 'productId'],
            });

            if (!productAssign) {
                throw new Error('Product assignment not found');
            }

            // const responseDto = new ProductAssignResDto(
            //     productAssign.id,
            //     productAssign.staffId.id.toString(),
            //     productAssign.staffId.name,
            //     productAssign.branchId.id,
            //     productAssign.branchId.branchName,
            //     productAssign.productId.productName,
            //     productAssign.productId.categoryName,
            //     productAssign.imeiNumberFrom,
            //     productAssign.imeiNumberTo,
            //     productAssign.numberOfProducts,
            //     productAssign.productAssignPhoto,
            //     productAssign.companyCode,
            //     productAssign.unitCode
            // );

            return new CommonResponse(true, 200, 'Product assignment fetched successfully', productAssign);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async deleteProductAssign(dto: ProductAssignIdDto): Promise<CommonResponse> {
        try {
            const productAssign = await this.productAssignRepository.findOne({ where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode } });
            if (!productAssign) {
                throw new Error('Product assignment not found');
            }
            await this.productAssignRepository.remove(productAssign);
            return new CommonResponse(true, 200, 'Product assignment deleted successfully');
        } catch (error) {
            console.error('Error in delete product assignment', error);
            throw new Error('Error deleting product assignment');
        }
    }

    async assignProduct(assignData: any): Promise<ProductAssignEntity> {
        const { productId, staffId, assignedQty, productType, assignTo, companyCode, unitCode } = assignData;

        const productAssign = await this.productAssignRepository.findOne({ where: { productId } });

        if (!productAssign) {
            throw new Error('Product assignment not found');
        }
        if (productAssign.numberOfProducts < assignedQty) {
            throw new Error('Not enough products to assign');
        }
        productAssign.isAssign = true;
        productAssign.assignedQty = assignedQty;
        productAssign.companyCode = companyCode;
        productAssign.unitCode = unitCode;
        productAssign.assignTime = new Date();
        productAssign.assignTo = assignTo;
        productAssign.productType = productType;
        productAssign.inHands = false;
        productAssign.numberOfProducts -= assignedQty;
        await this.productAssignRepository.save(productAssign);

        return productAssign;
    }

    async markInHands(productAssignId: number, companyCode: string, unitCode: string): Promise<ProductAssignEntity> {
        const productAssign = await this.productAssignRepository.findOne({ where: { id: productAssignId, companyCode: companyCode, unitCode: unitCode } });

        if (!productAssign) {
            throw new Error('Product assignment not found');
        }

        productAssign.inHands = true;
        await this.productAssignRepository.save(productAssign);

        return productAssign;
    }

    async uploadproductAssignPhoto(photo: Express.Multer.File): Promise<string> {
        try {
            const filePath = join(__dirname, '../../uploads/productAssign_photos', `$${Date.now()}.jpg`);
            await fs.writeFile(filePath, photo.fieldname);
            return filePath
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }


}



