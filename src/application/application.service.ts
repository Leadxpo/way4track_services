
import { Injectable } from '@nestjs/common';
import { CommonResponse } from 'src/models/common-response';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { CommonReq } from 'src/models/common-req';
import { Storage } from '@google-cloud/storage';
import { ErrorResponse } from 'src/models/error-response';
import { ApplicationRepository } from './repo/application.repo';
import { ApplicationAdapter } from './application.adapter';
import { ApplicationDto } from './dto/application.dto';

@Injectable()
export class ApplicationService {
    private storage: Storage;
    private bucketName: string;
    constructor(
        private readonly repo: ApplicationRepository,
        private readonly adapter: ApplicationAdapter,
    ) {
        this.storage = new Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });

        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }

    async handleUpdateApplicationDetails(dto: ApplicationDto, photo?: Express.Multer.File): Promise<CommonResponse> {
        let filePath: string | null = null;
        if (photo) {
            const bucket = this.storage.bucket(this.bucketName);
            const uniqueFileName = `Application_photos/${Date.now()}-${photo.originalname}`;
            const file = bucket.file(uniqueFileName);

            await file.save(photo.buffer, {
                contentType: photo.mimetype,
                resumable: false,
            });

            console.log(`File uploaded to GCS: ${uniqueFileName}`);
            filePath = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
        }
        return this.updateApplicationDetails(dto, filePath);
    }

    async handleBulkAmenities(
        dtoList: ApplicationDto[],
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
        dto: ApplicationDto,
        photo?: Express.Multer.File,
    ): Promise<CommonResponse> {
        let filePath: string | null = null;

        if (photo) {
            const bucket = this.storage.bucket(this.bucketName);
            const uniqueFileName = `Application_photos/${Date.now()}-${photo.originalname}`;
            const file = bucket.file(uniqueFileName);

            await file.save(photo.buffer, {
                contentType: photo.mimetype,
                resumable: false,
            });

            filePath = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
        }

        // if (dto.id) {
        //     return this.updateApplicationDetails(dto, filePath);
        // } else {
        return this.createApplicationDetails(dto, filePath);
        // }
    }


    async createApplicationDetails(dto: ApplicationDto, filePath: string | null): Promise<CommonResponse> {
        try {
            const entity = this.adapter.convertDtoToEntity(dto);
            if (filePath) {
                entity.image = filePath;
            }
            await this.repo.insert(entity);
            return new CommonResponse(true, 201, 'Application created successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async updateApplicationDetails(dto: ApplicationDto, filePath: string | null): Promise<CommonResponse> {
        try {
            const existing = await this.repo.findOne({ where: { id: dto.id } });

            if (!existing) throw new Error('Application not found');
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
            const updated = this.adapter.convertDtoToEntity(dto);
            if (filePath) updated.image = filePath;
            Object.assign(existing, updated);
            await this.repo.save(existing);
            return new CommonResponse(true, 200, 'Application updated successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async deleteApplicationDetails(dto: HiringIdDto): Promise<CommonResponse> {
        try {
            const existing = await this.repo.findOne({ where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode } });

            if (!existing) return new CommonResponse(false, 404, 'not found');

            await this.repo.delete({ id: existing.id });
            return new CommonResponse(true, 200, 'deleted successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getApplicationDetailsById(req: HiringIdDto): Promise<CommonResponse> {
        try {
            const item = await this.repo.findOne({
                where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode },
                relations: ['webProduct'],
            });

            if (!item) return new CommonResponse(false, 404, 'Application not found');
            return new CommonResponse(true, 200, 'Application fetched successfully', item);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }


    async getApplicationDetails(dto: CommonReq): Promise<CommonResponse> {
        try {
            const items = await this.repo.find({
                relations: ['webProduct'], where: { companyCode: dto.companyCode, unitCode: dto.unitCode }
            });

            if (!items || !items.length) return new CommonResponse(false, 404, 'Application not found');

            const data = this.adapter.convertEntityListToDto(items);
            return new CommonResponse(true, 200, 'Application list fetched', data);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getApplicationDropdown(): Promise<CommonResponse> {
        try {
            const data = await this.repo.find({
                select: ['id', 'name'],
            });

            if (data.length) {
                return new CommonResponse(true, 200, 'Dropdown fetched', data);
            }

            return new CommonResponse(false, 404, 'No Application entries');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }
}
