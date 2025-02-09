import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CommonResponse } from 'src/models/common-response';
import { UpdateNotificationDto } from './dto/notification.dto';
import { NotificationService } from './notification.service';


@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }


    @Post('markAllAsRead')
    async markAllAsRead(@Body() updateNotificationDto: UpdateNotificationDto) {
        if (!updateNotificationDto.ids || updateNotificationDto.ids.length === 0) {
            throw new BadRequestException('No valid notification IDs provided');
        }

        await this.notificationService.markAsRead(updateNotificationDto);
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
