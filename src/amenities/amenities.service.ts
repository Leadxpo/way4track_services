import { Injectable } from '@nestjs/common';
import { AmenitiesDto } from './dto/amenities.dto';
import { AmenitiesRepository } from './repo/amenities.repo';
import { AmenitiesAdapter } from './amenities.adapter';
import { CommonResponse } from 'src/models/common-response';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { CommonReq } from 'src/models/common-req';
import { Storage } from '@google-cloud/storage';
import { ErrorResponse } from 'src/models/error-response';

@Injectable()
export class AmenitiesService {
    private storage: Storage;
    private bucketName: string;
    constructor(
        private readonly repo: AmenitiesRepository,
        private readonly adapter: AmenitiesAdapter,
    ) {
        this.storage = new Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });

        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }

    async handleUpdateAmenitiesDetails(dto: AmenitiesDto, photo?: Express.Multer.File): Promise<CommonResponse> {
        let filePath: string | null = null;
        if (photo) {
            const bucket = this.storage.bucket(this.bucketName);
            const uniqueFileName = `amenities_photos/${Date.now()}-${photo.originalname}`;
            const file = bucket.file(uniqueFileName);

            await file.save(photo.buffer, {
                contentType: photo.mimetype,
                resumable: false,
            });

            console.log(`File uploaded to GCS: ${uniqueFileName}`);
            filePath = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
        }

        return this.updateDeviceDetails(dto, filePath);

    }


    async createDeviceDetails(dto: AmenitiesDto, filePath: string | null): Promise<CommonResponse> {
        try {
            const entity = this.adapter.convertDtoToEntity(dto);
            if (filePath) {
                entity.image = filePath;
            }
            await this.repo.insert(entity);
            return new CommonResponse(true, 201, 'Device created successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async updateDeviceDetails(dto: AmenitiesDto, filePath: string | null): Promise<CommonResponse> {
        try {
            const existing = await this.repo.findOne({ where: { id: dto.id } });

            if (!existing) throw new Error('amenities not found');
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
            return new CommonResponse(true, 200, 'Device updated successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async handleBulkAmenities(
        dtoList: AmenitiesDto[],
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
        dto: AmenitiesDto,
        photo?: Express.Multer.File,
    ): Promise<CommonResponse> {
        let filePath: string | null = null;

        if (photo) {
            const bucket = this.storage.bucket(this.bucketName);
            const uniqueFileName = `amenities_photos/${Date.now()}-${photo.originalname}`;
            const file = bucket.file(uniqueFileName);

            await file.save(photo.buffer, {
                contentType: photo.mimetype,
                resumable: false,
            });

            filePath = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
        }


        return this.createDeviceDetails(dto, filePath);

    }


    async deleteDeviceDetails(dto: HiringIdDto): Promise<CommonResponse> {
        try {
            const existing = await this.repo.findOne({ where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode } });

            if (!existing) return new CommonResponse(false, 404, 'not found');

            await this.repo.delete({ id: existing.id });
            return new CommonResponse(true, 200, 'deleted successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getAmenitiesDetailsById(req: HiringIdDto): Promise<CommonResponse> {
        try {
            const item = await this.repo.findOne({
                where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode },
                relations: ['webProduct'],
            });

            if (!item) return new CommonResponse(false, 404, 'Device not found');
            return new CommonResponse(true, 200, 'Device fetched successfully', item);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }


    async getAmenitiesDetails(req: CommonReq): Promise<CommonResponse> {
        try {
            const items = await this.repo.find({
                where: { companyCode: req.companyCode, unitCode: req.unitCode },
                relations: ['webProduct'],
            });

            if (!items || !items.length) return new CommonResponse(false, 404, 'Device not found');

            const data = this.adapter.convertEntityListToDto(items);
            return new CommonResponse(true, 200, 'Device list fetched', data);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getAmenitiesDropdown(): Promise<CommonResponse> {
        try {
            const data = await this.repo.find({
                select: ['id', 'name'],
            });

            if (data.length) {
                return new CommonResponse(true, 200, 'Dropdown fetched', data);
            }

            return new CommonResponse(false, 404, 'No Device entries');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }
}
