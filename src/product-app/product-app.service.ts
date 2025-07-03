import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductAppDto } from './dto/product-app.dto';
import { ProductAppAdapter } from './product-app.adapter';
import { CommonResponse } from 'src/models/common-response';
import { ProductAppRepository } from './repo/product-app.repo';
import { ErrorResponse } from 'src/models/error-response';
import { Storage } from '@google-cloud/storage';


@Injectable()
export class ProductAppService {
    private storage: Storage;
    private bucketName: string;
    constructor(
        private readonly repo: ProductAppRepository,
        private adapter: ProductAppAdapter
    ) {
        this.storage = new Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });

        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }

    async handleUpdateAppDetails(dto: ProductAppDto, photo?: Express.Multer.File): Promise<CommonResponse> {
        let filePath: string | null = null;
        if (photo) {
            const bucket = this.storage.bucket(this.bucketName);
            const uniqueFileName = `app_photos/${Date.now()}-${photo.originalname}`;
            const file = bucket.file(uniqueFileName);

            await file.save(photo.buffer, {
                contentType: photo.mimetype,
                resumable: false,
            });

            console.log(`File uploaded to GCS: ${uniqueFileName}`);
            filePath = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
        }
if (dto.id) {
    return this.update(dto, filePath);
}else{
    return this.create(dto, filePath);
}

    }

    async handleBulkProductApp(
        dtoList: ProductAppDto[],
        photos?: Express.Multer.File[],
    ): Promise<CommonResponse> {
        const results: CommonResponse[] = [];

        for (let i = 0; i < dtoList.length; i++) {
            const dto = dtoList[i];
            const photo = photos?.[i];
            const result = await this.handleSingleAmenity(dto, photo);
            results.push(result);
        }

        return new CommonResponse(true, 200, 'All amenities processed', results);
    }

    private async handleSingleAmenity(
        dto: ProductAppDto,
        photo?: Express.Multer.File,
    ): Promise<CommonResponse> {
        let filePath: string | null = null;

        if (photo) {
            const bucket = this.storage.bucket(this.bucketName);
            const uniqueFileName = `app_photos/${Date.now()}-${photo.originalname}`;
            const file = bucket.file(uniqueFileName);

            await file.save(photo.buffer, {
                contentType: photo.mimetype,
                resumable: false,
            });

            filePath = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
        }


        return this.create(dto, filePath);

    }

    async create(dto: ProductAppDto, filePath: string | null): Promise<CommonResponse> {
        try {
            const entity = this.adapter.toEntity(dto);
            if (filePath) {
                entity.image = filePath;
            }
            await this.repo.insert(entity);
            return new CommonResponse(true, 201, 'Product App created');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }
    
    async update(dto: ProductAppDto, filePath: string | null): Promise<CommonResponse> {
        try {
            const existing = await this.repo.findOne({ where: { id: dto.id } });

            if (!existing) throw new Error('app not found');
            if (filePath && existing.image) {
                const existingFilePath = existing.image
                    .replace(`https://storage.googleapis.com/${this.bucketName}/`, '')
                    .trim(); // 🧼 Clean extra spaces

                const file = this.storage.bucket(this.bucketName).file(existingFilePath);

                try {
                    const [exists] = await file.exists(); // ✅ Check existence
                    if (exists) {
                        await file.delete();
                        console.log(`Deleted old file from GCS: ${existingFilePath}`);
                    } else {
                        console.warn(`File not found in GCS, skipping delete: ${existingFilePath}`);
                    }
                } catch (error) {
                    console.error(`Error deleting old file from GCS: ${error.message}`);
                }
            }
            const updated = this.adapter.toEntity(dto);
            if (filePath) updated.image = filePath;
            Object.assign(existing, updated);
            await this.repo.save(existing);
            return new CommonResponse(true, 200, 'Product app updated successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async findAll(): Promise<CommonResponse> {
        const branch = await this.repo.find({ relations: ['webProduct'] });

        // Convert each entity in the array to DTO
        const staffDtos = branch.map(entity => this.adapter.toDto(entity));

        if (staffDtos.length === 0) {
            return new CommonResponse(false, 35416, "There Is No List");
        }

        return new CommonResponse(true, 35416, "Branch List Retrieved Successfully", staffDtos);
    }
}
