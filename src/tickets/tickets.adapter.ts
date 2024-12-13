import { Injectable } from '@nestjs/common';
import { TicketsDto } from './dto/tickets.dto';
import { TicketsEntity } from './entity/tickets.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { GetTicketsResDto } from './dto/get-tickets-res.dto';


@Injectable()
export class TicketsAdapter {
    convertDtoToEntity(dto: TicketsDto): TicketsEntity {
        const entity = new TicketsEntity();
        entity.problem = dto.problem;
        entity.date = dto.date;
        entity.addressingDepartment = dto.addressingDepartment

        const staff = new StaffEntity();
        staff.id = dto.staffId;
        entity.staff = staff;

        const branch = new BranchEntity();
        branch.id = dto.branchId;
        entity.branch = branch;

        return entity;
    }

   
    convertEntityToDto(entities: TicketsEntity[]): GetTicketsResDto[] {
        return entities.map((entity) => {
            return new GetTicketsResDto(
                entity.staff?.id || 0, 
                entity.staff?.name || '', 
                entity.staff?.phoneNumber || '', 
                entity.problem, 
                entity.date, 
                entity.branch?.id || 0, 
                entity.branch?.branchName || '', 
                entity.ticketNumber, 
                entity.addressingDepartment, 
            );
        });
    }
    

    
}