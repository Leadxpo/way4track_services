import { Injectable } from '@nestjs/common';
import { AppointmentIdDto } from './dto/appointment-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { AppointmentRepository } from './repo/appointement.repo';
import { AppointmentAdapter } from './appointement.adapter';
import { AppointmentDto } from './dto/appointement.dto';
import { AppointmentEntity } from './entity/appointement.entity';
import { CommonReq } from 'src/models/common-req';

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
            console.log(dto, "::::::::::")
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

            entity.appointmentId = `A-${nextNumber.toString().padStart(5, '0')}`;

            await this.appointmentRepository.insert(entity);
            return new CommonResponse(true, 201, 'Appointment details created successfully');
        } catch (error) {
            console.error(`Error creating appointment details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to create appointment details: ${error.message}`);
        }
    }


    async handleAppointmentDetails(dto: AppointmentDto): Promise<CommonResponse> {
        if (dto.id && dto.id !== null && dto.id !== undefined) {
            dto.id = Number(dto.id);
            return await this.updateAppointmentDetails(dto);
        } else {
            return await this.createAppointmentDetails(dto);
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
