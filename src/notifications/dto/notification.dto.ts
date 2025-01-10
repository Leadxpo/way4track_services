import { NotificationEnum } from "../entity/notification.entity";

export class CreateNotificationDto {
    userId: number;
    message: string;
    branchId: number;
    notificationType: NotificationEnum;
    unitCode: string;
    companyCode: string;
    createdAt: Date;
    isRead: boolean
}


export class GetNotificationDto {
    id: number;
    user: string;
    message: string;
    isRead: boolean;
    branchId: number;
    branchName: string;
    userId: number;
    createdAt: Date;
    notificationType: NotificationEnum;
    unitCode: string;
    companyCode: string;

    // Constructor to initialize the DTO properties
    constructor(
        id: number,
        user: string,
        message: string,
        isRead: boolean,
        branchId: number,
        branchName: string,
        userId: number,
        createdAt: Date,
        notificationType: NotificationEnum,
        unitCode: string,
        companyCode: string,
    ) {
        this.id = id;
        this.user = user;
        this.message = message;
        this.isRead = isRead;
        this.branchId = branchId;
        this.branchName = branchName;
        this.userId = userId;
        this.createdAt = createdAt;
        this.notificationType = notificationType;
        this.unitCode = unitCode;
        this.companyCode = companyCode;
    }
}

export class UpdateNotificationDto {
    isRead: boolean;
    unitCode: string;
    companyCode: string;
    id?: number;        // For marking a single notification as read
    ids?: number[];     // For marking multiple notifications as read
}



