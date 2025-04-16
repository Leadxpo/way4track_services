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
exports.ProductAssignService = void 0;
const common_1 = require("@nestjs/common");
const branch_entity_1 = require("../branch/entity/branch.entity");
const branch_repo_1 = require("../branch/repo/branch.repo");
const common_response_1 = require("../models/common-response");
const error_response_1 = require("../models/error-response");
const product_entity_1 = require("../product/entity/product.entity");
const staff_entity_1 = require("../staff/entity/staff.entity");
const typeorm_1 = require("typeorm");
const product_assign_adapter_1 = require("./product-assign.adapter");
const product_assign_repo_1 = require("./repo/product-assign.repo");
const storage_1 = require("@google-cloud/storage");
const sub_dealer_repo_1 = require("../sub-dealer/repo/sub-dealer.repo");
const sub_dealer_entity_1 = require("../sub-dealer/entity/sub-dealer.entity");
let ProductAssignService = class ProductAssignService {
    constructor(productAssignRepository, productAssignAdapter, branchRepo, dataSource, subRepo) {
        this.productAssignRepository = productAssignRepository;
        this.productAssignAdapter = productAssignAdapter;
        this.branchRepo = branchRepo;
        this.dataSource = dataSource;
        this.subRepo = subRepo;
        this.storage = new storage_1.Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });
        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }
    async assignProductsByImei(imeiNumberFrom, imeiNumberTo, branchId, staffId, numberOfProducts, simNumberFrom, simNumberTo, subDealerId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            let status = "not_assigned";
            let location = "warehouse";
            if (branchId) {
                const branch = await queryRunner.manager.findOne(branch_entity_1.BranchEntity, { where: { id: branchId } });
                if (branch) {
                    location = branch.branchName;
                    status = "isAssign";
                }
            }
            else if (staffId) {
                const staff = await queryRunner.manager.findOne(staff_entity_1.StaffEntity, { where: { id: staffId } });
                if (staff) {
                    location = staff.name;
                    status = "inHand";
                }
                else if (subDealerId) {
                    const sub = await queryRunner.manager.findOne(sub_dealer_entity_1.SubDealerEntity, { where: { id: subDealerId } });
                    if (sub) {
                        location = sub.subDealerId;
                        status = 'isAssign';
                    }
                }
            }
            let imeiUpdateResult, simUpdateResult;
            if (imeiNumberFrom) {
                const imeiFrom = parseInt(imeiNumberFrom, 10);
                const imeiTo = imeiNumberTo ? parseInt(imeiNumberTo, 10) : imeiFrom;
                if (isNaN(imeiFrom) || isNaN(imeiTo) || imeiFrom > imeiTo) {
                    throw new Error(`Invalid IMEI range: ${imeiNumberFrom} - ${imeiNumberTo}`);
                }
                imeiUpdateResult = await queryRunner.manager
                    .createQueryBuilder()
                    .update(product_entity_1.ProductEntity)
                    .set({ status, location })
                    .where("CAST(imei_number AS UNSIGNED) BETWEEN :imeiFrom AND :imeiTo", { imeiFrom, imeiTo })
                    .execute();
            }
            if (simNumberFrom) {
                const simFrom = parseInt(simNumberFrom, 10);
                const simTo = simNumberTo ? parseInt(simNumberTo, 10) : simFrom;
                if (isNaN(simFrom) || isNaN(simTo) || simFrom > simTo) {
                    throw new Error(`Invalid SIM range: ${simNumberFrom} - ${simNumberTo}`);
                }
                simUpdateResult = await queryRunner.manager
                    .createQueryBuilder()
                    .update(product_entity_1.ProductEntity)
                    .set({ status, location })
                    .where("CAST(sim_no AS UNSIGNED) BETWEEN :simFrom AND :simTo", { simFrom, simTo })
                    .execute();
            }
            await queryRunner.commitTransaction();
            const updatedCount = (imeiUpdateResult?.affected || 0) + (simUpdateResult?.affected || 0);
            console.log(`✅ Assigned ${updatedCount} product(s) successfully.`);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error("❌ Error assigning products:", error);
            throw new Error(`Failed to assign products: ${error.message}`);
        }
        finally {
            await queryRunner.release();
        }
    }
    async saveProductAssign(dto, photoPath) {
        try {
            const entity = this.productAssignAdapter.convertDtoToEntity(dto);
            if (photoPath) {
                entity.productAssignPhoto = photoPath;
            }
            console.log(entity, "??????????????");
            await this.productAssignRepository.insert(entity);
            await this.assignProductsByImei(dto.imeiNumberFrom, dto.imeiNumberTo, dto.branchId, dto.staffId, dto.numberOfProducts, dto.simNumberFrom, dto.simNumberTo);
            return new common_response_1.CommonResponse(true, 201, 'Product details created successfully');
        }
        catch (error) {
            console.error(`Error creating Product details: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(500, `Failed to create Product details: ${error.message}`);
        }
    }
    async updateProductAssign(dto, photoPath) {
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
                }
                catch (error) {
                    console.error(`Error deleting old file from GCS: ${error.message}`);
                }
            }
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
                let status = "not_assigned";
                let location = "warehouse";
                if (dto.branchId) {
                    const branch = await queryRunner.manager.findOne(branch_entity_1.BranchEntity, { where: { id: dto.branchId } });
                    if (branch) {
                        location = branch.branchName;
                        status = "isAssign";
                    }
                }
                else if (dto.staffId) {
                    const staff = await queryRunner.manager.findOne(staff_entity_1.StaffEntity, { where: { id: dto.staffId } });
                    if (staff) {
                        location = staff.name;
                        status = "inHand";
                    }
                }
                else if (dto.subDealerId) {
                    const sub = await queryRunner.manager.findOne(sub_dealer_entity_1.SubDealerEntity, { where: { id: dto.subDealerId } });
                    if (sub) {
                        location = sub.subDealerId;
                        status = "isAssign";
                    }
                }
                await queryRunner.manager
                    .createQueryBuilder()
                    .update(product_entity_1.ProductEntity)
                    .set({ status, location })
                    .where("CAST(imei_number AS UNSIGNED) BETWEEN :imeiFrom AND :imeiTo", { imeiFrom, imeiTo })
                    .execute();
                if (dto.simNumberFrom) {
                    const simFrom = parseInt(dto.simNumberFrom, 10);
                    const simTo = dto.simNumberTo ? parseInt(dto.simNumberTo, 10) : simFrom;
                    await queryRunner.manager
                        .createQueryBuilder()
                        .update(product_entity_1.ProductEntity)
                        .set({ status, location })
                        .where("CAST(sim_no AS UNSIGNED) BETWEEN :simFrom AND :simTo", { simFrom, simTo })
                        .execute();
                }
                await this.productAssignRepository.save(updatedProduct);
                await queryRunner.commitTransaction();
                console.log(`✅ Product assignment updated successfully.`);
                return new common_response_1.CommonResponse(true, 200, 'Product details updated successfully');
            }
            catch (error) {
                await queryRunner.rollbackTransaction();
                console.error("❌ Error updating product assignment:", error);
                throw new Error(`Failed to update Product assignment: ${error.message}`);
            }
            finally {
                await queryRunner.release();
            }
        }
        catch (error) {
            console.error(`❌ Error updating Product details: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(500, `Failed to update Product details: ${error.message}`);
        }
    }
    async handleProductDetails(dto, photo) {
        try {
            let photoPath = null;
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
            if (dto.id) {
                console.log(dto, "<<<<");
                return await this.updateProductAssign(dto, photoPath);
            }
            else {
                return await this.saveProductAssign(dto, photoPath);
            }
        }
        catch (error) {
            console.error(`Error handling Product details: ${error.message}`, error.stack);
            throw new error_response_1.ErrorResponse(500, `Failed to handle Product details: ${error.message}`);
        }
    }
    async getProductAssign(dto) {
        try {
            const productAssign = await this.productAssignRepository.findOne({
                where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode },
                relations: ['branchId', 'staffId', 'productId', 'requestId'],
            });
            if (!productAssign) {
                throw new Error('Product assignment not found');
            }
            return new common_response_1.CommonResponse(true, 200, 'Product assignment fetched successfully', productAssign);
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async getAllProductAssign(dto) {
        try {
            const productAssign = await this.productAssignRepository.find({
                where: { companyCode: dto.companyCode, unitCode: dto.unitCode },
                relations: ['branchId', 'staffId', 'productId', 'requestId'],
            });
            if (!productAssign) {
                throw new Error('Product assignment not found');
            }
            return new common_response_1.CommonResponse(true, 200, 'Product assignment fetched successfully', productAssign);
        }
        catch (error) {
            throw new error_response_1.ErrorResponse(500, error.message);
        }
    }
    async deleteProductAssign(dto) {
        try {
            const productAssign = await this.productAssignRepository.findOne({ where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode } });
            if (!productAssign) {
                throw new Error('Product assignment not found');
            }
            await this.productAssignRepository.remove(productAssign);
            return new common_response_1.CommonResponse(true, 200, 'Product assignment deleted successfully');
        }
        catch (error) {
            console.error('Error in delete product assignment', error);
            throw new Error('Error deleting product assignment');
        }
    }
};
exports.ProductAssignService = ProductAssignService;
exports.ProductAssignService = ProductAssignService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [product_assign_repo_1.ProductAssignRepository,
        product_assign_adapter_1.ProductAssignAdapter,
        branch_repo_1.BranchRepository,
        typeorm_1.DataSource,
        sub_dealer_repo_1.SubDealerRepository])
], ProductAssignService);
//# sourceMappingURL=product-assign.service.js.map