import { Injectable } from '@nestjs/common';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { RequestRaiseAdapter } from './request-raise.adapter';
import { RequestRaiseIdDto } from './dto/request-raise-id.dto';
import { RequestRaiseDto } from './dto/request-raise.dto';
import { RequestRaiseRepository } from './repo/request-raise.repo';
import { NotificationEnum } from 'src/notifications/entity/notification.entity';
import { NotificationService } from 'src/notifications/notification.service';
import { RequestRaiseEntity } from './entity/request-raise.entity';
import { CommonReq } from 'src/models/common-req';
import { Storage } from '@google-cloud/storage';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';

@Injectable()
export class RequestRaiseService {
    private storage: Storage;
    private bucketName: string;

    constructor(
        private readonly requestAdapter: RequestRaiseAdapter,
        private readonly requestRepository: RequestRaiseRepository,
        private readonly notificationService: NotificationService
    ) {
        this.storage = new Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });

        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }

    async updateRequestDetails(dto: RequestRaiseDto,photoPath?: string[] | []): Promise<CommonResponse> {
        
        try {
            const existingRequest = await this.requestRepository.findOne({
                where: { id: dto.id, requestId: dto.requestId }
            });

            if (!existingRequest) {
                return new CommonResponse(false, 4002, 'Request not found for the provided id.');
            }
            console.log("rrr :",(photoPath?.length > 0 && existingRequest?.image))
            if (photoPath?.length > 0 && existingRequest?.image) {
                let existingFiles: string[] = [];

                try {
                    existingFiles = existingRequest.image;
                } catch (err) {
                    // fallback in case it was stored as a string
                    existingFiles = existingRequest.image;
                }

                for (const url of existingFiles) {
                    const existingFilePath = url.replace(`https://storage.googleapis.com/${this.bucketName}/`, '');
                    const file = this.storage.bucket(this.bucketName).file(existingFilePath);

                    try {
                        await file.delete();
                        console.log(`Deleted old file from GCS: ${existingFilePath}`);
                    } catch (error) {
                        console.error(`Error deleting file from GCS: ${error.message}`);
                    }
                }
            }

            // Convert DTO to entity and merge the values
            const updatedEntity = this.requestAdapter.convertDtoToEntity(dto);
            if (photoPath) updatedEntity.image = photoPath;
            // Manually assign updated fields to the existing entity
            Object.assign(existingRequest, updatedEntity);

            // Ensure that the entity is populated correctly before saving
            if (Object.keys(updatedEntity).length === 0) {
                throw new Error("No update values found, skipping update operation.");
            }
            // Save the updated entity
            await this.requestRepository.save(existingRequest);

            return new CommonResponse(true, 65152, 'Request details updated successfully');
        } catch (error) {
            console.error(`Error updating request details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to update request details: ${error.message}`);
        }
    }


    async createRequestDetails(dto: RequestRaiseDto,photoPath?: string[] | []): Promise<CommonResponse> {
        let successResponse: CommonResponse;
        let entity: RequestRaiseEntity;
        try {
            entity = this.requestAdapter.convertDtoToEntity(dto);
            entity.id = null;


            const lastRequest = await this.requestRepository
                .createQueryBuilder("Request")
                .select("MAX(Request.id)", "max")
                .getRawOne();

            const nextId = (lastRequest.max ?? 0) + 1;
            entity.requestId = `RR-${nextId.toString().padStart(5, '0')}`;
            if (photoPath) {
                entity.image = photoPath;
            }
            const insertResult = await this.requestRepository.insert(entity);

            if (!insertResult.identifiers.length) {
                throw new Error('Failed to save request details');
            }

            successResponse = new CommonResponse(true, 201, 'Request details created successfully');

            // Send notification
            try {
                await this.notificationService.createNotification(entity, NotificationEnum.Request);
            } catch (notificationError) {
                console.error(`Notification failed: ${notificationError.message}`, notificationError.stack);
            }

            return successResponse;
        } catch (error) {
            console.error(`Error creating request details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to create request details: ${error.message}`);
        }
    }




    async handleRequestDetails(dto: RequestRaiseDto,photo?: Express.Multer.File[]): Promise<CommonResponse> {
        let photoPath: string[] = [];

        if (photo && photo.length > 0) {
            const bucket = this.storage.bucket(this.bucketName);

            for (const image of photo) {
                const uniqueFileName = `request/${Date.now()}-${image.originalname}`;
                const file = bucket.file(uniqueFileName);

                await file.save(image.buffer, {
                    contentType: image.mimetype,
                    resumable: false,
                });
                photoPath.push(`https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`);
            }
        }


        if (dto.id && dto.id !== null) {
            // Update if id or requestId is present
            return await this.updateRequestDetails(dto,photoPath);
        } else {
            // Create if neither id nor requestId is present
            return await this.createRequestDetails(dto,photoPath);
        }
    }


    async deleteRequestDetails(dto: RequestRaiseIdDto): Promise<CommonResponse> {
        try {
            const request = await this.requestRepository.findOne({ where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode } });
            if (!request) {
                return new CommonResponse(false, 404, 'Request not found');
            }

            await this.requestRepository.delete(dto.id);

            return new CommonResponse(true, 200, 'Request details deleted successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getRequestDetails(req: RequestRaiseIdDto): Promise<CommonResponse> {
        try {
            const request = await this.requestRepository.findOne({ relations: ['staffId', 'branchId', 'requestFrom', 'requestTo', 'subDealerId'], where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode } });
            if (!request) {
                return new CommonResponse(false, 404, 'Request not found');
            }
            return new CommonResponse(true, 200, 'Request details fetched successfully', request);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getAllRequestDetails(req: CommonReq): Promise<CommonResponse> {
        try {
            const request = await this.requestRepository.find({ relations: ['staffId', 'branchId', 'requestFrom', 'requestTo', 'subDealerId'], where: { companyCode: req.companyCode, unitCode: req.unitCode } });
            if (!request) {
                return new CommonResponse(false, 404, 'Request not found');
            }
            return new CommonResponse(true, 200, 'Request details fetched successfully', request);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getRequestsDropDown(): Promise<CommonResponse> {
        const data = await this.requestRepository.find({ select: ['id', 'requestId'] });
        if (data.length) {
            return new CommonResponse(true, 75483, "Data Retrieved Successfully", data)
        } else {
            return new CommonResponse(false, 4579, "There Is No branch names")
        }
    }

    async getRequestBranchWise(req: { companyCode: string, unitCode: string, branch?: string }): Promise<CommonResponse> {
        const data = await this.requestRepository.getRequestBranchWise(req);
        return data.length
            ? new CommonResponse(true, 75483, "Data Retrieved Successfully", data)
            : new CommonResponse(true, 4579, "There are no branch names", data);
    }


    async getRequests(filter: {
        fromDate?: Date; toDate?: Date;
        branchName?: string; staffId?: string; companyCode?: string;
        unitCode?: string;
    }) {
        const query = this.requestRepository.createQueryBuilder('req')
            .select([
                'req',
                'req.request_id AS requestNumber',
                'req.id AS requestId',
                'branch.name AS branchName',
                'req.created_date AS requestDate',
                'req.request_type AS requestType',
                'req.status AS status',
                'sf.name AS RequestTo'
            ])
            .leftJoin(BranchEntity, 'branch', 'req.branch_id = branch.id')
            .leftJoin(StaffEntity, 'sf', 'req.request_to = sf.id')
            .where('req.company_code = :companyCode', { companyCode: filter.companyCode })
            .andWhere('req.unit_code = :unitCode', { unitCode: filter.unitCode })
            .orderBy('req.created_date', 'DESC');

        if (filter.staffId) {
            query.andWhere('sf.staff_id = :staffId', { staffId: filter.staffId });
        }

        if (filter.branchName) {
            query.andWhere('branch.name = :branchName', { branchName: filter.branchName });
        }

        if (filter.fromDate) {
            query.andWhere('DATE(req.created_date) >= :fromDate', { fromDate: filter.fromDate });
        }

        if (filter.toDate) {
            query.andWhere('DATE(req.created_date) <= :toDate', { toDate: filter.toDate });
        }

        const result = await query.getRawMany();
        return result;
    }

}
