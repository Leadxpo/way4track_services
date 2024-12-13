import { Injectable } from '@nestjs/common';
import { TicketsAdapter } from './tickets.adapter';
import { TicketsDto } from './dto/tickets.dto';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { TicketsRepository } from './repo/tickets.repo';
import { TicketsIdDto } from './dto/tickets-id.dto';

@Injectable()
export class TicketsService {
    constructor(
        private readonly ticketsAdapter: TicketsAdapter,
        private readonly ticketsRepository: TicketsRepository,
    ) { }

    async saveTicketDetails(dto: TicketsDto): Promise<CommonResponse> {
        try {
            let entity = await this.ticketsRepository.findOne({ where: { id: dto.id } });

            if (!entity) {
                entity = this.ticketsAdapter.convertDtoToEntity(dto);

                const count = await this.ticketsRepository.count();
                entity.ticketNumber = `Tickets-${(count + 1).toString().padStart(5, '0')}`;
            } else {
                Object.assign(entity, this.ticketsAdapter.convertDtoToEntity(dto));
            }

            await this.ticketsRepository.save(entity);

            const message = dto.id
                ? 'Ticket details updated successfully'
                : 'Ticket details created successfully';

            return new CommonResponse(true, 201, message, entity.ticketNumber);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }


    async deleteTicketDetails(req: TicketsIdDto): Promise<CommonResponse> {
        try {
            const ticket = await this.ticketsRepository.findOne({ where: { id: req.id } });

            if (!ticket) {
                return new CommonResponse(false, 404, 'Ticket not found');
            }

            await this.ticketsRepository.delete(ticket.id);
            return new CommonResponse(true, 200, 'Ticket details deleted successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getTicketDetails(req: TicketsIdDto): Promise<CommonResponse> {
        try {
            const ticket = await this.ticketsRepository.find({ where: { id: req.id }, relations: ['staff', 'branch'] });

            if (!ticket) {
                return new CommonResponse(false, 404, 'Ticket not found');
            }

            const dto = this.ticketsAdapter.convertEntityToDto(ticket);
            return new CommonResponse(true, 200, 'Ticket details fetched successfully', dto);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }
}
