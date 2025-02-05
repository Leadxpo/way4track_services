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

    async payRoll(req: CommonReq, branch?: string) {
        const query = this.createQueryBuilder('sf')
            .select(`
                sf.staff_id AS staffId,
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
        if (branch) {
            query.andWhere('br.name LIKE :branchName', { branchName: `%${branch}%` });
        }
        const payRollData = query.getRawMany();
        return payRollData;
    }


    // async staffAttendanceDetails(req: StaffAttendanceQueryDto) {
    //     const { date, staffId, companyCode, unitCode } = req;

    //     // Ensure the date parameter is in a valid format
    //     const selectedDate = new Date(date);
    //     const year = selectedDate.getFullYear();
    //     const month = selectedDate.getMonth() + 1;

    //     // Calculate the first and last day of the month
    //     const firstDayOfMonth = new Date(year, selectedDate.getMonth(), 1);
    //     const lastDayOfMonth = new Date(year, selectedDate.getMonth() + 1, 0); // Last day of the month

    //     const query = await this.createQueryBuilder('sf')
    //         .select(`
    //             DATE_FORMAT(a.day, "%Y-%m-%d") AS day,
    //             sf.name AS name,
    //             sf.phone_number AS phoneNumber,
    //             sf.designation AS designation,
    //             sf.dob AS dob,
    //             sf.email AS email,
    //             sf.aadhar_number AS aadharNumber,
    //             sf.address AS address,
    //             br.name AS branchName,
    //             MIN(a.in_time) AS inTime,
    //             MAX(a.out_time) AS outTime,
    //             TIMESTAMPDIFF(HOUR, MIN(a.in_time), MAX(a.out_time)) AS totalHours,
    //             GROUP_CONCAT(DISTINCT a.status) AS status
    //         `)
    //         .leftJoin(BranchEntity, 'br', 'br.id = sf.branch_id')
    //         .leftJoin(AttendanceEntity, 'a', 'a.staff_id = sf.id')
    //         .where('sf.staff_id = :staffId', { staffId })
    //         .andWhere('sf.company_code = :companyCode', { companyCode })
    //         .andWhere('sf.unit_code = :unitCode', { unitCode })
    //         .andWhere('a.day BETWEEN :startDate AND :endDate', {
    //             startDate: firstDayOfMonth,
    //             endDate: lastDayOfMonth,
    //         })
    //         .groupBy(`
    //             a.day,
    //             sf.name,
    //             sf.phone_number,
    //             sf.designation,
    //             sf.dob,
    //             sf.email,
    //             sf.aadhar_number,
    //             sf.address,
    //             br.name
    //         `)
    //         .orderBy('a.day')
    //         .getRawMany();

    //     // Create a response structure for all days of the month
    //     const daysInMonth = new Date(year, month, 0).getDate();
    //     const allDaysOfMonth = Array.from({ length: daysInMonth }, (_, i) => {
    //         const currentDate = new Date(year, month - 1, i + 1);
    //         const formattedDate = currentDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    //         const attendance = query.find((q) => q.day === formattedDate);

    //         return {
    //             day: formattedDate,
    //             name: attendance?.name || null,
    //             phoneNumber: attendance?.phoneNumber || null,
    //             designation: attendance?.designation || null,
    //             dob: attendance?.dob || null,
    //             email: attendance?.email || null,
    //             aadharNumber: attendance?.aadharNumber || null,
    //             address: attendance?.address || null,
    //             branchName: attendance?.branchName || null,
    //             inTime: attendance?.inTime || null,
    //             outTime: attendance?.outTime || null,
    //             totalHours: attendance?.totalHours || 0,
    //             status: attendance?.status || 'Absent', // Default to 'Absent' if no record is found
    //         };
    //     });

    //     return allDaysOfMonth;
    // }

    async staffAttendanceDetails(req: StaffAttendanceQueryDto) {
        const { date, staffId, companyCode, unitCode } = req;

        const selectedDate = new Date(date);
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1;
        const firstDayOfMonth = new Date(year, selectedDate.getMonth(), 1);
        const lastDayOfMonth = new Date(year, selectedDate.getMonth() + 1, 0);

        const query = await this.createQueryBuilder('sf')
            .select(`
                DATE_FORMAT(a.day, "%Y-%m-%d") AS day,
                sf.name AS name,
                sf.phone_number AS phoneNumber,
                sf.designation AS designation,
                sf.dob AS dob,
                sf.email AS email,
                sf.aadhar_number AS aadharNumber,
                sf.address AS address,
                br.name AS branchName,
                a.time_records AS timeRecords,
                GROUP_CONCAT(DISTINCT a.status) AS status
            `)
            .leftJoin(BranchEntity, 'br', 'br.id = sf.branch_id')
            .leftJoin(AttendanceEntity, 'a', 'a.staff_id = sf.id')
            .where('sf.staff_id = :staffId', { staffId })
            .andWhere('sf.company_code = :companyCode', { companyCode })
            .andWhere('sf.unit_code = :unitCode', { unitCode })
            .andWhere('a.day BETWEEN :startDate AND :endDate', {
                startDate: firstDayOfMonth,
                endDate: lastDayOfMonth,
            })
            .groupBy(`
                a.day,
                sf.name,
                sf.phone_number,
                sf.designation,
                sf.dob,
                sf.email,
                sf.aadhar_number,
                sf.address,
                br.name,
                a.time_records
            `)
            .orderBy('a.day')
            .getRawMany();

        const daysInMonth = new Date(year, month, 0).getDate();

        const allDaysOfMonth = Array.from({ length: daysInMonth }).map(async (_, i) => {
            const currentDate = new Date(year, month - 1, i + 1);
            const formattedDate = currentDate.toISOString().split('T')[0];
            const attendance = query.find(q => q.day === formattedDate);

            let timeRecords = [];
            let totalHours = 0;

            if (attendance?.timeRecords) {
                try {
                    // Ensure `timeRecords` is parsed only if it is a string
                    timeRecords = typeof attendance.timeRecords === 'string'
                        ? JSON.parse(attendance.timeRecords)
                        : attendance.timeRecords;

                    if (Array.isArray(timeRecords)) {
                        totalHours = await this.calculateTotalHours(timeRecords);
                    }
                } catch (error) {
                    console.error("Invalid JSON in timeRecords:", attendance?.timeRecords);
                    timeRecords = [];
                }
            }

            console.log(timeRecords, "timeRecords");

            return {
                day: formattedDate,
                name: attendance?.name || null,
                phoneNumber: attendance?.phoneNumber || null,
                designation: attendance?.designation || null,
                dob: attendance?.dob || null,
                email: attendance?.email || null,
                aadharNumber: attendance?.aadharNumber || null,
                address: attendance?.address || null,
                branchName: attendance?.branchName || null,
                inTime: timeRecords.map(r => r.inTime) || null,
                outTime: timeRecords.map(r => r.outTime) || null,
                totalHours: totalHours,
                status: attendance?.status || 'Absent',
                timeRecords: timeRecords
            };
        });

        return Promise.all(allDaysOfMonth);
    }


    async calculateTotalHours(timeRecords: { inTime: Date; outTime: Date }[]): Promise<number> {
        return timeRecords.reduce((total, record) => {
            const inTime = new Date(record.inTime).getTime();
            const outTime = new Date(record.outTime).getTime();
            return total + (outTime - inTime) / (1000 * 60 * 60);
        }, 0);
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
        return query;
    }

    async getStaffSearchDetails(req: StaffSearchDto) {
        const query = this.createQueryBuilder('staff')
            .select([
                'branch.name AS branchName',
                'staff.staff_id AS staffId',
                'staff.name AS staffName',
                'staff.designation AS designation',
                'staff.phone_number AS phoneNumber',
            ])
            .leftJoin(BranchEntity, 'branch', 'branch.id = staff.branch_id')
            .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.staffId) {
            query.andWhere('staff.staff_id = :staffId', { staffId: req.staffId });
        }
        if (req.name) {
            query.andWhere('staff.name LIKE :name', { name: `%${req.name}%` });
        }
        if (req.branchName) {
            query.andWhere('branch.name LIKE :branchName', { branchName: `%${req.branchName}%` });
        }

        // Use getRawMany if you want to use custom column aliases
        const staffDetails = await query.getRawMany();
        return staffDetails;
    }

}


