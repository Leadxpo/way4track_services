import { Body, Controller, Post } from '@nestjs/common';
import { CommonResponse } from 'src/models/common-response';
import { UpdateNotificationDto } from './dto/notification.dto';
import { NotificationService } from './notification.service';


@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }
    @Post('markAsRead')
    async markAsRead(@Body() updateNotificationDto: UpdateNotificationDto) {
        await this.notificationService.markAsRead([updateNotificationDto.id], updateNotificationDto);
        return { status: 'success' };
    }

    // Mark multiple notifications as read
    @Post('markAllAsRead')
    async markAllAsRead(@Body() updateNotificationDto: UpdateNotificationDto) {
        const ids = updateNotificationDto.ids;  // Assuming `ids` is an array of notification ids
        await this.notificationService.markAsRead(ids, updateNotificationDto);
        return { status: 'success' };
    }

    @Post('getAllNotifications')
    async getAllNotifications(@Body() req: {
        ticketNumber?: string; branchName?: string; staffName?: string, companyCode?: string,
        unitCode?: string
    }) {
        try {
            return this.notificationService.getAllNotifications(req);
        } catch (error) {
            console.error('Error in delete vendor details:', error);
            return new CommonResponse(false, 500, 'Error deleting vendor details');
        }
    }
}
