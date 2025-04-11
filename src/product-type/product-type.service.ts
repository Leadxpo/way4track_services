import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { CommonReq } from 'src/models/common-req';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { ProductTypeDto } from './dto/product-type.dto';
import { ProductTypeEntity } from './entity/product-type.entity';
import { ProductTypeAdapter } from './product-type.adapter';
import { ProductTypeRepository } from './repo/product-type.repo';

@Injectable()
export class ProductTypeService {
    // private storage: Storage;
    // private bucketName: string;
    constructor(
        private readonly productTypeAdapter: ProductTypeAdapter,
        private readonly productTypeRepository: ProductTypeRepository,
    ) {
        // this.storage = new Storage({
        //     projectId: process.env.GCLOUD_PROJECT_ID ||
        //         'sharontelematics-1530044111318',
        //     keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        // });

        // this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }
    async handleProductTypeDetails(dto: ProductTypeDto,
        //  photos?: {
        //     photo?: Express.Multer.File[];
        //     image?: Express.Multer.File[];
        // }
    ): Promise<CommonResponse> {
        try {
            // Ensure photos is always an object
            // photos = photos ?? { photo: [], image: [] };

            // let filePaths: Record<keyof typeof photos, string | undefined> = {
            //     photo: undefined,
            //     image: undefined
            // };

            // for (const [key, fileArray] of Object.entries(photos)) {
            //     if (fileArray && fileArray.length > 0) {
            //         const file = fileArray[0]; // Get the first file
            //         const uniqueFileName = `ProductType_photos/${Date.now()}-${file.originalname}`;
            //         const storageFile = this.storage.bucket(this.bucketName).file(uniqueFileName);
            //         await storageFile.save(file.buffer, {
            //             contentType: file.mimetype,
            //             resumable: false,
            //         });
            //         console.log(`File uploaded to GCS: ${uniqueFileName}`);
            //         filePaths[key as keyof typeof photos] = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
            //     }
            // }

            // const existingStaff = dto.id ? await this.productTypeRepository.findOne({ where: { id: dto.id } }) : null;
            if (dto.id) {
                return await this.updateProductTypeDetails(dto);
            } else {
                console.log("+++++++")
                return await this.createProductTypeDetails(dto);
            }
        } catch (error) {
            console.error(`Error handling ProductType details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to handle ProductType details: ${error.message}`);
        }
    }


    async createProductTypeDetails(dto: ProductTypeDto, filePaths?: Record<string, string | null>): Promise<CommonResponse> {
        try {
            const entity = this.productTypeAdapter.convertDtoToEntity(dto);
            // if (filePaths) {
            //     entity.productPhoto = filePaths.photo;
            //     entity.blogImage = filePaths.image;
            // }
            console.log(entity, "entity")
            await this.productTypeRepository.insert(entity);
            return new CommonResponse(true, 201, 'ProductType details created successfully');
        } catch (error) {
            console.error(`Error creating ProductType details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to create ProductType details: ${error.message}`);
        }
    }

    async updateProductTypeDetails(dto: ProductTypeDto): Promise<CommonResponse> {
        try {
            // , filePaths: Record<string, string | null>?
            let existingProductType: ProductTypeEntity | null = null;
            if (dto.id) {
                existingProductType = await this.productTypeRepository.findOne({ where: { id: dto.id } });
            }
            if (!existingProductType) {
                throw new Error('ProductType not found');
            }
            // const photoMapping: Record<string, string> = {
            //     photo: 'productPhoto',
            //     image: 'blogImage'
            // };
            // Object.keys(photoMapping).forEach(field => {
            //     const entityField = photoMapping[field];
            //     if (filePaths[field]) {
            //         (existingProductType as any)[entityField] = filePaths[field];
            //     }
            // });
            // for (const field in photoMapping) {
            //     const entityField = photoMapping[field];
            //     const newFilePath = filePaths[field];
            //     const existingFilePath = existingProductType[entityField as keyof ProductTypeEntity];
            //     if (typeof existingFilePath === 'string' && newFilePath) {
            //         const existingFileName = existingFilePath.replace(`https://storage.googleapis.com/${this.bucketName}/`, '');
            //         const file = this.storage.bucket(this.bucketName).file(existingFileName);
            //         try {
            //             await file.delete();
            //             console.log(`Deleted old file from GCS: ${existingFileName}`);
            //         } catch (error) {
            //             console.error(`Error deleting old file from GCS: ${error.message}`);
            //         }
            //     }
            // }

            const entity = this.productTypeAdapter.convertDtoToEntity(dto);
            entity.id = existingProductType.id
            Object.assign(existingProductType, entity);
            // Merge existing ProductType details with new data
            // Object.keys(photoMapping).forEach(field => {
            //     const entityField = photoMapping[field];
            //     if (filePaths[field]) {
            //         (existingProductType as any)[entityField] = filePaths[field];
            //     }
            // });
            // console.log("Final data before saving:", existingProductType);
            await this.productTypeRepository.update(existingProductType.id, {
                ...dto, // Ensure DTO values are applied
                // productPhoto: filePaths.photo || existingProductType.productPhoto,
                // blogImage: filePaths.image || existingProductType.blogImage
            });
            return new CommonResponse(true, 200, 'ProductType details updated successfully');
        } catch (error) {
            console.error(`Error updating ProductType details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to update ProductType details: ${error.message}`);
        }
    }

    async deleteProductTypeDetails(dto: HiringIdDto): Promise<CommonResponse> {
        try {
            const ProductType = await this.productTypeRepository.findOne({
                where: {
                    id: dto.id,
                    companyCode: dto.companyCode,
                    unitCode: dto.unitCode
                }
            });

            if (!ProductType) {
                return new CommonResponse(false, 404, 'ProductType not found');
            }

            await this.productTypeRepository.delete({ id: ProductType.id }); // Correct 

            return new CommonResponse(true, 200, 'ProductType details deleted successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }


    async getProductTypeDetailsById(req: HiringIdDto): Promise<CommonResponse> {
        try {
            console.log(req, "+++++++++++")

            const ProductType = await this.productTypeRepository.findOne({ where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode } });

            if (!ProductType) {
                return new CommonResponse(false, 404, 'ProductType not found');
            }
            else {
                return new CommonResponse(true, 200, 'ProductType details fetched successfully', ProductType);
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getProductTypeDetails(req: CommonReq): Promise<CommonResponse> {
        try {
            const ProductType = await this.productTypeRepository.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode } });
            if (!ProductType) {
                return new CommonResponse(false, 404, 'ProductType not found');
            }
            else {
                const data = this.productTypeAdapter.convertEntityToDto(ProductType)
                return new CommonResponse(true, 200, 'ProductType details fetched successfully', data);
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getProductTypeNamesDropDown(): Promise<CommonResponse> {
        const data = await this.productTypeRepository.find({ select: ['name', 'id', 'type'] });
        if (data.length) {
            return new CommonResponse(true, 75483, "Data Retrieved Successfully", data)
        } else {
            return new CommonResponse(false, 4579, "There Is No branch names")
        }
    }

}
