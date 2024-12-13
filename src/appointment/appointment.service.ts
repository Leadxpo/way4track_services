import { Injectable } from '@nestjs/common';
import { AppointmentIdDto } from './dto/appointment-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { AppointmentRepository } from './repo/appointement.repo';
import { AppointmentAdapter } from './appointement.adapter';
import { AppointmentDto } from './dto/appointement.dto';

@Injectable()
export class AppointmentService {
    constructor(
        private readonly appointmentRepository: AppointmentRepository,
        private readonly appointmentAdapter: AppointmentAdapter,
    ) { }

    /**
     * Save or Update Appointment Details
     */
    async saveAppointmentDetails(dto: AppointmentDto): Promise<CommonResponse> {
        try {
            const isUpdate = !!dto.id;
            let entity = isUpdate
                ? await this.appointmentRepository.findOne({ where: { id: dto.id } })
                : null;

            if (!entity) {
                entity = this.appointmentAdapter.convertDtoToEntity(dto);
            } else {
                Object.assign(entity, this.appointmentAdapter.convertDtoToEntity(dto));
            }

            await this.appointmentRepository.save(entity);

            const message = isUpdate
                ? 'Appointment details updated successfully'
                : 'Appointment details created successfully';
            return new CommonResponse(true, 200, message);
        } catch (error) {
            console.error('Error in saveAppointmentDetails service:', error);
            throw new ErrorResponse(500, error.message);
        }
    }

    /**
     * Get Appointment Details by ID
     */
    async getAppointmentDetails(dto: AppointmentIdDto): Promise<CommonResponse> {
        try {
            const entity = await this.appointmentRepository.find({
                where: { id: dto.id }, relations: ['branchId', 'staffId', 'clientId']
            });

            if (!entity) {
                throw new ErrorResponse(404, 'Appointment not found');
            }

            const result = this.appointmentAdapter.convertEntityToDto(entity);
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
                where: { id: dto.id },
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
