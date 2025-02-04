import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { BranchRepository } from 'src/branch/repo/branch.repo';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { ProductEntity } from 'src/product/entity/product.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { DataSource } from 'typeorm';
import { ProductAssignIdDto } from './dto/product-assign-id.dto';
import { ProductAssignDto } from './dto/product-assign.dto';
import { ProductAssignAdapter } from './product-assign.adapter';
import { ProductAssignRepository } from './repo/product-assign.repo';
import { CommonReq } from 'src/models/common-req';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class ProductAssignService {
    private storage: Storage;
    private bucketName: string;
    constructor(
        private readonly productAssignRepository: ProductAssignRepository,
        private readonly productAssignAdapter: ProductAssignAdapter,
        private readonly branchRepo: BranchRepository,
        private dataSource: DataSource
    ) {
        this.storage = new Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });

        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }


    async assignProductsByImei(
        imeiNumberFrom: string,
        imeiNumberTo: string,
        branchId?: number,
        staffId?: number
    ): Promise<void> {
        const imeiFrom = parseInt(imeiNumberFrom, 10);
        const imeiTo = parseInt(imeiNumberTo, 10);

        if (isNaN(imeiFrom) || isNaN(imeiTo) || imeiFrom > imeiTo) {
            throw new Error(`Invalid IMEI range: ${imeiNumberFrom} - ${imeiNumberTo}`);
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();

        try {
            const products = await queryRunner.manager
                .getRepository(ProductEntity)
                .createQueryBuilder("product")
                .where("CAST(product.imei_number AS UNSIGNED) BETWEEN :imeiFrom AND :imeiTo", { imeiFrom, imeiTo })
                .getMany();

            if (!products.length) {
                throw new Error(`No products found in the IMEI range: ${imeiNumberFrom} - ${imeiNumberTo}`);
            }

            let status = "not_assigned";
            let location = "warehouse";

            if (branchId) {
                const branch = await queryRunner.manager.findOne(BranchEntity, { where: { id: branchId } });
                if (branch) {
                    location = branch.branchName;
                    status = "isAssign";
                }
            } else if (staffId) {
                const staff = await queryRunner.manager.findOne(StaffEntity, { where: { id: staffId } });
                if (staff) {
                    location = staff.name;
                    status = "inHand";
                }
            }

            // Bulk update products
            await queryRunner.manager
                .createQueryBuilder()
                .update(ProductEntity)
                .set({ status, location })
                .where("CAST(imei_number AS UNSIGNED) BETWEEN :imeiFrom AND :imeiTo", { imeiFrom, imeiTo })
                .execute();

            await queryRunner.commitTransaction();

            console.log(`Updated ${products.length} products successfully.`);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error("Error assigning products:", error);
            throw new Error(`Failed to assign products: ${error.message}`);
        } finally {
            await queryRunner.release();
        }
    }

    async saveProductAssign(dto: ProductAssignDto, photoPath: string | null): Promise<CommonResponse> {
        try {
            const entity = this.productAssignAdapter.convertDtoToEntity(dto);

            if (photoPath) {
                entity.productAssignPhoto = photoPath;
            }

            await this.productAssignRepository.insert(entity);

            await this.assignProductsByImei(
                dto.imeiNumberFrom,
                dto.imeiNumberTo,
                dto.branchId,
                dto.staffId
            );

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
            if (photoPath && existingProduct.productAssignPhoto) {
                const existingFilePath = existingProduct.productAssignPhoto.replace(`https://storage.googleapis.com/${this.bucketName}/`, '');
                const file = this.storage.bucket(this.bucketName).file(existingFilePath);

                try {
                    await file.delete();
                    console.log(`Deleted old file from GCS: ${existingFilePath}`);
                } catch (error) {
                    console.error(`Error deleting old file from GCS: ${error.message}`);
                }
            }
            // Convert DTO to entity
            const entity = this.productAssignAdapter.convertDtoToEntity(dto);

            // Update the existing product details with new values, including the photo if provided
            const updatedProduct = {
                ...existingProduct,
                ...entity,
                productAssignPhoto: photoPath || existingProduct.productAssignPhoto,
            };

            // Check for changes in IMEI range and update status/location accordingly
            const imeiFrom = parseInt(dto.imeiNumberFrom, 10);
            const imeiTo = parseInt(dto.imeiNumberTo, 10);

            if (isNaN(imeiFrom) || isNaN(imeiTo) || imeiFrom > imeiTo) {
                throw new Error(`Invalid IMEI range: ${dto.imeiNumberFrom} - ${dto.imeiNumberTo}`);
            }

            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.startTransaction();

            try {
                // Fetch the current products that are assigned in the given range
                const currentProducts = await queryRunner.manager
                    .getRepository(ProductEntity)
                    .createQueryBuilder("product")
                    .where("CAST(product.imei_number AS UNSIGNED) BETWEEN :imeiFrom AND :imeiTo", { imeiFrom, imeiTo })
                    .getMany();

                // Handle product status updates for removal or reassignment
                if (currentProducts.length) {
                    const productIds = currentProducts.map(p => p.id);

                    // Mark products as removed (or any other status) if not part of the new IMEI range
                    await queryRunner.manager
                        .createQueryBuilder()
                        .update(ProductEntity)
                        .set({ status: "not_assigned", location: "warehouse" })
                        .where("product.id IN (:...productIds)", { productIds })
                        .execute();
                }

                // Handle new products being added to the IMEI range
                await queryRunner.manager
                    .createQueryBuilder()
                    .update(ProductEntity)
                    .set({ status: "isAssign", location: "warehouse" }) // Change this depending on the status and location
                    .where("CAST(imei_number AS UNSIGNED) BETWEEN :imeiFrom AND :imeiTo", { imeiFrom, imeiTo })
                    .execute();

                await queryRunner.commitTransaction();

                console.log(`Updated product assignments successfully.`);
            } catch (error) {
                await queryRunner.rollbackTransaction();
                console.error("Error handling product assignment:", error);
                throw new Error(`Failed to handle product assignment: ${error.message}`);
            } finally {
                await queryRunner.release();
            }

            await this.productAssignRepository.save(updatedProduct);
            return new CommonResponse(true, 200, 'Product details updated successfully');
        } catch (error) {
            console.error(`Error updating Product details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to update Product details: ${error.message}`);
        }
    }


    async handleProductDetails(dto: ProductAssignDto, photo?: Express.Multer.File): Promise<CommonResponse> {
        try {
            let photoPath: string | null = null;
            if (photo) {
                const bucket = this.storage.bucket(this.bucketName);
                const uniqueFileName = `productAssign_photos/${Date.now()}-${photo.originalname}`;
                const file = bucket.file(uniqueFileName);

                await file.save(photo.buffer, {
                    contentType: photo.mimetype,
                    resumable: false,
                });

                console.log(`File uploaded to GCS: ${uniqueFileName}`);
                photoPath = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
            }
            // Handle photo upload


            if (dto.id && dto.id !== null) {
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
                relations: ['branchId', 'staffId', 'productId', 'requestId'],  // Ensure `requestId` is loaded
            });

            if (!productAssign) {
                throw new Error('Product assignment not found');
            }

            // Make sure that request is assigned from the RequestRaiseEntity
            // const request = productAssign.requestId ? productAssign.requestId.description : '';

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
            //     productAssign.unitCode,
            //     productAssign.requestId?.id,  // Ensure requestId is included if available
            //     request  // Assign the request name
            // );

            return new CommonResponse(true, 200, 'Product assignment fetched successfully', productAssign);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getAllProductAssign(dto: CommonReq): Promise<CommonResponse> {
        try {
            const productAssign = await this.productAssignRepository.find({
                where: { companyCode: dto.companyCode, unitCode: dto.unitCode },
                relations: ['branchId', 'staffId', 'productId', 'requestId'],  // Ensure `requestId` is loaded
            });

            if (!productAssign) {
                throw new Error('Product assignment not found');
            }
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



}



