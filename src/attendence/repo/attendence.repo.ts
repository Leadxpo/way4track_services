import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { AttendanceEntity } from "../entity/attendence.entity";
import { StaffEntity } from "src/staff/entity/staff.entity";


@Injectable()

export class AttendenceRepository extends Repository<AttendanceEntity> {

    constructor(private dataSource: DataSource) {
        super(AttendanceEntity, dataSource.createEntityManager());
    }

    // async getStaffAttendance(req: { staffId?: string; fromDate?: string; toDate?: string; branchName?: string; companyCode?: string; unitCode?: string }) {
    //     const query = this.createQueryBuilder('a')
    //         .select([
    //             'a.id AS id',
    //             'a.staff_id AS staffId',
    //             'a.day AS day',
    //             'a.branch_name AS branchName',
    //             'a.in_time AS inTime',
    //             'a.out_time AS outTime',
    //             'a.in_time_remark AS inTimeRemark',
    //             'a.out_time_remark AS outTimeRemark',
    //             'a.status AS status',
    //             'staff.name AS staffName',
    //         ])
    //         .leftJoin(StaffEntity, 'staff', 'staff.id = a.staff_id')
    //         .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
    //         .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode });

    //     if (req.staffId) {
    //         query.andWhere('staff.staff_id = :staffId', { staffId: req.staffId });
    //     }

    //     if (req.branchName) {
    //         query.andWhere('a.branch_name = :branchName', { branchName: req.branchName });
    //     }
    //     if (req.fromDate) {
    //         query.andWhere('DATE(a.day) >= :fromDate', { fromDate: req.fromDate });
    //     }

    //     if (req.toDate) {
    //         query.andWhere('DATE(a.day) <= :toDate', { toDate: req.toDate });
    //     }
    //     // if (req.date) {
    //     //     const formattedDate = new Date(req.date).toISOString().split('T')[0];
    //     //     query.andWhere('DATE(a.day) = :date', { date: formattedDate });

    //     // }

    //     return await query.getRawMany(); // Ensure you await the query execution
    // }

    async getStaffAttendance(req: { staffId?: string; fromDate?: string; toDate?: string; branchName?: string; companyCode?: string; unitCode?: string }) {
        const query = this.createQueryBuilder('a')
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
            .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.staffId) {
            query.andWhere('staff.staff_id = :staffId', { staffId: req.staffId });
        }

        if (req.branchName) {
            query.andWhere('a.branch_name = :branchName', { branchName: req.branchName });
        }

        if (req.fromDate) {
            query.andWhere('DATE(a.day) >= :fromDate', { fromDate: req.fromDate });
        }

        if (req.toDate) {
            query.andWhere('DATE(a.day) <= :toDate', { toDate: req.toDate });
        }

        query.orderBy('a.day', 'ASC'); // Sorting by date in ascending order

        return await query.getRawMany();
    }



}