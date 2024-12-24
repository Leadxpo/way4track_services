import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { StaffEntity } from "../entity/staff.entity";
import { BranchEntity } from "src/branch/entity/branch.entity";
import { AttendanceEntity } from "src/attendence/entity/attendence.entity";
import { StaffAttendanceQueryDto } from "../dto/staff-date.dto";
import { LoginDto } from "src/login/dto/login.dto";
import { StaffSearchDto } from "../dto/staff-search.dto";
import { CommonReq } from "src/models/common-req";


@Injectable()

export class StaffRepository extends Repository<StaffEntity> {

    constructor(private dataSource: DataSource) {
        super(StaffEntity, dataSource.createEntityManager());
    }

    async payRoll(req: CommonReq) {
        const query = this.createQueryBuilder('sf')
            .select(`
                sf.staffId AS staffId,
                sf.name AS staffName,
                br.name AS branch,
                ROUND(DATEDIFF(CURDATE(), sf.joining_date) / 365.25, 2) AS inExperience,
                ROUND(
                    IFNULL(DATEDIFF(sf.joining_date, sf.before_experience) / 365.25, 0) + 
                    DATEDIFF(CURDATE(), sf.joining_date) / 365.25, 2
                ) AS overallExperience,
                sf.basic_salary AS basicSalary
            `)
            .leftJoin(BranchEntity, 'br', 'br.id = sf.branch_id')
            .where(`sf.company_code = "${req.companyCode}"`)
            .andWhere(`sf.unit_code = "${req.unitCode}"`)
            .getRawMany();
        return query;
    }

    async staffAttendanceDetails(req: StaffAttendanceQueryDto) {
        const { date, staffId } = req;

        const query = await this.createQueryBuilder('sf')
            .select([
                'DATE_FORMAT(a.day, "%Y-%m") AS formattedMonth',
                'sf.name AS staffName',
                'sf.phone_number AS phoneNumber',
                'sf.designation AS designation',
                'sf.dob AS dob',
                'sf.email AS email',
                'sf.aadhar_number AS aadharNumber',
                'sf.address AS address',
                'br.name AS branchName',
                'YEAR(a.day) AS year',
                'MONTH(a.day) AS month',
                'MIN(a.in_time) AS inTime',
                'MAX(a.out_time) AS outTime',
                'SUM(TIMESTAMPDIFF(HOUR, a.in_time, a.out_time)) AS totalHours',
                'GROUP_CONCAT(DISTINCT a.status) AS status'
            ])
            .leftJoin(BranchEntity, 'br', 'br.id = sf.branch_id')
            .leftJoin(AttendanceEntity, 'a', 'a.staff_id = sf.id')
            .where(`MONTH(a.day) =MONTH("${date}")`)
            .andWhere(`YEAR(a.day) =YEAR("${date}")`)
            .andWhere(`sf.staff_id ="${staffId}"`)
            .where(`sf.company_code = "${req.companyCode}"`)
            .andWhere(`sf.unit_code = "${req.unitCode}"`)
            .groupBy('sf.name, sf.phone_number, sf.designation, sf.dob, sf.email, sf.aadhar_number, sf.address, br.name, YEAR(a.day), MONTH(a.day),a.day')
            .orderBy('YEAR(a.day), MONTH(a.day)')
            .getRawMany();

        console.log(query);

        return query;
    }

    async LoginDetails(req: LoginDto) {
        const query = this.createQueryBuilder('sf')
            .select(`
                sf.staff_id AS staffId,
                sf.password AS staffPassword,
                sf.designation AS staffDesignation
            `)
            .where(
                `sf.staff_id = :staffId AND sf.password = :password AND sf.designation = :designation`,
                {
                    staffId: req.staffId,
                    password: req.password,
                    designation: req.designation,
                }
            )
            .andWhere(
                `sf.company_code = :companyCode AND sf.unit_code = :unitCode`,
                {
                    companyCode: req.companyCode,
                    unitCode: req.unitCode,
                }
            )
            .getRawOne();
        console.log(query, "____________");
        return query;
    }

    async getStaffSearchDetails(req: StaffSearchDto) {
        const query = this.createQueryBuilder('staff')
            .leftJoinAndSelect('staff.branch', 'branch')
            .where(`staff.company_code = "${req.companyCode}"`)
            .andWhere(`staff.unit_code = "${req.unitCode}"`)

        if (req.staffId) {
            query.andWhere('staff.staffId = :staffId', { staffId: req.staffId });
        }
        if (req.name) {
            query.andWhere('staff.name LIKE :name', { name: `%${req.name}%` });
        }
        if (req.branchName) {
            query.andWhere('branch.name LIKE :branchName', { branchName: `%${req.branchName}%` });
        }

        const staffDetails = await query.getMany();
        return staffDetails;
    }



}


