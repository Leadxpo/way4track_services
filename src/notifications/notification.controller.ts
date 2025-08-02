import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CommonResponse } from 'src/models/common-response';
import { UpdateNotificationDto } from './dto/notification.dto';
import { NotificationService } from './notification.service';
import { CommonReq } from 'src/models/common-req';


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
        ticketNumber?: string; requestNumber?: string;branchName?: string; notifyStaffId?: number; companyCode?: string;
        unitCode?: string;subDealerId?: string;
    }) {
        try {
            return this.notificationService.getAllNotifications(req);
        } catch (error) {
            console.error('Error in delete vendor details:', error);
            return new CommonResponse(false, 500, 'Error deleting vendor details');
        }
    }

    @Post('getNotifications')
    async getNotifications(@Body() req: CommonReq) {
        try {
            return this.notificationService.getNotifications(req);
        } catch (error) {
            console.error('Error in delete vendor details:', error);
            return new CommonResponse(false, 500, 'Error deleting vendor details');
        }
    }
}
