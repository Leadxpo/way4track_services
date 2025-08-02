
import { Injectable } from '@nestjs/common'
import { NotificationEntity } from './entity/notification.entity';
import { CreateNotificationDto, GetNotificationDto } from './dto/notification.dto';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { SubDealerEntity } from 'src/sub-dealer/entity/sub-dealer.entity';
import { RequestRaiseEntity } from 'src/request-raise/entity/request-raise.entity';
import { TicketsEntity } from 'src/tickets/entity/tickets.entity';


@Injectable()
export class NotificationAdapter {
    convertDtoToEntity(dto: CreateNotificationDto): NotificationEntity {
        const entity = new NotificationEntity();
        entity.message = dto.message;
        const requestEntity = new RequestRaiseEntity();
        requestEntity.id = dto.requestId;
        entity.request=requestEntity;
        const ticketEntity = new TicketsEntity();
        ticketEntity.id = dto.ticketId;
        entity.ticket=ticketEntity;
        const branchEntity = new BranchEntity();
        branchEntity.id = dto.branchId;
        entity.branch = branchEntity;
        const staffEntity = new StaffEntity();
        staffEntity.id = dto.userId;
        entity.user = staffEntity;
        const NotifystaffEntity = new StaffEntity();
        NotifystaffEntity.id = dto.notificationToId;
        entity.notificationTo = NotifystaffEntity;
        const sub = new SubDealerEntity();
        sub.id = dto.subDealerId;
        entity.notificationType=dto.notificationType;
        entity.subDealerId = sub;
        entity.companyCode = dto.companyCode
        entity.unitCode = dto.unitCode
        return entity;
    }
    convertEntityToDto(entity: NotificationEntity[]): GetNotificationDto[] {
        return entity.map((data) => {
            return new GetNotificationDto(
                data.id,
                data.user.name,
                data.message,
                data.isRead,
                data.branch.id,
                data.branch.branchName,
                data.user.id,
                data.notificationTo.id,
                data.createdAt,
                data.notificationType,
                data.unitCode,
                data.companyCode,
                data.subDealerId.id
            );
        });
    }

}