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
    async updateAppointmentDetails(dto: AppointmentDto): Promise<CommonResponse> {
        try {
            // Find the existing appointment by its ID and company/unit code
            const existingAppointment = await this.appointmentRepository.findOne({
                where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode }
            });
    
            if (!existingAppointment) {
                return new CommonResponse(false, 4002, 'Appointment not found for the provided details.');
            }
    
            // Update the existing appointment details
            Object.assign(existingAppointment, this.appointmentAdapter.convertDtoToEntity(dto));
            await this.appointmentRepository.save(existingAppointment);
    
            return new CommonResponse(true, 65152, 'Appointment details updated successfully');
        } catch (error) {
            console.error(`Error updating appointment details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to update appointment details: ${error.message}`);
        }
    }
    
    async createAppointmentDetails(dto: AppointmentDto): Promise<CommonResponse> {
        try {
            const entity = this.appointmentAdapter.convertDtoToEntity(dto);
    
            // Generate the appointmentId if not already provided
            const count = await this.appointmentRepository.count();
            entity.appointmentId = `A-${(count + 1).toString().padStart(5, '0')}`;
    
            await this.appointmentRepository.save(entity);
    
            return new CommonResponse(true, 201, 'Appointment details created successfully');
        } catch (error) {
            console.error(`Error creating appointment details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to create appointment details: ${error.message}`);
        }
    }
    
    async handleAppointmentDetails(dto: AppointmentDto): Promise<CommonResponse> {
        if (dto.id) {
            // If an ID is provided, update the appointment details
            return await this.updateAppointmentDetails(dto);
        } else {
            // If no ID is provided, create a new appointment
            return await this.createAppointmentDetails(dto);
        }
    }
    
    /**
     * Get Appointment Details by ID
     */
    async getAppointmentDetails(dto: AppointmentIdDto): Promise<CommonResponse> {
        try {
            const entity = await this.appointmentRepository.find({
                where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode }, relations: ['branchId', 'staffId', 'clientId']
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
                where: { id: dto.id ,companyCode: dto.companyCode, unitCode: dto.unitCode},
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
