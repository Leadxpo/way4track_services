import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { StaffEntity } from "../entity/staff.entity";
import { BranchEntity } from "src/branch/entity/branch.entity";
import { AttendanceEntity } from "src/attendence/entity/attendence.entity";
import { StaffAttendanceQueryDto } from "../dto/staff-date.dto";


@Injectable()

export class StaffRepository extends Repository<StaffEntity> {

    constructor(private dataSource: DataSource) {
        super(StaffEntity, dataSource.createEntityManager());
    }

    async payRoll() {
        const query = this.createQueryBuilder('sf')
            .select(`
                sf.staffId AS staffId,
                sf.name AS staffName,
                br.name AS branch,
                ROUND(DATEDIFF(CURDATE(), sf.joining_date) / 365.25, 2) AS inExperience,
                ROUND(
                    DATEDIFF(sf.joining_date, sf.before_experience) / 365.25 + 
                    DATEDIFF(CURDATE(), sf.joining_date) / 365.25, 2
                ) AS overallExperience,
                 sf.basic_salary as basicSalary
            `)
            .leftJoin(BranchEntity, 'br', 'br.id = sf.branch_id')
            .getRawMany();
        return query;
    }

    async staffAttendanceDetails(req: StaffAttendanceQueryDto) {
        const { date } = req;

        const query = await this.createQueryBuilder('sf')
            .select(`
                DATE_FORMAT(a.day, '%Y-%m') AS formattedMonth,
                sf.staff_id AS staffId,
                sf.name AS staffName,
                sf.phone_number AS phoneNumber,
                sf.designation AS designation,
                sf.dob AS dob,
                sf.email AS email,
                sf.aadhar_number AS aadharNumber,
                sf.address AS address,
                br.branch_name AS branchName,
                YEAR(a.day) AS year,
                MONTH(a.day) AS month,
                MIN(a.in_time) AS inTime,  -- Using MIN to avoid grouping by day
                MAX(a.out_time) AS outTime,  -- Using MAX for the latest out_time
                SUM(TIMESTAMPDIFF(HOUR, a.in_time, a.out_time)) AS totalHours,
                GROUP_CONCAT(DISTINCT a.status) AS status  -- Aggregating status if there are multiple statuses
            `)
            .leftJoin(BranchEntity, 'br', 'br.id = sf.branch_id')
            .leftJoin(AttendanceEntity, 'a', 'a.staff_id = sf.id')
            .where('YEAR(a.day) = :year', { year: date || new Date().getFullYear() })
            .andWhere('MONTH(a.day) = :month', { month: date || new Date().getMonth() + 1 })
            .orderBy('YEAR(a.day), MONTH(a.day)')
            .getRawMany();

        console.log(query);

        return query;
    }



}


