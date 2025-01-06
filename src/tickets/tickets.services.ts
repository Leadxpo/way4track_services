import { Injectable } from '@nestjs/common';
import { TicketsAdapter } from './tickets.adapter';
import { TicketsDto } from './dto/tickets.dto';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { TicketsRepository } from './repo/tickets.repo';
import { TicketsIdDto } from './dto/tickets-id.dto';
import { NotificationEnum } from 'src/notifications/entity/notification.entity';
import { NotificationService } from 'src/notifications/notification.service';
import { TicketsEntity } from './entity/tickets.entity';

@Injectable()
export class TicketsService {
    constructor(
        private readonly ticketsAdapter: TicketsAdapter,
        private readonly ticketsRepository: TicketsRepository,
        private readonly notificationService: NotificationService
    ) { }

    async updateTicketDetails(dto: TicketsDto): Promise<CommonResponse> {
        try {
            const existingTicket = await this.ticketsRepository.findOne({
                where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode },
            });

            if (!existingTicket) {
                return new CommonResponse(false, 4002, 'Ticket not found for the provided ID.');
            }

            // Update the ticket details
            Object.assign(existingTicket, this.ticketsAdapter.convertDtoToEntity(dto));
            await this.ticketsRepository.save(existingTicket);

            return new CommonResponse(true, 200, 'Ticket details updated successfully', existingTicket.ticketNumber);
        } catch (error) {
            console.error(`Error updating ticket details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to update ticket details: ${error.message}`);
        }
    }

    async createTicketDetails(dto: TicketsDto): Promise<CommonResponse> {
        let successResponse: CommonResponse;
        let newTicket: TicketsEntity;
        try {
            // Convert DTO to entity
            newTicket = this.ticketsAdapter.convertDtoToEntity(dto);

            // Generate a unique ticket number
            const count = await this.ticketsRepository.count();
            newTicket.ticketNumber = `Tickets-${(count + 1).toString().padStart(5, '0')}`;

            // Save the ticket data to the database
            const savedTicket = await this.ticketsRepository.save(newTicket);

            if (!savedTicket) {
                throw new Error('Failed to save ticket details');
            }

            // Send a success response after successfully saving the data
            successResponse = new CommonResponse(true, 201, 'Ticket details created successfully', newTicket.ticketNumber);

            // Send the notification after the successful creation of the ticket
            try {
                await this.notificationService.createNotification(savedTicket, NotificationEnum.Ticket);
            } catch (notificationError) {
                console.error(`Notification failed: ${notificationError.message}`, notificationError.stack);
                // Log the notification failure but don't affect the main operation
            }

            return successResponse;
        } catch (error) {
            console.error(`Error creating ticket details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to create ticket details: ${error.message}`);
        }
    }


    async handleTicketDetails(dto: TicketsDto): Promise<CommonResponse> {
        if (dto.id) {
            // If an ID is provided, update the ticket details
            return await this.updateTicketDetails(dto);
        } else {
            // If no ID is provided, create a new ticket record
            return await this.createTicketDetails(dto);
        }
    }



    async deleteTicketDetails(req: TicketsIdDto): Promise<CommonResponse> {
        try {
            const ticket = await this.ticketsRepository.findOne({ where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode } });

            if (!ticket) {
                return new CommonResponse(false, 404, 'Ticket not found');
            }

            await this.ticketsRepository.delete(ticket.id);
            return new CommonResponse(true, 200, 'Ticket details deleted successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getTicketDetailsById(req: TicketsIdDto): Promise<CommonResponse> {
        try {
            const ticket = await this.ticketsRepository.find({ where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode }, relations: ['staff', 'branch'] });

            if (!ticket) {
                return new CommonResponse(false, 404, 'Ticket not found');
            }

            const dto = this.ticketsAdapter.convertEntityToDto(ticket);
            return new CommonResponse(true, 200, 'Ticket details fetched successfully', dto);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getTicketDetails(req: {
        ticketNumber?: string; branchName?: string; staffName?: string, companyCode?: string,
        unitCode?: string
    }): Promise<CommonResponse> {
        const VoucherData = await this.ticketsRepository.getTicketDetails(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }
}
