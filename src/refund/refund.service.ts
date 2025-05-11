import { Injectable } from '@nestjs/common';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { CommonReq } from 'src/models/common-req';
import { Storage } from '@google-cloud/storage';
import { RefundAdapter } from './refund.adapter';
import { RefundRepository } from './repo/refund.repo';
import { CreateRefundDto } from './dto/refund.dto';

@Injectable()
export class RefundService {
    private storage: Storage;
    private bucketName: string;
    constructor(private readonly repo: RefundRepository,
        private readonly adapter: RefundAdapter
    ) {
        this.storage = new Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });

        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }

    async handleRefundDetails(dto: CreateRefundDto, photo?: Express.Multer.File): Promise<CommonResponse> {
        try {

            let filePath: string | null = null;
            if (photo) {
                const bucket = this.storage.bucket(this.bucketName);
                const uniqueFileName = `Refund_photos/${Date.now()}-${photo.originalname}`;
                const file = bucket.file(uniqueFileName);

                await file.save(photo.buffer, {
                    contentType: photo.mimetype,
                    resumable: false,
                });

                console.log(`File uploaded to GCS: ${uniqueFileName}`);
                filePath = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
            }
            if (dto.id) {
                return this.updateRefundDetails(dto, filePath);
            } else {
                return this.createRefundDetails(dto, filePath);
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async createRefundDetails(dto: CreateRefundDto, filePath: string | null): Promise<CommonResponse> {
        try {
            const entity = this.adapter.toEntity(dto);
            if (filePath) {
                entity.damageImage = filePath;
            }
            await this.repo.insert(entity);
            return new CommonResponse(true, 201, 'Refund created successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async updateRefundDetails(dto: CreateRefundDto, filePath: string | null): Promise<CommonResponse> {
        try {
            console.log(dto);
            const existing = await this.repo.findOne({ where: { id: dto.id } });
            console.log(existing, "?????????");
            if (!existing) throw new Error('Refund not found');

            if (filePath && existing.damageImage) {
                const existingFilePath = existing.damageImage.replace(`https://storage.googleapis.com/${this.bucketName}/`, '');
                const file = this.storage.bucket(this.bucketName).file(existingFilePath);

                try {
                    await file.delete();
                    console.log(`Deleted old file from GCS: ${existingFilePath}`);
                } catch (error) {
                    console.error(`Error deleting old file from GCS: ${error.message}`);
                }
            }

            const updated = this.adapter.toEntity(dto);
            if (filePath) updated.damageImage = filePath;

            Object.assign(existing, updated);
            await this.repo.save(existing); // ✅ Save the merged result

            return new CommonResponse(true, 200, 'Refund updated successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async deleteRefundDetails(dto: HiringIdDto): Promise<CommonResponse> {
        try {
            const existing = await this.repo.findOne({ where: { id: dto.id } });

            if (!existing) return new CommonResponse(false, 404, 'Refund not found');

            await this.repo.delete({ id: existing.id });
            return new CommonResponse(true, 200, 'Refund deleted successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getRefundDetailsById(req: HiringIdDto): Promise<CommonResponse> {
        try {
            const item = await this.repo.findOne({
                where: { id: req.id },
                relations: ['order', 'clientId', 'transactionId', 'deviceId'],
            });

            if (!item) return new CommonResponse(false, 404, 'Refund not found');
            return new CommonResponse(true, 200, 'Refund fetched successfully', item);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getRefundDetails(req: CommonReq): Promise<CommonResponse> {
        try {
            const items = await this.repo.find({ relations: ['order', 'clientId', 'transactionId', 'deviceId'] });

            if (!items || !items.length) {
                return new CommonResponse(false, 404, 'Refund not found');
            }

            const data = items.map((rec) => this.adapter.toResponseDto(rec));
            return new CommonResponse(true, 200, 'Refund list fetched', data);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }


}