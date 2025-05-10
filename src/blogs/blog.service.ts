import { Injectable } from '@nestjs/common';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { CommonReq } from 'src/models/common-req';
import { Storage } from '@google-cloud/storage';
import { BlogRepository } from './repo/blog.repo';
import { BlogAdapter } from './blog.adapter';
import { CreateBlogDto } from './dto/create-blog.dto';

@Injectable()
export class BlogService {
    private storage: Storage;
    private bucketName: string;
    constructor(private readonly blogRepository: BlogRepository,
        private readonly adapter: BlogAdapter
    ) {
        this.storage = new Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });

        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }

    async handleBlogDetails(
        dto: CreateBlogDto,
        photos: {
            photo?: Express.Multer.File[];
            pdf?: Express.Multer.File[];
        } = {}
    ): Promise<CommonResponse> {
        try {
            const filePaths: Partial<Record<'photo' | 'pdf', string>> = {};

            const allowedKeys: (keyof typeof photos)[] = ['photo', 'pdf'];
            for (const key of allowedKeys) {
                const fileArray = photos[key];
                if (!fileArray?.length) continue;

                const file = fileArray[0];
                const uniqueFileName = `web_product_photos/${Date.now()}-${file.originalname}`;
                const storageFile = this.storage.bucket(this.bucketName).file(uniqueFileName);

                await storageFile.save(file.buffer, {
                    contentType: file.mimetype,
                    resumable: false,
                });

                filePaths[key] = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
            }

            return dto.id
                ? this.updateBlogProductDetails(dto, filePaths)
                : this.createBlogProductDetails(dto, filePaths);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async createBlogProductDetails(
        dto: CreateBlogDto,
        filePaths?: Partial<Record<'photo' | 'pdf', string>>
    ): Promise<CommonResponse> {
        try {
            const entity = this.adapter.toEntity(dto);
            if (filePaths) {
                entity.image = filePaths.photo;
                entity.pdfFile = filePaths.pdf;
            }

            await this.blogRepository.insert(entity);
            return new CommonResponse(true, 201, 'BlogProduct created successfully', entity);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async updateBlogProductDetails(
        dto: CreateBlogDto,
        filePaths?: Partial<Record<'photo' | 'pdf', string>>
    ): Promise<CommonResponse> {
        try {
            const existing = await this.blogRepository.findOne({ where: { id: dto.id } });
            if (!existing) throw new Error('BlogProduct not found');

            const updatedEntity = {
                ...existing,
                ...dto,
                image: filePaths?.photo ?? existing.image,
                pdfFile: filePaths?.pdf ?? existing.pdfFile,
            };

            await this.blogRepository.save(updatedEntity);
            return new CommonResponse(true, 200, 'BlogProduct updated successfully', updatedEntity);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }


    async deleteBlogDetails(dto: HiringIdDto): Promise<CommonResponse> {
        try {
            const existing = await this.blogRepository.findOne({ where: { id: dto.id } });

            if (!existing) return new CommonResponse(false, 404, 'Blog not found');

            await this.blogRepository.delete({ id: existing.id });
            return new CommonResponse(true, 200, 'Blog deleted successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getBlogDetailsById(req: HiringIdDto): Promise<CommonResponse> {
        try {
            const item = await this.blogRepository.findOne({
                where: { id: req.id },
                relations: ['webProduct'],
            });
            if (!item) return new CommonResponse(false, 404, 'Blog not found');
            return new CommonResponse(true, 200, 'Blog fetched successfully', item);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getBlogDetails(): Promise<CommonResponse> {
        try {
            const items = await this.blogRepository.find({
                relations: ['webProduct'],
            });

            if (!items || !items.length) return new CommonResponse(false, 404, 'Blog not found');

            const data = items.map(item => this.adapter.toResponseDto(item));

            return new CommonResponse(true, 200, 'Blog list fetched', data);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }
}