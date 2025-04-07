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
import { SubDealerRepository } from 'src/sub-dealer/repo/sub-dealer.repo';
import { SubDealerEntity } from 'src/sub-dealer/entity/sub-dealer.entity';

@Injectable()
export class ProductAssignService {
    private storage: Storage;
    private bucketName: string;
    constructor(
        private readonly productAssignRepository: ProductAssignRepository,
        private readonly productAssignAdapter: ProductAssignAdapter,
        private readonly branchRepo: BranchRepository,
        private dataSource: DataSource,
        private subRepo: SubDealerRepository
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
        staffId?: number,
        numberOfProducts?: number,
        simNumberFrom?: string,
        simNumberTo?: string,
        subDealerId?: number
    ): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();

        try {
            // Determine status and location
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
                } else if (subDealerId) {
                    const sub = await queryRunner.manager.findOne(SubDealerEntity, { where: { id: subDealerId } })
                    if (sub) {
                        location = sub.subDealerId;
                        status = 'isAssign'
                    }
                }
            }

            let imeiUpdateResult, simUpdateResult;

            // IMEI logic
            if (imeiNumberFrom) {
                const imeiFrom = parseInt(imeiNumberFrom, 10);
                const imeiTo = imeiNumberTo ? parseInt(imeiNumberTo, 10) : imeiFrom;

                if (isNaN(imeiFrom) || isNaN(imeiTo) || imeiFrom > imeiTo) {
                    throw new Error(`Invalid IMEI range: ${imeiNumberFrom} - ${imeiNumberTo}`);
                }

                imeiUpdateResult = await queryRunner.manager
                    .createQueryBuilder()
                    .update(ProductEntity)
                    .set({ status, location })
                    .where("CAST(imei_number AS UNSIGNED) BETWEEN :imeiFrom AND :imeiTo", { imeiFrom, imeiTo })
                    .execute();
            }

            // SIM logic
            if (simNumberFrom) {
                const simFrom = parseInt(simNumberFrom, 10);
                const simTo = simNumberTo ? parseInt(simNumberTo, 10) : simFrom;

                if (isNaN(simFrom) || isNaN(simTo) || simFrom > simTo) {
                    throw new Error(`Invalid SIM range: ${simNumberFrom} - ${simNumberTo}`);
                }

                simUpdateResult = await queryRunner.manager
                    .createQueryBuilder()
                    .update(ProductEntity)
                    .set({ status, location })
                    .where("CAST(sim_no AS UNSIGNED) BETWEEN :simFrom AND :simTo", { simFrom, simTo })
                    .execute();
            }

            await queryRunner.commitTransaction();

            const updatedCount = (imeiUpdateResult?.affected || 0) + (simUpdateResult?.affected || 0);
            console.log(`✅ Assigned ${updatedCount} product(s) successfully.`);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error("❌ Error assigning products:", error);
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
            console.log(entity, "??????????????")
            await this.productAssignRepository.insert(entity);

            await this.assignProductsByImei(
                dto.imeiNumberFrom,
                dto.imeiNumberTo,
                dto.branchId,
                dto.staffId,
                dto.numberOfProducts,
                dto.simNumberFrom,
                dto.simNumberTo
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

            // Handle GCS photo deletion
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

            // Convert DTO to entity and update with photo if any
            const entity = this.productAssignAdapter.convertDtoToEntity(dto);
            const updatedProduct = {
                ...existingProduct,
                ...entity,
                productAssignPhoto: photoPath || existingProduct.productAssignPhoto,
            };

            const imeiFrom = parseInt(dto.imeiNumberFrom, 10);
            const imeiTo = parseInt(dto.imeiNumberTo, 10) || imeiFrom;

            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.startTransaction();

            try {
                // Determine status and location from dto
                let status = "not_assigned";
                let location = "warehouse";

                if (dto.branchId) {
                    const branch = await queryRunner.manager.findOne(BranchEntity, { where: { id: dto.branchId } });
                    if (branch) {
                        location = branch.branchName;
                        status = "isAssign";
                    }
                } else if (dto.staffId) {
                    const staff = await queryRunner.manager.findOne(StaffEntity, { where: { id: dto.staffId } });
                    if (staff) {
                        location = staff.name;
                        status = "inHand";
                    }
                } else if (dto.subDealerId) {
                    const sub = await queryRunner.manager.findOne(SubDealerEntity, { where: { id: dto.subDealerId } });
                    if (sub) {
                        location = sub.subDealerId;
                        status = "isAssign";
                    }
                }

                // Update IMEI range
                await queryRunner.manager
                    .createQueryBuilder()
                    .update(ProductEntity)
                    .set({ status, location })
                    .where("CAST(imei_number AS UNSIGNED) BETWEEN :imeiFrom AND :imeiTo", { imeiFrom, imeiTo })
                    .execute();

                // Update SIM range if provided
                if (dto.simNumberFrom) {
                    const simFrom = parseInt(dto.simNumberFrom, 10);
                    const simTo = dto.simNumberTo ? parseInt(dto.simNumberTo, 10) : simFrom;

                    await queryRunner.manager
                        .createQueryBuilder()
                        .update(ProductEntity)
                        .set({ status, location })
                        .where("CAST(sim_no AS UNSIGNED) BETWEEN :simFrom AND :simTo", { simFrom, simTo })
                        .execute();
                }

                await this.productAssignRepository.save(updatedProduct);
                await queryRunner.commitTransaction();

                console.log(`✅ Product assignment updated successfully.`);
                return new CommonResponse(true, 200, 'Product details updated successfully');
            } catch (error) {
                await queryRunner.rollbackTransaction();
                console.error("❌ Error updating product assignment:", error);
                throw new Error(`Failed to update Product assignment: ${error.message}`);
            } finally {
                await queryRunner.release();
            }
        } catch (error) {
            console.error(`❌ Error updating Product details: ${error.message}`, error.stack);
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
            // const existingProduct = await this.productAssignRepository.findOne({ where: { id: dto.id } });
            if (dto.id) {
                console.log(dto, "<<<<")
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



