import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { AttendanceEntity } from "../entity/attendence.entity";
import { StaffEntity } from "src/staff/entity/staff.entity";


@Injectable()

export class AttendenceRepository extends Repository<AttendanceEntity> {

    constructor(private dataSource: DataSource) {
        super(AttendanceEntity, dataSource.createEntityManager());
    }

    async getStaffAttendance(req: { staffId?: string }) {
        const query = await this.createQueryBuilder('a')
            .select([
                'a.id AS id',
                'a.staff_id AS staffId',
                'a.day AS day',
                'a.branch_name AS branchName',
                'a.in_time AS inTime',
                'a.out_time AS outTime',
                'a.in_time_remark AS inTimeRemark',
                'a.out_time_remark AS outTimeRemark',
                'a.status AS status',
                'staff.name AS staffName',
            ])
            .leftJoin(StaffEntity, 'staff', 'staff.id = a.staff_id')
            .andWhere('staff.staff_id = :staffId', { staffId: req.staffId })
            .getRawMany();

        return query;
    }

}