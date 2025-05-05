import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PromotionRepository } from './repo/promotional.repo';
import { PromotionEntity } from './entity/promotional-entity';
import { CreatePromotionDto } from './dto/promotional.dto';
import { Storage } from '@google-cloud/storage';
import { PromotionAdapter } from './promotional-adapter';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { TechIdDto } from 'src/technician-works/dto/technician-id.dto';

@Injectable()
export class PromotionService {
    private storage: Storage;
    private bucketName: string;

    constructor(
        private readonly promoRepo: PromotionRepository,
        private readonly adapter: PromotionAdapter
    ) {
        this.storage = new Storage({
            projectId: process.env.GCLOUD_PROJECT_ID || 'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json'
        });
        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }

    async handleTechnicianDetails(
        req: CreatePromotionDto,
        photos: {
            photo?: Express.Multer.File[];
            image?: Express.Multer.File[];
            themeBgimage?: Express.Multer.File[]
        } = {}
    ): Promise<CommonResponse> {
        const filePaths: Record<'photo' | 'image' | 'themeBgimage', string | undefined> = {
            photo: undefined,
            image: undefined,
            themeBgimage: undefined
        };

        const uploadedImages: string[] = [];

        // Handle single file uploads (excluding 'photo')
        for (const [key, fileArray] of Object.entries(photos)) {
            if (!fileArray || fileArray.length === 0) continue;
            if (key === 'photo') continue; // 'photo' handled separately

            const file = fileArray[0];
            const uniqueFileName = `promotion_photos/${Date.now()}-${file.originalname}`;
            const storageFile = this.storage.bucket(this.bucketName).file(uniqueFileName);

            await storageFile.save(file.buffer, {
                contentType: file.mimetype,
                resumable: false,
            });

            filePaths[key as keyof typeof filePaths] = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
        }

        // Upload multiple list images (photo[])
        if (photos.photo?.length) {
            for (const file of photos.photo) {
                const uniqueFileName = `list_images/${Date.now()}-${file.originalname}`;
                const storageFile = this.storage.bucket(this.bucketName).file(uniqueFileName);

                await storageFile.save(file.buffer, {
                    contentType: file.mimetype,
                    resumable: false,
                });

                uploadedImages.push(`https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`);
            }
        }
        console.log(req, ">")
        console.log(uploadedImages, "999")

        return req.id
            ? await this.updateTechnicianDetails(req, filePaths, uploadedImages)
            : await this.createTechnicianDetails(req, filePaths, uploadedImages);
    }

    async createTechnicianDetails(
        dto: CreatePromotionDto,
        filePaths: Record<string, string | null> = {},
        uploadedImages: string[] = [],
    ): Promise<CommonResponse> {
        const entity = this.adapter.fromDtoToEntity(dto);

        // Assign image if available
        if (filePaths.image) {
            entity.image = filePaths.image;
            entity.themeBgimage = filePaths.themeBgimage
        }

        if (typeof entity.list === 'string') {
            try {
                entity.list = JSON.parse(entity.list);

                // Important fix: if it's a single object, wrap it into an array
                if (!Array.isArray(entity.list)) {
                    entity.list = [entity.list];
                }

            } catch (e) {
                console.error('Failed to parse list string', entity.list);
                entity.list = [];
            }
        }

        console.log(uploadedImages, ">>>>");

        if (Array.isArray(entity.list)) {
            entity.list = entity.list.map((listItem, index) => ({
                ...listItem,
                photo: uploadedImages[index] || null,
            }));
        }
        console.log(uploadedImages, "+++++++")
        console.log(entity.list, "??????")
        const savedEntity = await this.promoRepo.save(entity);
        return new CommonResponse(true, 65152, 'Technician created Successfully', savedEntity);
    }



    async updateTechnicianDetails(
        dto: CreatePromotionDto,
        filePaths: Record<string, string | null> = {},
        uploadedImages: string[] = [],
    ): Promise<CommonResponse> {
        const existing = await this.promoRepo.findOne({
            where: { id: dto.id },
        });

        if (!existing) {
            throw new Error('Promotion not found');
        }

        let parsedList = dto.list;

        // Step 1: parse the list correctly
        if (typeof parsedList === 'string') {
            try {
                parsedList = JSON.parse(parsedList);
                if (!Array.isArray(parsedList)) {
                    parsedList = [parsedList];
                }
            } catch (e) {
                console.error('Failed to parse list string', parsedList);
                parsedList = [];
            }
        }

        if (!Array.isArray(parsedList)) {
            parsedList = [];
        }

        // Step 2: attach uploaded photo to list
        const newLists = parsedList.map((listItem, index) => ({
            ...listItem,
            photo: uploadedImages[index] || null,
        }));

        console.log(newLists, "newLists >>>");

        // Step 3: Now safely update fields
        const entity = this.adapter.fromDtoToEntity(dto);

        // Manually assign fields you want to update
        existing.name = entity.name;
        existing.header = entity.header;
        existing.shortDescription = entity.shortDescription;
        existing.theme = entity.theme;

        if (filePaths.image) {
            existing.image = filePaths.image;
            existing.themeBgimage = filePaths.themeBgimage
        }

        // Very important: Set the corrected list
        existing.list = newLists;

        // Step 4: Save
        await this.promoRepo.save(existing);

        return new CommonResponse(true, 65152, 'Technician Updated Successfully', existing);
    }


    async findAll(): Promise<CommonResponse> {
        try {
            const items = await this.promoRepo.find();

            if (!items || !items.length) {
                return new CommonResponse(false, 404, 'not found');
            }

            const data = this.adapter.fromEntityListToDtoList(items);
            return new CommonResponse(true, 200, 'Application list fetched', data);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }




    async findOne(req: TechIdDto): Promise<CommonResponse> {
        try {
            console.log(req, "+++++++++++")

            const Technician = await this.promoRepo.findOne({ where: { id: req.id } });
            if (!Technician) {
                return new CommonResponse(false, 404, 'Promotion not found');
            }
            else {
                return new CommonResponse(true, 200, 'Promotion details fetched successfully', Technician);
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }


    async remove(id: number): Promise<void> {
        const promo = await this.promoRepo.findOneBy({ id });
        if (!promo) throw new Error('Promotion not found');
        await this.promoRepo.delete(id);
    }
}