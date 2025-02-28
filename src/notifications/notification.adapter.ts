
import { Injectable } from '@nestjs/common'
import { NotificationEntity } from './entity/notification.entity';
import { CreateNotificationDto, GetNotificationDto } from './dto/notification.dto';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { StaffEntity } from 'src/staff/entity/staff.entity';


@Injectable()
export class NotificationAdapter {
    convertDtoToEntity(dto: CreateNotificationDto): NotificationEntity {
        const entity = new NotificationEntity();
        entity.message = dto.message;
        const branchEntity = new BranchEntity();
        branchEntity.id = dto.branchId;
        entity.branch = branchEntity;
        const staffEntity = new StaffEntity();
        staffEntity.id = dto.userId;
        entity.user = staffEntity;
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
                data.createdAt,
                data.notificationType,
                data.unitCode,
                data.companyCode,
            );
        });
    }

}