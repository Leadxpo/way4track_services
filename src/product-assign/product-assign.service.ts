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

    async saveProductAssign(dto: ProductAssignDto): Promise<CommonResponse> {
        try {
            const internalMessage = dto.id
                ? 'Product assignment updated successfully'
                : 'Product assignment created successfully';

            const entity = this.productAssignAdapter.convertDtoToEntity(dto);
            await this.productAssignRepository.save(entity);

            return new CommonResponse(true, 200, internalMessage);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
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

            const responseDto = new ProductAssignResDto(
                productAssign.id,
                productAssign.staffId.id.toString(),
                productAssign.staffId.name,
                productAssign.branchId.id,
                productAssign.branchId.branchName,
                productAssign.productId.productName,
                productAssign.productId.categoryName,
                productAssign.imeiNumberFrom,
                productAssign.imeiNumberTo,
                productAssign.numberOfProducts,
                productAssign.productAssignPhoto,
                productAssign.companyCode,
                productAssign.unitCode
            );

            return new CommonResponse(true, 200, 'Product assignment fetched successfully', responseDto);
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

    async uploadproductAssignPhoto(productAssignId: number, photo: Express.Multer.File): Promise<CommonResponse> {
        try {
            const productAssign = await this.productAssignRepository.findOne({ where: { id: productAssignId } });

            if (!productAssign) {
                return new CommonResponse(false, 404, 'productAssign not found');
            }

            const filePath = join(__dirname, '../../uploads/productAssign_photos', `${productAssignId}-${Date.now()}.jpg`);
            await fs.writeFile(filePath, photo.buffer);

            productAssign.productAssignPhoto = filePath;
            await this.productAssignRepository.save(productAssign);

            return new CommonResponse(true, 200, 'Photo uploaded successfully', { photoPath: filePath });
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }
}



