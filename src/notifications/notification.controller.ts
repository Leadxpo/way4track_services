import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { GetNotificationDto, UpdateNotificationDto } from './dto/notification.dto';


@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }
    @Post('markAsRead')
    async markAsRead(
        @Body('id') id: number,
        @Body() updateNotificationDto: UpdateNotificationDto,
    ) {
        return await this.notificationService.markAsRead(id, updateNotificationDto);
    }

    @Post('getAllNotifications')
    async getAllNotifications(@Body('branchId') branchId?: number): Promise<GetNotificationDto[]> {
        return this.notificationService.getAllNotifications(branchId);
    }
}
