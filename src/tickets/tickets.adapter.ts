import { Injectable } from '@nestjs/common';
import { TicketsDto } from './dto/tickets.dto';
import { TicketsEntity } from './entity/tickets.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { GetTicketsResDto } from './dto/get-tickets-res.dto';
import { SubDealerEntity } from 'src/sub-dealer/entity/sub-dealer.entity';
import { DesignationEntity } from 'src/designation/entity/designation.entity';
import { SubDelaerStaffEntity } from 'src/sub-dealer-staff/entity/sub-dealer-staff.entity';


@Injectable()
export class TicketsAdapter {
    convertDtoToEntity(dto: TicketsDto): TicketsEntity {
        const entity = new TicketsEntity();
        entity.problem = dto.problem;
        entity.remark = dto.remark;
        entity.date = dto.date;
        // entity.addressingDepartment = dto.addressingDepartment

        const staff = new StaffEntity();
        staff.id = dto.staffId;
        entity.staff = staff;

        if (dto.reportingStaffId) {
            const repstaff = new StaffEntity();
            repstaff.id = dto.reportingStaffId;
            entity.reportingStaff = repstaff;
        }

        if (dto.subDealerId) {
            const sub = new SubDealerEntity();
            sub.id = dto.subDealerId;
            entity.subDealerId = sub;
        }
        if (dto.subDealerStaffId) {
            const sub = new SubDelaerStaffEntity();
            sub.id = dto.subDealerStaffId;
            entity.subDealerStaffId = sub;
        }

        const branch = new BranchEntity();
        branch.id = dto.branchId;
        entity.branch = branch;
        entity.companyCode = dto.companyCode
        entity.unitCode = dto.unitCode
        entity.workStatus = dto.workStatus
        entity.description = dto.description
        if (dto.id) {
            entity.id = dto.id;  // This might not be necessary for a new ticket
        }
        const des = new DesignationEntity()
        des.id = dto.designationRelation
        entity.designationRelation = des
        return entity;
    }


    convertEntityToDto(entities: TicketsEntity[]): GetTicketsResDto[] {
        return entities.map((entity) => {
            return new GetTicketsResDto(
                entity.staff?.id || null,
                entity.staff?.name || '',
                entity.staff?.phoneNumber || '',
                entity.reportingStaff?.id || null,
                entity.reportingStaff?.name || '',
                entity.reportingStaff?.phoneNumber || '',
                entity.problem,
                entity.remark,
                entity.date,
                entity.branch?.id || 0,
                entity.branch?.branchName || '',
                entity.ticketNumber,
                entity.companyCode,
                entity.unitCode,
                entity.workStatus,
                entity.description,
                entity.subDealerId?.id,
                entity.subDealerId?.name,
                entity.designationRelation?.id,
                entity.designationRelation?.designation,
                entity.subDealerStaffId?.id
            );
        });
    }



}
