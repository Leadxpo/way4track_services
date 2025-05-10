import { Injectable } from '@nestjs/common';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { CommonReq } from 'src/models/common-req';
import { WebsiteProductRepository } from './repo/website-product.repo';
import { WebsiteProductDto } from './dto/website.dto';
import { WebsiteProductAdapter } from './website-product.adapter';
import { WebsiteProductIdDto } from './dto/website-product-id.dto';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class WebsiteProductService {
    private storage: Storage;
    private bucketName: string;
    constructor(
        private readonly websiteProductRepository: WebsiteProductRepository,
        private readonly adapter: WebsiteProductAdapter
    ) {
        this.storage = new Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });

        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }

    async handleWebsiteProductDetails(
        dto: WebsiteProductDto,
        photos: {
            homeBanner?: Express.Multer.File[];
            footerBanner?: Express.Multer.File[],
            banner1?: Express.Multer.File[];
            banner2?: Express.Multer.File[];
            banner3?: Express.Multer.File[];
            blogImage?: Express.Multer.File[];
            productIcon?: Express.Multer.File[];
            chooseImage?: Express.Multer.File[];
        } = {}
    ): Promise<CommonResponse> {
        const filePaths: Partial<Record<keyof typeof photos, string | undefined>> = {
            homeBanner: undefined,
            footerBanner: undefined,
            banner2: undefined,
            banner3: undefined,
            banner1: undefined,
            blogImage: undefined,
            productIcon: undefined,
            chooseImage: undefined
        };

        for (const [key, fileArray] of Object.entries(photos)) {
            if (!fileArray || fileArray.length === 0) continue;

            const file = fileArray[0];
            const uniqueFileName = `web_product_photos/${Date.now()}-${file.originalname}`;
            const storageFile = this.storage.bucket(this.bucketName).file(uniqueFileName);

            await storageFile.save(file.buffer, {
                contentType: file.mimetype,
                resumable: false,
            });

            filePaths[key as keyof typeof photos] = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
        }

        try {
            if (dto.id) {
                return await this.updateWebsiteProductDetails(dto, filePaths);
            } else {
                console.log(filePaths, "+++++++++")
                return await this.createWebsiteProductDetails(dto, filePaths);
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }


    async createWebsiteProductDetails(dto: WebsiteProductDto, filePaths?: Record<string, string | null>,): Promise<CommonResponse> {
        try {
            const entity = this.adapter.convertDtoToEntity(dto);
            console.log(filePaths, "+++++++++")
            if (filePaths) {
                entity.homeBanner = filePaths.homeBanner;
                entity.footerBanner = filePaths.footerBanner;
                entity.banner1 = filePaths.banner1;
                entity.banner2 = filePaths.banner2;
                entity.banner3 = filePaths.banner3;
                entity.blogImage = filePaths.blogImage;
                entity.productIcon = filePaths.productIcon
                entity.chooseImage = filePaths.chooseImage
            }
            console.log(entity, "???????")
            await this.websiteProductRepository.insert(entity);
            return new CommonResponse(true, 201, 'WebsiteProduct created successfully', entity);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async updateWebsiteProductDetails(
        dto: WebsiteProductDto,
        filePaths: Partial<Record<keyof WebsiteProductDto, string>> = {}
    ): Promise<CommonResponse> {
        try {
            const existing = await this.websiteProductRepository.findOne({ where: { id: dto.id } });
            if (!existing) throw new Error('WebsiteProduct not found');

            // Replace image URLs only if new files were uploaded
            const updatedEntity = {
                ...existing,
                ...dto, // Other fields
                homeBanner: filePaths.homeBanner ?? existing.homeBanner,
                footerBanner: filePaths.footerBanner ?? existing.footerBanner,
                banner1: filePaths.banner1 ?? existing.banner1,
                banner2: filePaths.banner2 ?? existing.banner2,
                banner3: filePaths.banner3 ?? existing.banner3,
                blogImage: filePaths.blogImage ?? existing.blogImage,
                productIcon: filePaths.productIcon ?? existing.productIcon,
                chooseImage: filePaths.chooseImage ?? existing.chooseImage
            };

            await this.websiteProductRepository.save(updatedEntity);
            return new CommonResponse(true, 200, 'WebsiteProduct updated successfully', updatedEntity);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }


    async deleteWebsiteProductDetails(dto: WebsiteProductIdDto): Promise<CommonResponse> {
        try {
            const existing = await this.websiteProductRepository.findOne({
                where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode },
            });

            if (!existing) {
                return new CommonResponse(false, 404, 'WebsiteProduct not found');
            }

            await this.websiteProductRepository.delete({ id: existing.id });
            return new CommonResponse(true, 200, 'WebsiteProduct deleted successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getWebsiteProductDetailsById(req: WebsiteProductIdDto): Promise<CommonResponse> {
        try {
            const item = await this.websiteProductRepository.findOne({
                where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode }, relations: ['device', 'amenities', 'application', 'productApp', 'Blog']
            });

            if (!item) return new CommonResponse(false, 404, 'WebsiteProduct not found');
            return new CommonResponse(true, 200, 'WebsiteProduct fetched successfully', item);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getWebsiteProductDetails(req: CommonReq): Promise<CommonResponse> {
        try {
            const items = await this.websiteProductRepository
                .createQueryBuilder('product')
                .leftJoinAndSelect('product.device', 'device')
                .leftJoinAndSelect('product.amenities', 'amenities')
                .leftJoinAndSelect('product.application', 'application')
                .leftJoinAndSelect('product.productApp', 'productApp')
                // .leftJoinAndSelect('product.Blog', 'Blog')
                .where('product.companyCode = :companyCode AND product.unitCode = :unitCode', {
                    companyCode: req.companyCode,
                    unitCode: req.unitCode
                })
                .getMany();

            // const items = await this.websiteProductRepository.find({
            //     where: { companyCode: req.companyCode, unitCode: req.unitCode }, relations: ['device', 'amenities', 'application']
            // });

            if (!items || !items.length) return new CommonResponse(false, 404, 'WebsiteProduct not found');

            const data = this.adapter.convertEntityToDto(items);
            return new CommonResponse(true, 200, 'WebsiteProduct list fetched', data);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getWebsiteProductDropdown(): Promise<CommonResponse> {
        try {
            const data = await this.websiteProductRepository.find({ select: ['id', 'name'] });
            if (data.length) {
                return new CommonResponse(true, 200, 'Dropdown fetched', data);
            }
            return new CommonResponse(false, 404, 'No WebsiteProduct entries');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }
}
