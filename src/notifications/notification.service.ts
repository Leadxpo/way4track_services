import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { NotificationEntity, NotificationEnum } from './entity/notification.entity';
import { GetNotificationDto, UpdateNotificationDto } from './dto/notification.dto';
import { RequestRaiseEntity } from 'src/request-raise/entity/request-raise.entity';
import { TicketsEntity } from 'src/tickets/entity/tickets.entity';
import { NotificationRepository } from './repo/notification.repo';
import { WorkAllocationEntity } from 'src/work-allocation/entity/work-allocation.entity';
import { NotificationAdapter } from './notification.adapter';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { In } from 'typeorm';
import { TechnicianWorksEntity } from 'src/technician-works/entity/technician-works.entity';
import { TechinicianWoksRepository } from 'src/technician-works/repo/technician-works.repo';


@Injectable()
export class NotificationService {
    constructor(
        private readonly notificationRepository: NotificationRepository,
        private readonly notificationAdapter: NotificationAdapter,
        private readonly technicianWorksRepository: TechinicianWoksRepository,
    ) { }

    async createNotification(
        entity: RequestRaiseEntity | TicketsEntity | TechnicianWorksEntity,
        type: NotificationEnum
    ): Promise<void> {
        let message: string;
        let createdAt: Date;
        let user: any;
        let branch: any;
        let companyCode: string;
        let unitCode: string;
        let subDealer: any;


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
        }
        else if (type === NotificationEnum.TechnicianWorks && 'workStatus' in entity && 'subDealerId' in entity) {
            const subDealerId = typeof entity.subDealerId === 'object' ? entity.subDealerId.id : entity.subDealerId;

            if (!subDealerId) {
                console.warn('SubDealerId is missing or invalid for notification type TechnicianWorks');
                return;
            }

            const pendingWorks = await this.technicianWorksRepository.getSubDealerPendingPayments({ subDealerId });
            const pending = pendingWorks?.subDealer || {};

            message = `Pending payment for activated work: ${pending.totalActivateWork || 0}, pending: ${pending.totalPendingWork || 0}, total amount: ₹${pending.totalAmount || 0}`;
            createdAt = new Date();
            subDealer = subDealerId;
            companyCode = entity.companyCode;
            unitCode = entity.unitCode;
        }

        else {
            throw new Error('Invalid entity type or notification type.');
        }
        //&& entity.install
        const notificationEntity = this.notificationAdapter.convertDtoToEntity({
            message,
            createdAt,
            isRead: false,
            notificationType: type,
            userId: typeof user === 'object' ? user.id : user, // Fallback for primitive
            branchId: typeof branch === 'object' ? branch.id : branch, // Fallback for primitive
            companyCode,
            unitCode,
            subDealerId: typeof subDealer === 'object' ? subDealer.id : subDealer
        });

        await this.notificationRepository.insert(notificationEntity);
    }

    async markAsRead(updateNotificationDto: UpdateNotificationDto) {
        const ids = updateNotificationDto.ids ?? (updateNotificationDto.id ? [updateNotificationDto.id] : []);

        if (!ids.length) {
            throw new BadRequestException('No valid notification IDs provided');
        }

        const result = await this.notificationRepository.update(
            { id: In(ids) },
            { isRead: updateNotificationDto.isRead }
        );

        if (result.affected === 0) {
            throw new NotFoundException('Notifications not found');
        }

        return { message: `${result.affected} notifications marked as read` };
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
