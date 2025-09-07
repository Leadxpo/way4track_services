import { Injectable } from '@nestjs/common';
import { AppointmentIdDto } from './dto/appointment-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { AppointmentRepository } from './repo/appointement.repo';
import { AppointmentAdapter } from './appointement.adapter';
import { AppointmentDto } from './dto/appointement.dto';
import { AppointmentEntity } from './entity/appointement.entity';
import { CommonReq } from 'src/models/common-req';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class AppointmentService {
    private storage: Storage;
    private bucketName: string;

    constructor(
        private readonly appointmentRepository: AppointmentRepository,
        private readonly appointmentAdapter: AppointmentAdapter,
    ) {
        this.storage = new Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });

        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';

     }

    /**
     * Save or Update Appointment Details
     */
    async updateAppointmentDetails(dto: AppointmentDto,photoPath?: string[] | []): Promise<CommonResponse> {
        try {
            // Find the existing appointment by its ID and company/unit code
            const existingAppointment = await this.appointmentRepository.findOne({
                where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode }
            });

            if (!existingAppointment) {
                return new CommonResponse(false, 4002, 'Appointment not found for the provided details.');
            }
            if (photoPath?.length > 0 && existingAppointment?.image) {
                let existingFiles: string[] = [];

                try {
                    existingFiles = existingAppointment.image;
                } catch (err) {
                    // fallback in case it was stored as a string
                    existingFiles = existingAppointment.image;
                }

                for (const url of existingFiles) {
                    const existingFilePath = url.replace(`https://storage.googleapis.com/${this.bucketName}/`, '');
                    const file = this.storage.bucket(this.bucketName).file(existingFilePath);

                    try {
                        await file.delete();
                    } catch (error) {
                        console.error(`Error deleting file from GCS: ${error.message}`);
                    }
                }
            }

            // Update the existing appointment details
            const updatedEntity = this.appointmentAdapter.convertDtoToEntity(dto);
            if (photoPath) updatedEntity.image = photoPath;
            // Manually assign updated fields to the existing entity
            Object.assign(existingAppointment, updatedEntity);

            // Ensure that the entity is populated correctly before saving
            if (Object.keys(updatedEntity).length === 0) {
                throw new Error("No update values found, skipping update operation.");
            }
            await this.appointmentRepository.save(existingAppointment);

            return new CommonResponse(true, 65152, 'Appointment details updated successfully');
        } catch (error) {
            console.error(`Error updating appointment details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to update appointment details: ${error.message}`);
        }
    }

    async createAppointmentDetails(dto: AppointmentDto,photoPath?: string[] | []): Promise<CommonResponse> {
        try {
            const entity = this.appointmentAdapter.convertDtoToEntity(dto);

            const lastAppointment = await this.appointmentRepository
                .createQueryBuilder('appointment')
                .select('appointment.appointmentId')
                .orderBy('appointment.id', 'DESC')
                .limit(1)
                .getOne();

            let nextNumber = 1;
            if (lastAppointment && lastAppointment.appointmentId) {
                const match = lastAppointment.appointmentId.match(/\d+/);
                nextNumber = match ? parseInt(match[0]) + 1 : 1;
            }
            if (photoPath) {
                entity.image = photoPath;
            }
            entity.appointmentId = `A-${nextNumber.toString().padStart(5, '0')}`;

            await this.appointmentRepository.insert(entity);
            return new CommonResponse(true, 201, 'Appointment details created successfully');
        } catch (error) {
            console.error(`Error creating appointment details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to create appointment details: ${error.message}`);
        }
    }


    async handleAppointmentDetails(dto: AppointmentDto,photo?: Express.Multer.File[]): Promise<CommonResponse> {
        let photoPath: string[] = [];

        if (photo && photo.length > 0) {
            const bucket = this.storage.bucket(this.bucketName);

            for (const image of photo) {
                const uniqueFileName = `appointment/${Date.now()}-${image.originalname}`;
                const file = bucket.file(uniqueFileName);

                await file.save(image.buffer, {
                    contentType: image.mimetype,
                    resumable: false,
                });
                photoPath.push(`https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`);
            }
        }


        if (dto.id && dto.id !== null && dto.id !== undefined) {
            dto.id = Number(dto.id);
            return await this.updateAppointmentDetails(dto,photoPath);
        } else {
            return await this.createAppointmentDetails(dto,photoPath);
        }
    }


    /**
     * Get Appointment Details by ID
     */
    async getAppointmentDetails(dto: AppointmentIdDto): Promise<CommonResponse> {
        try {
            const appointments = await this.appointmentRepository.findOne({
                where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode },
                relations: ['voucherId', 'clientId', 'staffId', 'branchId']
            });


            if (!appointments) {
                throw new ErrorResponse(404, 'Appointment not found');
            }

            const result = this.appointmentAdapter.convertEntityToDto([appointments]);
            return new CommonResponse(true, 200, 'Details fetched successfully', result);
        } catch (error) {
            console.error('Error in getAppointmentDetails service:', error);
            throw new ErrorResponse(500, 'Error fetching appointment details');
        }
    }

    async getAllAppointmentDetails(dto: CommonReq): Promise<CommonResponse> {
        try {
            const appointments = await this.appointmentRepository.find({
                where: { companyCode: dto.companyCode, unitCode: dto.unitCode },
                relations: ['voucherId', 'clientId', 'staffId', 'branchId'],
                order: {
                    createdAt: 'DESC' // or 'ASC' if you want oldest first
                }
            });


            if (!appointments) {
                throw new ErrorResponse(404, 'Appointment not found');
            }

            const result = this.appointmentAdapter.convertEntityToDto(appointments);
            return new CommonResponse(true, 200, 'Details fetched successfully', result);
        } catch (error) {
            console.error('Error in getAppointmentDetails service:', error);
            throw new ErrorResponse(500, 'Error fetching appointment details');
        }
    }

    /**
     * Delete Appointment Details by ID
     */
    async deleteAppointmentDetails(dto: AppointmentIdDto): Promise<CommonResponse> {
        try {
            const appointmentExists = await this.appointmentRepository.findOne({
                where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode },
            });

            if (!appointmentExists) {
                throw new ErrorResponse(404, `Appointment with ID ${dto.id} does not exist`);
            }

            await this.appointmentRepository.delete(dto.id);
            return new CommonResponse(true, 200, 'Appointment details deleted successfully');
        } catch (error) {
            console.error('Error in deleteAppointmentDetails service:', error);
            throw new ErrorResponse(500, error.message);
        }
    }
}
