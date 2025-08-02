import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { NotificationEntity } from "../entity/notification.entity";
import { BranchEntity } from "src/branch/entity/branch.entity";
import { StaffEntity } from "src/staff/entity/staff.entity";
import { SubDealerEntity } from "src/sub-dealer/entity/sub-dealer.entity";


@Injectable()

export class NotificationRepository extends Repository<NotificationEntity> {

    constructor(private dataSource: DataSource) {
        super(NotificationEntity, dataSource.createEntityManager());
    }
    async getAllNotifications(req: {
        ticketNumber?: string;
        requestNumber?: string;
        branchName?: string;
        notifyStaffId?: number;
        subDealerId?: string;
        companyCode?: string;
        unitCode?: string
    }) {
        const groupedBranches = await this.createQueryBuilder('nt')
            .select(['branch.name AS branchName'])
            .leftJoin(BranchEntity, 'branch', 'nt.branch = branch.id')
            .where('nt.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('nt.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.branchName) {
            groupedBranches.andWhere('branch.name = :branchName', { branchName: req.branchName });
        }

        const result = await groupedBranches.groupBy('branch.name').getRawMany();

        const notificationsQuery = this.createQueryBuilder('nt')
            .select([
                'nt.id as id',
                'nt.user as user',
                'nt.message as message',
                'nt.created_at as createdAt',
                'branch.id AS branchId',
                'branch.name AS branchName',
                'nt.is_read AS isRead',
                'nt.notification_to AS notificationTo',
                'nt.request_id AS requestId',
                'nt.ticket_id AS ticketId',
                'staff.id AS userId',
                'staff.staff_id AS staffId',
                'staff.name AS user',
                'notifyTO.id AS notifyToId',
                'notifyTO.staff_id AS notifyToStaffId',
                'notifyTO.name AS notifyToName',
                'nt.notification_type as notificationType',
                'sb.sub_dealer_id as subDealerId',
                'sb.name as subDealerName'
            ])
            .leftJoin(BranchEntity, 'branch', 'nt.branch = branch.id')
            .leftJoin(StaffEntity, 'staff', 'nt.staff_id = staff.id')
            .leftJoin(StaffEntity, 'notifyTo', 'nt.notification_to = notifyTo.id')
            .leftJoin(SubDealerEntity, 'sb', 'sb.id = nt.sub_dealer_id')
            .where('nt.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('nt.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.subDealerId) {
            notificationsQuery.andWhere('sb.sub_dealer_id = :subDealerId', { subDealerId: req.subDealerId });
        }

        if (req.notifyStaffId) {
            notificationsQuery.andWhere('notifyTo.id = :notifyToStaffId', { notifyToStaffId: req.notifyStaffId });
        }

        const notifications = await notificationsQuery
            .orderBy('nt.created_at', 'ASC')
            .getRawMany();

        return { result, notifications };
    }

}