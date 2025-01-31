import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationEntity, NotificationEnum } from './entity/notification.entity';
import { GetNotificationDto, UpdateNotificationDto } from './dto/notification.dto';
import { RequestRaiseEntity } from 'src/request-raise/entity/request-raise.entity';
import { TicketsEntity } from 'src/tickets/entity/tickets.entity';
import { NotificationRepository } from './repo/notification.repo';
import { WorkAllocationEntity } from 'src/work-allocation/entity/work-allocation.entity';
import { NotificationAdapter } from './notification.adapter';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';

@Injectable()
export class NotificationService {
    constructor(
        private readonly notificationRepository: NotificationRepository,
        private readonly notificationAdapter: NotificationAdapter
    ) { }

    async createNotification(
        entity: RequestRaiseEntity | TicketsEntity | WorkAllocationEntity,
        type: NotificationEnum
    ): Promise<void> {
        let message: string;
        let createdAt: Date;
        let user: any;
        let branch: any;
        let companyCode: string;
        let unitCode: string;

        if (type === NotificationEnum.Request && entity instanceof RequestRaiseEntity) {
            message = entity.description;
            createdAt = entity.createdDate;
            user = entity.staffId; // Assuming staffId is a number
            branch = entity.branchId; // Assuming branchId is a number
            companyCode = entity.companyCode;
            unitCode = entity.unitCode;
        } else if (type === NotificationEnum.Ticket && entity instanceof TicketsEntity) {
            message = entity.problem;
            createdAt = entity.date;
            user = entity.staff; // Assuming staff is an object
            branch = entity.branch; // Assuming branch is an object
            companyCode = entity.companyCode;
            unitCode = entity.unitCode;
        } else if (type === NotificationEnum.Technician && entity instanceof WorkAllocationEntity) {
            if (entity.staffId?.designation === 'Technician' && entity.install) {
                message = `Technician allocated for ${entity.serviceOrProduct}`;
                createdAt = entity.date;
                user = entity.staffId; // Assuming staffId is a number
                branch = entity.branchId; // Assuming branchId is a number
                companyCode = entity.companyCode;
                unitCode = entity.unitCode;
            } else {
                return;
            }
        } else {
            throw new Error('Invalid entity type or notification type.');
        }

        const notificationEntity = this.notificationAdapter.convertDtoToEntity({
            message,
            createdAt,
            isRead: false,
            notificationType: type,
            userId: typeof user === 'object' ? user.id : user, // Fallback for primitive
            branchId: typeof branch === 'object' ? branch.id : branch, // Fallback for primitive
            companyCode,
            unitCode
        });

        await this.notificationRepository.insert(notificationEntity);
    }

    async markAsRead(ids: number[], updateNotificationDto: UpdateNotificationDto) {
        // If only a single id is provided, convert it to an array
        if (typeof ids === 'number') {
            ids = [ids];
        }

        const notifications = await this.notificationRepository.findByIds(ids);
        if (!notifications || notifications.length === 0) {
            throw new NotFoundException('Notifications not found');
        }

        // Update the 'isRead' field for all matching notifications
        notifications.forEach(notification => {
            notification.isRead = updateNotificationDto.isRead;
        });

        // Save the updated notifications
        return await this.notificationRepository.save(notifications);
    }




    async getAllNotifications(req: {
        branch?: string, companyCode?: string
        , unitCode?: string
    }): Promise<CommonResponse> {
        const data = await this.notificationRepository.getAllNotifications(req)
        if (!data) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", data)
        }

    }
}
