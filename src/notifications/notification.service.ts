import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationEntity, NotificationEnum } from './entity/notification.entity';
import { GetNotificationDto, UpdateNotificationDto } from './dto/notification.dto';
import { RequestRaiseEntity } from 'src/request-raise/entity/request-raise.entity';
import { TicketsEntity } from 'src/tickets/entity/tickets.entity';
import { NotificationRepository } from './repo/notification.repo';
import { WorkAllocationEntity } from 'src/work-allocation/entity/work-allocation.entity';
import { NotificationAdapter } from './notification.adapter';

@Injectable()
export class NotificationService {
    constructor(
        private readonly notificationRepository: NotificationRepository,
        private readonly notificationAdapter: NotificationAdapter
    ) { }

    async createNotification(entity: RequestRaiseEntity | TicketsEntity | WorkAllocationEntity, type: NotificationEnum): Promise<void> {
        let message: string;
        let createdAt: Date;
        let user: any;
        let branch: any;
        let companyCode: string;
        let unitCode: string;

        if (type === NotificationEnum.Request && entity instanceof RequestRaiseEntity) {
            message = entity.description;
            createdAt = entity.createdDate;
            user = entity.staffId;
            branch = entity.branchId;
            companyCode = entity.companyCode;
            unitCode = entity.unitCode;
        } else if (type === NotificationEnum.Ticket && entity instanceof TicketsEntity) {
            message = entity.problem;
            createdAt = entity.date;
            user = entity.staff;
            branch = entity.branch;
            companyCode = entity.companyCode;
            unitCode = entity.unitCode;
        } else if (type === NotificationEnum.Technician && entity instanceof WorkAllocationEntity) {
            if (entity.staffId?.designation === 'Technician' && entity.install) {
                message = `Technician allocated for ${entity.serviceOrProduct}`;
                createdAt = entity.date;
                user = entity.staffId;
                branch = entity.branchId;
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
            userId: user.id,
            branchId: branch.id,
            companyCode,
            unitCode
        });

        await this.notificationRepository.save(notificationEntity);
    }



    async markAsRead(id: number, updateNotificationDto: UpdateNotificationDto) {
        const notification = await this.notificationRepository.findOne({ where: { id } });
        if (!notification) {
            throw new NotFoundException('Notification not found');
        }
        notification.isRead = updateNotificationDto.isRead;
        return await this.notificationRepository.save(notification);
    }

    async getAllNotifications(branchId?: number): Promise<GetNotificationDto[]> {
        let data: NotificationEntity[];

        if (branchId) {
            data = await this.notificationRepository.find({
                where: { branch: { id: branchId } },
                order: { createdAt: 'DESC' },
            });
        } else {
            data = await this.notificationRepository.find({
                order: { createdAt: 'DESC' },
            });
        }

        // Use the adapter to convert the notification entities to DTOs
        return this.notificationAdapter.convertEntityToDto(data);
    }
}
