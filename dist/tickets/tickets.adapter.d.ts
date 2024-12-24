import { TicketsDto } from './dto/tickets.dto';
import { TicketsEntity } from './entity/tickets.entity';
import { GetTicketsResDto } from './dto/get-tickets-res.dto';
export declare class TicketsAdapter {
    convertDtoToEntity(dto: TicketsDto): TicketsEntity;
    convertEntityToDto(entities: TicketsEntity[]): GetTicketsResDto[];
}
