import { Injectable } from '@nestjs/common';
import { NotificationEnum } from 'src/notifications/entity/notification.entity';
import { NotificationService } from 'src/notifications/notification.service';
import { CommonResponse } from '../models/common-response';
import { PaymentStatus } from 'src/product/dto/payment-status.enum';
import { DispatchDto } from './dto/dispatch.dto';
import { DispatchRepository } from './repo/dispatch.repo';
import { DispatchAdapter } from './dispatch.adapter';
import { ErrorResponse } from 'src/models/error-response';
import { DispatchEntity } from './entity/dispatch.entity';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { CommonReq } from 'src/models/common-req';
import { StaffRepository } from 'src/staff/repo/staff-repo';
import { Storage } from '@google-cloud/storage';
import { SubDealerRepository } from 'src/sub-dealer/repo/sub-dealer.repo';

@Injectable()
export class DispatchService {
    private storage: Storage;
    private bucketName: string;
    constructor(

        private readonly repo: DispatchRepository,
        private readonly adapter: DispatchAdapter,
        private readonly staffRepository: StaffRepository,
        private readonly subDealerRepository: SubDealerRepository,
    ) {
        this.storage = new Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });

        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }

    async handleDispatchDetails(dto: DispatchDto, dispatchBoximage?: Express.Multer.File[]): Promise<CommonResponse> {
        let photoPath: string[] = [];

        if (dispatchBoximage && dispatchBoximage.length > 0) {
            const bucket = this.storage.bucket(this.bucketName);

            for (const image of dispatchBoximage) {
                const uniqueFileName = `dispatch_photos/${Date.now()}-${image.originalname}`;
                const file = bucket.file(uniqueFileName);

                await file.save(image.buffer, {
                    contentType: image.mimetype,
                    resumable: false,
                });
                photoPath.push(`https://storage.googleapis.com/way4track-application/${uniqueFileName}`);
            }
        }
        if (dto.id && dto.id !== null) {
            return await this.updateDispatchDetails(dto, photoPath);
        } else {
            return await this.createDispatchDetails(dto, photoPath);
        }
    }


    async updateDispatchDetails(dto: DispatchDto, photoPath?: string[]): Promise<CommonResponse> {
        try {
            const Dispatch = await this.repo.findOne({
                where: { id: dto.id }
            });

            if (!Dispatch) {
                throw new Error('Work Allocation not found');
            }

            // Delete old files from GCS
            console.log("rrr :",(photoPath?.length > 0 && Dispatch?.dispatchBoximage))
            if (photoPath?.length > 0 && Dispatch?.dispatchBoximage) {
                let existingFiles: string[] = [];

                try {
                    existingFiles = Dispatch.dispatchBoximage;
                } catch (err) {
                    // fallback in case it was stored as a string
                    existingFiles = Dispatch.dispatchBoximage;
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

            const entity = this.adapter.convertDtoToEntity(dto);
            const updatedDispatch = {
                ...Dispatch,
                ...entity,
                dispatchBoximage: photoPath?.length > 0 ? photoPath : Dispatch.dispatchBoximage,
            };

            Object.assign(Dispatch, updatedDispatch);
            await this.repo.save(Dispatch);

            return new CommonResponse(true, 200, ' updated successfully with product details');
        } catch (error) {
            console.error(`Error updating work allocation: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to update work allocation: ${error.message}`);
        }
    }

    async createDispatchDetails(dto: DispatchDto, photoPath?: string[] | []): Promise<CommonResponse> {
        try {
            const newDispatch = await this.adapter.convertDtoToEntity(dto);

            if (dto.staffId) {
                const staff = await this.staffRepository.findOne({ where: { staffId: dto.staffId } });
                if (!staff) throw new Error(`Staff with ID ${dto.staffId} not found`);
                newDispatch.staffId = staff;
            }

            if (dto.subDealerId) {
                const subDealer = await this.subDealerRepository.findOne({ where: { subDealerId: dto.subDealerId } });
                if (!subDealer) throw new Error(`Sub-dealer with ID ${dto.subDealerId} not found`);
                newDispatch.subDealerId = subDealer;
            }
            if (photoPath) {
                newDispatch.dispatchBoximage = photoPath;
            }

            await this.repo.insert(newDispatch);
            return new CommonResponse(true, 200, 'Work allocation and technician details created successfully');
        } catch (error) {
            console.error(`Error creating dispatch details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to create work allocation details: ${error.message}`);
        }
    }



    async deleteDispatch(req: HiringIdDto): Promise<CommonResponse> {
        try {
            const allocation = await this.repo.findOne({ where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode } });
            if (!allocation) {
                return new CommonResponse(false, 404, 'Work Allocation not found');
            }
            await this.repo.delete(req.id);
            return new CommonResponse(true, 200, 'Work Allocation deleted successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getDispatchDetailsById(req: HiringIdDto): Promise<CommonResponse> {
        try {
            const allocation = await this.repo.findOne({
                where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode },
                relations: ['staffId', 'clientId', 'subDealerId', 'assignedProductsId']
            });

            if (!allocation) {
                return new CommonResponse(false, 404, 'Work Allocation not found');
            } else {

                return new CommonResponse(true, 200, 'Work Allocation fetched successfully', allocation);
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getDispatchDetails(req: CommonReq): Promise<CommonResponse> {
        try {
            const allocation = await this.repo.find({
                where: { companyCode: req.companyCode, unitCode: req.unitCode },
                relations: ['staffId', 'clientId', 'subDealerId'],
                order: {
                    createdAt: 'DESC'  // <- this is what adds the descending sort
                }
            });
            if (!allocation) {
                return new CommonResponse(false, 404, 'Work Allocation not found');
            } else {
                const data = await this.adapter.convertEntityToDto(allocation)
                console.log(data, "???")
                return new CommonResponse(true, 200, 'Work Allocation fetched successfully', data);
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getDispatchData(req: {
        fromDate?: string;
        toDate?: string;
        transportId?: string;
        companyCode?: string;
        unitCode?: string
    }): Promise<CommonResponse> {
        try {
            const allocation = await this.repo.getDispatchData(req);
            if (!allocation) {
                return new CommonResponse(false, 404, 'Work Allocation not found');
            } else {
                return new CommonResponse(true, 200, 'Work Allocation fetched successfully', allocation);
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }
}
