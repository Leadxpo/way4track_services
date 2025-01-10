import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { NotificationEntity } from "../entity/notification.entity";
import { BranchEntity } from "src/branch/entity/branch.entity";
import { StaffEntity } from "src/staff/entity/staff.entity";


@Injectable()

export class NotificationRepository extends Repository<NotificationEntity> {

    constructor(private dataSource: DataSource) {
        super(NotificationEntity, dataSource.createEntityManager());
    }

    async getAllNotifications(req: {
        branch?: string, companyCode?: string
        , unitCode?: string
    }) {
        const groupedBranches = await this.createQueryBuilder('nt')
            .select([
                'branch.name AS branchName'
            ])
            .leftJoin(BranchEntity, 'branch', 'nt.branch=branch.id')
            .where(`nt.company_code = "${req.companyCode}"`)
            .andWhere(`nt.unit_code = "${req.unitCode}"`)
        if (req.branch) {
            groupedBranches.andWhere('branch.name = :branchName', { branchName: req.branch });
        }
        const result = await groupedBranches.groupBy('branch.name').getRawMany();
        const notifications = await this.createQueryBuilder('nt')
            .select([
                'nt.id as id',
                'nt.user as user',
                'nt.message as message',
                'nt.created_at as createdAt',
                'branch.id AS branchId',
                'branch.name AS branchName',
                'nt.is_read AS isRead',
                'staff.id AS userId',
                'staff.name AS user',
                'nt.notification_type as notificationType'
            ])
            .leftJoin(BranchEntity, 'branch', 'nt.branch=branch.id')
            .leftJoin(StaffEntity, 'staff', 'nt.staff_id=staff.id')
            .where(`nt.company_code = "${req.companyCode}"`)
            .andWhere(`nt.unit_code = "${req.unitCode}"`)
            .orderBy('branch.name', 'ASC')
            .getRawMany();

        return { result, notifications };
    }
}