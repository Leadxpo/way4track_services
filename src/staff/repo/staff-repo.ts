import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { DesignationEnum, Gender, StaffEntity } from "../entity/staff.entity";
import { BranchEntity } from "src/branch/entity/branch.entity";
import { AttendanceEntity } from "src/attendence/entity/attendence.entity";
import { StaffAttendanceQueryDto } from "../dto/staff-date.dto";
import { LoginDto } from "src/login/dto/login.dto";
import { StaffSearchDto } from "../dto/staff-search.dto";
import { CommonReq } from "src/models/common-req";
import { PermissionEntity } from "src/permissions/entity/permissions.entity";


@Injectable()

export class StaffRepository extends Repository<StaffEntity> {

    constructor(private dataSource: DataSource) {
        super(StaffEntity, dataSource.createEntityManager());
    }


    // async payRoll(req: { branch?: string; companyCode: string; unitCode: string }) {
    //     const query = this.createQueryBuilder('sf')
    //         .select([
    //             'sf.staff_id AS staffId',
    //             'sf.name AS staffName',
    //             'br.name AS branch',
    //             'sf.designation AS designation',
    //             'sf.staff_photo AS staffPhoto',
    //             'MONTH(a.day) AS month',
    //             'YEAR(a.day) AS year',
    //             'DAY(LAST_DAY(a.day)) AS monthDays',
    //             'SUM(CASE WHEN a.status = "P" THEN 1 ELSE 0 END) AS presentDays',
    //             'SUM(CASE WHEN a.status = "L" THEN 1 ELSE 0 END) AS leaveDays',
    //             'sf.monthly_salary AS actualSalary',
    //             'sf.salary_status as salaryStatus',
    //             // Early & Late Minutes Calculation
    //             'SUM(CASE WHEN a.in_time_remark LIKE "%E%" THEN TIME_TO_SEC(a.in_time_remark) / 60 ELSE 0 END) AS totalOTMinutes',
    //             'SUM(CASE WHEN a.out_time_remark LIKE "%E%" THEN TIME_TO_SEC(a.out_time_remark) / 60 ELSE 0 END) AS totalLateDeductionMinutes',

    //             'SUM(CASE WHEN a.in_time_remark LIKE "%L%" THEN TIME_TO_SEC(a.in_time_remark) / 60 ELSE 0 END) AS totalLateMinutes',
    //             'SUM(CASE WHEN a.out_time_remark LIKE "%L%" THEN TIME_TO_SEC(a.out_time_remark) / 60 ELSE 0 END) AS totalOTHours',

    //             // Late Count  OR a.out_time_remark LIKE "%L%"
    //             'SUM(CASE WHEN a.in_time_remark LIKE "%L%" THEN 1 ELSE 0 END) AS lateDays'
    //         ])
    //         .leftJoin(BranchEntity, 'br', 'br.id = sf.branch_id')
    //         .leftJoin('sf.attendance', 'a')
    //         .where('sf.company_code = :companyCode', { companyCode: req.companyCode })
    //         .andWhere('sf.unit_code = :unitCode', { unitCode: req.unitCode });

    //     if (req.branch) {
    //         query.andWhere('br.name LIKE :branchName', { branchName: `%${req.branch}%` });
    //     }

    //     query.groupBy('sf.staff_id,br.name, sf.designation, sf.staff_photo, month, year, monthDays');

    //     const result = await query.getRawMany();

    //     // Process the results
    //     const groupedData = result.reduce((acc, record) => {
    //         const key = record.staffId;
    //         if (!acc[key]) {
    //             acc[key] = {
    //                 staffId: record.staffId,
    //                 staffName: record.staffName,

    //                 branch: record.branch,
    //                 designation: record.designation,
    //                 staffPhoto: record.staffPhoto,
    //                 salaryDetails: []
    //             };
    //         }

    //         const monthDays = Number(record.monthDays);
    //         const perDaySalary = Number(record.actualSalary) / monthDays;
    //         const perHourSalary = perDaySalary / 9;
    //         let totalOTMinutes = Number(record.totalOTMinutes);
    //         let totalOutLateOTMinutes = Number(record.totalOTHours);
    //         let totalOTPayableMinutes = totalOTMinutes + totalOutLateOTMinutes;
    //         let totalOTHoursWorked = totalOTPayableMinutes / 60;

    //         if (totalOTHoursWorked >= 8 && Number(record.lateDays) < 2) {
    //             (totalOTHoursWorked) *= 1.5;
    //         } else if (totalOTHoursWorked >= 8 && Number(record.lateDays) > 2) {
    //             (totalOTHoursWorked) *= 1;
    //         }
    //         let finalOTAmount = totalOTHoursWorked * perHourSalary;
    //         const totalOutTimeEarly = Number(record.totalLateDeductionMinutes) / 60
    //         const totalLateHours = Number(record.totalLateMinutes) / 60
    //         let lateDeductions = (totalLateHours + totalOutTimeEarly) * perHourSalary;
    //         const grossSalary = Math.round(Number(record.actualSalary) + finalOTAmount);
    //         const ESIC_Employee = Math.round(grossSalary * 0.0075);
    //         const ESIC_Employer = Math.round(grossSalary * 0.0325);
    //         const PFDayWage = Math.round(Number(record.actualSalary) * 0.4);
    //         const PF_Employee = Math.round(PFDayWage * 0.12);
    //         const PF_Employer1 = Math.round(PFDayWage * 0.0833);
    //         const PF_Employer2 = Math.round(PFDayWage * 0.0367);
    //         let netSalary = 0;
    //         if (record.designation === DesignationEnum.CEO) {
    //             netSalary = Math.round(
    //                 grossSalary - ESIC_Employee - PF_Employee - lateDeductions
    //             );
    //         }
    //         else {
    //             netSalary = Math.round(
    //                 grossSalary - ESIC_Employee - ESIC_Employer - lateDeductions
    //             );
    //         }
    //         acc[key].salaryDetails.push({
    //             year: record.year,
    //             month: record.month,
    //             monthDays,
    //             presentDays: Number(record.presentDays),
    //             leaveDays: Number(record.leaveDays),
    //             actualSalary: Number(record.actualSalary),
    //             totalEarlyMinutes: Number(record.totalEarlyMinutes),
    //             totalLateMinutes: Number(record.totalLateMinutes),
    //             lateDays: Number(record.lateDays),
    //             perDaySalary,
    //             perHourSalary,
    //             totalOTHours: totalOTHoursWorked,
    //             OTAmount: finalOTAmount,
    //             lateDeductions,
    //             grossSalary,
    //             ESIC_Employee,
    //             ESIC_Employer,
    //             PF_Employee,
    //             PF_Employer1,
    //             PF_Employer2,
    //             netSalary,
    //             salaryStatus: record.salaryStatus
    //         });

    //         return acc;
    //     }, {});

    //     return Object.values(groupedData);
    // }


    async payRoll(req: { branch?: string; companyCode: string; unitCode: string }) {
        const query = this.createQueryBuilder('sf')
            .select([
                'sf.staff_id AS staffId',
                'sf.name AS staffName',
                'br.name AS branch',
                'sf.designation AS designation',
                'sf.staff_photo AS staffPhoto',
                'MONTH(a.day) AS month',
                'YEAR(a.day) AS year',
                'DAY(LAST_DAY(a.day)) AS monthDays',
                'SUM(CASE WHEN a.status = "P" THEN 1 ELSE 0 END) AS presentDays',
                'SUM(CASE WHEN a.status = "L" THEN 1 ELSE 0 END) AS leaveDays',
                'sf.monthly_salary AS actualSalary',
                'sf.salary_status AS salaryStatus',
                'SUM(CASE WHEN a.in_time_remark LIKE "%E%" THEN COALESCE(TIME_TO_SEC(a.in_time_remark) / 60, 0) ELSE 0 END) AS totalOTMinutes',
                'SUM(CASE WHEN a.out_time_remark LIKE "%E%" THEN COALESCE(TIME_TO_SEC(a.out_time_remark) / 60, 0) ELSE 0 END) AS totalLateDeductionMinutes',
                'SUM(CASE WHEN a.in_time_remark LIKE "%L%" THEN COALESCE(TIME_TO_SEC(a.in_time_remark) / 60, 0) ELSE 0 END) AS totalLateMinutes',
                'SUM(CASE WHEN a.out_time_remark LIKE "%L%" THEN COALESCE(TIME_TO_SEC(a.out_time_remark) / 60, 0) ELSE 0 END) AS totalOTHours',
                'SUM(CASE WHEN a.in_time_remark LIKE "%L%" THEN 1 ELSE 0 END) AS lateDays',
                'SUM(CASE WHEN COALESCE(TIME_TO_SEC(a.out_time_remark), 0) / 3600 >= 6 AND (a.out_time_remark IS NULL OR a.out_time_remark NOT LIKE "%OT%") THEN 1 ELSE 0 END) AS daysWith6HoursOutLate'
            ])
            .leftJoin(BranchEntity, 'br', 'br.id = sf.branch_id')
            .leftJoin('sf.attendance', 'a')
            .where('sf.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('sf.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.branch) {
            query.andWhere('br.name LIKE :branchName', { branchName: `%${req.branch}%` });
        }

        query.groupBy('sf.staff_id, br.name, sf.designation, sf.staff_photo, month, year, monthDays');

        const result = await query.getRawMany();
        console.log(result, ">>>>>>>>>>>>")

        // Process the data
        const groupedData = result.map((record) => {
            const monthDays = Number(record.monthDays);
            const perDaySalary = Number(record.actualSalary) / monthDays;
            const perHourSalary = perDaySalary / 9;
            let totalOTMinutes = Number(record.totalOTMinutes);
            let totalOutLateOTMinutes = Number(record.totalOTHours);
            const daysWith6HoursOutLate = Number(record.daysWith6HoursOutLate) || 0;

            totalOutLateOTMinutes -= daysWith6HoursOutLate * 6 * 60;
            let totalOTPayableMinutes = totalOTMinutes + totalOutLateOTMinutes;
            let totalOTHoursWorked = totalOTPayableMinutes / 60;

            if (totalOTHoursWorked >= 8 && Number(record.lateDays) < 2) {
                totalOTHoursWorked *= 1.5;
            } else if (totalOTHoursWorked >= 8 && Number(record.lateDays) > 2) {
                totalOTHoursWorked *= 1;
            }

            let finalOTAmount = totalOTHoursWorked * perHourSalary;
            const totalOutTimeEarly = Number(record.totalLateDeductionMinutes) / 60;
            const totalLateHours = Number(record.totalLateMinutes) / 60;
            let lateDeductions = (totalLateHours + totalOutTimeEarly) * perHourSalary;
            const grossSalary = Math.round(Number(record.actualSalary) + finalOTAmount);
            const ESIC_Employee = Math.round(grossSalary * 0.0075);
            const ESIC_Employer = Math.round(grossSalary * 0.0325);
            const PFDayWage = Math.round(Number(record.actualSalary) * 0.4);
            const PF_Employee = Math.round(PFDayWage * 0.12);
            const PF_Employer1 = Math.round(PFDayWage * 0.0833);
            const PF_Employer2 = Math.round(PFDayWage * 0.0367);
            const extraHalfSalary = daysWith6HoursOutLate * (perDaySalary / 2);
            const updatedNetSalary = grossSalary - (record.designation !== DesignationEnum.CEO ? ESIC_Employer : ESIC_Employee) - lateDeductions - PF_Employee + extraHalfSalary;

            return {
                staffId: record.staffId,
                staffName: record.staffName,
                branch: record.branch,
                designation: record.designation,
                staffPhoto: record.staffPhoto,
                salaryDetails: [
                    {
                        year: record.year,
                        month: record.month,
                        monthDays,
                        presentDays: Number(record.presentDays),
                        leaveDays: Number(record.leaveDays),
                        actualSalary: Number(record.actualSalary),
                        totalEarlyMinutes: Number(record.totalLateDeductionMinutes),
                        totalLateMinutes: Number(record.totalLateMinutes),
                        lateDays: Number(record.lateDays),
                        perDaySalary,
                        perHourSalary,
                        totalOTHours: totalOTHoursWorked,
                        OTAmount: finalOTAmount,
                        lateDeductions,
                        grossSalary,
                        ESIC_Employee,
                        ESIC_Employer,
                        PF_Employee,
                        PF_Employer1,
                        PF_Employer2,
                        extraHalfSalary,
                        daysOutLate6HoursOrMore: daysWith6HoursOutLate,
                        netSalary: updatedNetSalary,
                        salaryStatus: record.salaryStatus
                    }
                ]
            };
        });
        console.log(groupedData, "??????????????")

        return groupedData;
    }

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
                a.in_time AS inTime,
                a.out_time AS outTime,
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
                a.out_time,
                a.in_time
            `)
            .orderBy('a.day')
            .getRawMany();

        const daysInMonth = new Date(year, month, 0).getDate();
        const allDaysOfMonth = Array.from({ length: daysInMonth }).map((_, i) => {
            const currentDate = new Date(year, month - 1, i + 1);
            const formattedDate = currentDate.toISOString().split('T')[0];
            const attendance = query.find(q => q.day === formattedDate);

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
                inTime: attendance?.inTime || null,
                outTime: attendance?.outTime || null,
                status: attendance?.status || 'Absent'
            };
        });
        return allDaysOfMonth;
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
                sf.designation AS staffDesignation,
                sf.name AS staffName,
                pa.permissions as staffPermissions,
                branch.name as branchName
            `)
            .leftJoin('sf.permissions', 'pa')
            .leftJoin(BranchEntity, 'branch', 'branch.id=sf.branch_id')
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
                'staff.id as id',
                'branch.name AS branchName',
                'staff.staff_id AS staffId',
                'staff.name AS staffName',
                'staff.designation AS designation',
                'staff.phone_number AS phoneNumber',
            ])
            .leftJoinAndSelect(BranchEntity, 'branch', 'branch.id = staff.branch_id')
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

    async getStaff(req: CommonReq) {
        const query = this.createQueryBuilder('staff')
            .select([
                'staff.id as id',
                'staff.staff_id AS staffId',
                'staff.name AS staffName',
                'staff.designation AS designation',
                'staff.phone_number AS phoneNumber',
                'staff.email AS email',
                'staff.monthly_salary as salary'

            ])
            .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('staff.designation IN (:...designations)', {
                designations: [
                    DesignationEnum.Accountant,
                    DesignationEnum.WarehouseManager,
                    DesignationEnum.HR,
                ],
            });

        const staffDetails = await query.getRawMany();
        return staffDetails;
    }

    async getStaffCardsDetails(req: StaffSearchDto) {
        const query = this.createQueryBuilder('staff')
            .select([
                'COUNT(staff.staff_id) AS totalStaff',
                `SUM(CASE WHEN LOWER(staff.designation) = '${DesignationEnum.Technician.toLowerCase()}' THEN 1 ELSE 0 END) AS totalTechnicians`,
                `SUM(CASE WHEN LOWER(staff.designation) = '${DesignationEnum.SalesMan.toLowerCase()}' THEN 1 ELSE 0 END) AS totalSales`,
                `SUM(CASE WHEN LOWER(staff.designation) NOT IN ('${DesignationEnum.Technician.toLowerCase()}', '${DesignationEnum.SalesMan.toLowerCase()}') THEN 1 ELSE 0 END) AS totalNonTechnicians`,
            ])
            .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode });

        const staffDetails = await query.getRawOne();
        return staffDetails;
    }

    async getTotalStaffDetails(req: StaffSearchDto) {
        // Main query for aggregate data
        const query = this.createQueryBuilder('staff')
            .select([
                'branch.name AS branchName',
                'COUNT(staff.staff_id) AS totalStaff',
                `SUM(CASE WHEN LOWER(staff.designation) = '${DesignationEnum.Technician.toLowerCase()}' THEN 1 ELSE 0 END) AS totalTechnicians`,
                `SUM(CASE WHEN LOWER(staff.designation) = '${DesignationEnum.SalesMan.toLowerCase()}' THEN 1 ELSE 0 END) AS totalSales`,
                `SUM(CASE WHEN LOWER(staff.designation) NOT IN ('${DesignationEnum.Technician.toLowerCase()}', '${DesignationEnum.SalesMan.toLowerCase()}') THEN 1 ELSE 0 END) AS totalNonTechnicians`,
            ])
            .leftJoin(BranchEntity, 'branch', 'branch.id = staff.branch_id')
            .leftJoin(StaffEntity, 'branchManager', 'branchManager.branch_id = branch.id AND LOWER(branchManager.designation) = :managerDesignation', { managerDesignation: DesignationEnum.BranchManager.toLowerCase() })
            .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.branchName) {
            query.andWhere('branch.name = :branchName', { branchName: req.branchName });
        }

        const result = await query.groupBy('branch.name').getRawMany();

        // Fetching individual staff details and associating with the branch manager
        const staffDetailsQuery = this.createQueryBuilder('staff')
            .select([
                'staff.staff_id AS staffId',
                'staff.name AS staffName',
                'staff.designation AS staffDesignation',
                'branch.name AS branchName',
                // Branch manager information
                'branchManager.name AS branchManagerName',
                'branchManager.phone_number AS branchManagerPhoneNumber',
            ])
            .leftJoin(BranchEntity, 'branch', 'branch.id = staff.branch_id')
            .leftJoin(StaffEntity, 'branchManager', 'branchManager.branch_id = branch.id AND LOWER(branchManager.designation) = :managerDesignation', { managerDesignation: DesignationEnum.BranchManager.toLowerCase() })
            .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.branchName) {
            staffDetailsQuery.andWhere('branch.name = :branchName', { branchName: req.branchName });
        }

        const staffResult = await staffDetailsQuery.getRawMany();

        return { result, staff: staffResult };
    }

    // Query to fetch all technical staff for the specific branch
    // const technicalStaffQuery = this.createQueryBuilder('staff')
    //     .select([
    //         'staff.staff_id AS staffId',
    //         'staff.name AS staffName',
    //         'staff.designation AS staffDesignation',
    //         'branch.name AS branchName',
    //         'staff.phone_number as phoneNumber',
    //         'staff.email as email',
    //         'staff.monthly_salary as basicSalary'
    //     ])
    //     .leftJoin(BranchEntity, 'branch', 'branch.id = staff.branch_id')
    //     .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
    //     .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode })
    //     .andWhere('LOWER(staff.designation) = :designation', { designation: DesignationEnum.Technician.toLowerCase() });

    // const technicalStaff = await technicalStaffQuery.getRawMany();

    // Query to fetch all sales staff for the specific branch
    // const salesStaffQuery = this.createQueryBuilder('staff')
    //     .select([
    //         'staff.staff_id AS staffId',
    //         'staff.name AS staffName',
    //         'staff.designation AS staffDesignation',
    //         'branch.name AS branchName',
    //         'staff.phone_number as phoneNumber',
    //         'staff.email as email',
    //         'staff.monthly_salary as basicSalary'
    //     ])
    //     .leftJoin(BranchEntity, 'branch', 'branch.id = staff.branch_id')
    //     .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
    //     .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode })
    //     .andWhere('LOWER(staff.designation) = :designation', { designation: DesignationEnum.SalesMan.toLowerCase() });

    // const salesStaff = await salesStaffQuery.getRawMany();

    // // Query to fetch all non-technical staff for the specific branch
    // const nonTechnicalStaffQuery = this.createQueryBuilder('staff')
    //     .select([
    //         'staff.staff_id AS staffId',
    //         'staff.name AS staffName',
    //         'staff.designation AS staffDesignation',
    //         'branch.name AS branchName',
    //         'staff.phone_number as phoneNumber',
    //         'staff.email as email',
    //         'staff.monthly_salary as basicSalary'
    //     ])
    //     .leftJoin(BranchEntity, 'branch', 'branch.id = staff.branch_id')
    //     .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
    //     .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode })
    //     .andWhere('LOWER(staff.designation) NOT IN (:...designations)', { designations: [DesignationEnum.Technician.toLowerCase(), DesignationEnum.SalesMan.toLowerCase()] });

    // const nonTechnicalStaff = await nonTechnicalStaffQuery.getRawMany();

    // Create a map to aggregate the staff by branch
    // async getBranchStaffDetails(req: StaffSearchDto) {
    //     try {
    //         // Main query for staff data grouped by branch, including branch manager details
    //         const query = this.createQueryBuilder('staff')
    //             .select([
    //                 'branch.name AS branchName',
    //                 'branchManager.name AS branchManagerName',
    //                 'branchManager.phone_number AS branchManagerPhoneNumber',
    //                 'branchManager.monthly_salary AS branchManagerSalary',
    //                 'COUNT(staff.staff_id) AS totalStaff',
    //                 `SUM(CASE WHEN LOWER(staff.designation) = '${DesignationEnum.Technician.toLowerCase()}' THEN 1 ELSE 0 END) AS totalTechnicians`,
    //                 `SUM(CASE WHEN LOWER(staff.designation) = '${DesignationEnum.SalesMan.toLowerCase()}' THEN 1 ELSE 0 END) AS totalSales`,
    //                 `SUM(CASE WHEN LOWER(staff.designation) NOT IN ('${DesignationEnum.Technician.toLowerCase()}', '${DesignationEnum.SalesMan.toLowerCase()}') THEN 1 ELSE 0 END) AS totalNonTechnicians`
    //             ])
    //             .leftJoin(BranchEntity, 'branch', 'branch.id = staff.branch_id')
    //             .leftJoinAndSelect(StaffEntity, 'branchManager', 'branchManager.branch_id = branch.id AND LOWER(branchManager.designation) = :managerDesignation', { managerDesignation: DesignationEnum.BranchManager.toLowerCase() })
    //             .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
    //             .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode })
    //             .groupBy(`
    //                 branch.name, 
    //                 branchManager.id, 
    //                 branchManager.name, 
    //                 branchManager.phone_number, 
    //                 branchManager.monthly_salary
    //             `);
    //         // Execute the query to fetch the aggregated branch data
    //         const result = await query.getRawMany();


    //         const technicalStaffQuery = this.createQueryBuilder('staff')
    //             .select(['staff', 'branch.name'])
    //             .leftJoin(BranchEntity, 'branch', 'branch.id = staff.branch_id')
    //             .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
    //             .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode })
    //             .andWhere('LOWER(staff.designation) = :designation', { designation: DesignationEnum.Technician.toLowerCase() });

    //         const technicalStaff = await technicalStaffQuery.getMany();
    //         console.log(technicalStaff, "technicalStaff")

    //         const salesStaffQuery = this.createQueryBuilder('staff')
    //             .select(['staff', 'branch.name'])
    //             .leftJoin(BranchEntity, 'branch', 'branch.id = staff.branch_id')
    //             .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
    //             .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode })
    //             .andWhere('LOWER(staff.designation) = :designation', { designation: DesignationEnum.SalesMan.toLowerCase() });

    //         const salesStaff = await salesStaffQuery.getMany();
    //         console.log(salesStaff, "salesStaff")

    //         const nonTechnicalStaffQuery = this.createQueryBuilder('staff')
    //             .select(['staff', 'branch.name'])
    //             .leftJoin(BranchEntity, 'branch', 'branch.id = staff.branch_id')
    //             .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
    //             .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode })
    //             .andWhere('LOWER(staff.designation) NOT IN (:...designations)', { designations: [DesignationEnum.Technician.toLowerCase(), DesignationEnum.SalesMan.toLowerCase()] });

    //         const nonTechnicalStaff = await nonTechnicalStaffQuery.getMany();
    //         console.log(nonTechnicalStaff, "nonTechnicalStaff")
    //         const branchesMap = new Map<string, any>();

    //         result.forEach((branchData) => {
    //             const { branchName, branchManagerName, branchManagerPhoneNumber, branchManagerSalary, totalStaff, totalTechnicians, totalSales, totalNonTechnicians } = branchData;

    //             // Initialize the branch if it doesn't exist
    //             if (!branchesMap.has(branchName)) {
    //                 branchesMap.set(branchName, {
    //                     branchName: branchName || 'N/A',
    //                     branchManagerName: branchManagerName || 'N/A',
    //                     branchManagerPhoneNumber: branchManagerPhoneNumber || 'N/A',
    //                     branchManagerSalary: Number(branchManagerSalary) || 0,
    //                     totalStaff: Number(totalStaff) || 0,
    //                     totalTechnicians: Number(totalTechnicians) || 0,
    //                     totalSales: Number(totalSales) || 0,
    //                     totalNonTechnicians: Number(totalNonTechnicians) || 0,
    //                     technicalStaff: [],
    //                     salesStaff: [],
    //                     nonTechnicalStaff: []
    //                 });
    //             }

    //             // Push the corresponding technical, sales, and non-technical staff data to the branch
    //             technicalStaff.forEach(staff => {
    //                 if (staff.branchName === branchName) {
    //                     branchesMap.get(branchName)?.technicalStaff.push(staff);
    //                 }
    //             });

    //             salesStaff.forEach(staff => {
    //                 if (staff.branchName === branchName) {
    //                     branchesMap.get(branchName)?.salesStaff.push(staff);
    //                 }
    //             });

    //             nonTechnicalStaff.forEach(staff => {
    //                 if (staff.branchName === branchName) {
    //                     branchesMap.get(branchName)?.nonTechnicalStaff.push(staff);
    //                 }
    //             });
    //         });

    //         // Convert the map to an array of branch objects
    //         const results = Array.from(branchesMap.values());

    //         return {
    //             status: true,
    //             errorCode: 200,
    //             internalMessage: "Data retrieved successfully",
    //             data: results
    //         };

    //     } catch (error) {
    //         console.error('Error fetching branch staff details:', error);
    //         throw new Error('Failed to fetch branch staff details');
    //     }
    // }
    async getBranchStaffDetails(req: StaffSearchDto) {
        try {
            // Main query for staff data grouped by branch, including branch manager details
            const query = this.createQueryBuilder('staff')
                .select([
                    'branch.name AS branchName',
                    'branchManager.name AS branchManagerName',
                    'branchManager.phone_number AS branchManagerPhoneNumber',
                    'branchManager.monthly_salary AS branchManagerSalary',
                    'COUNT(staff.staff_id) AS totalStaff',
                    `SUM(CASE WHEN LOWER(staff.designation) = '${DesignationEnum.Technician.toLowerCase()}' THEN 1 ELSE 0 END) AS totalTechnicians`,
                    `SUM(CASE WHEN LOWER(staff.designation) = '${DesignationEnum.SalesMan.toLowerCase()}' THEN 1 ELSE 0 END) AS totalSales`,
                    `SUM(CASE WHEN LOWER(staff.designation) NOT IN ('${DesignationEnum.Technician.toLowerCase()}', '${DesignationEnum.SalesMan.toLowerCase()}') THEN 1 ELSE 0 END) AS totalNonTechnicians`
                ])
                .leftJoin(BranchEntity, 'branch', 'branch.id = staff.branch_id')
                .leftJoinAndSelect(StaffEntity, 'branchManager', 'branchManager.branch_id = branch.id AND LOWER(branchManager.designation) = :managerDesignation', { managerDesignation: DesignationEnum.BranchManager.toLowerCase() })
                .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode });

            // Filter by branch name if provided
            if (req.branchName) {
                query.andWhere('branch.name = :branchName', { branchName: req.branchName });
            }

            const result = await query.groupBy(`
                branch.name, 
                branchManager.id, 
                branchManager.name, 
                branchManager.phone_number, 
                branchManager.monthly_salary
            `).getRawMany();

            // Fetch technical staff
            const technicalStaffQuery = this.createQueryBuilder('staff')
                .select(['staff', 'branch.name'])
                .leftJoin(BranchEntity, 'branch', 'branch.id = staff.branch_id')
                .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode })
                .andWhere('LOWER(staff.designation) = :designation', { designation: DesignationEnum.Technician.toLowerCase() });

            if (req.branchName) {
                technicalStaffQuery.andWhere('branch.name = :branchName', { branchName: req.branchName });
            }

            const technicalStaff = await technicalStaffQuery.getMany();

            // Fetch sales staff
            const salesStaffQuery = this.createQueryBuilder('staff')
                .select(['staff', 'branch.name'])
                .leftJoin(BranchEntity, 'branch', 'branch.id = staff.branch_id')
                .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode })
                .andWhere('LOWER(staff.designation) = :designation', { designation: DesignationEnum.SalesMan.toLowerCase() });

            if (req.branchName) {
                salesStaffQuery.andWhere('branch.name = :branchName', { branchName: req.branchName });
            }

            const salesStaff = await salesStaffQuery.getMany();

            // Fetch non-technical staff
            const nonTechnicalStaffQuery = this.createQueryBuilder('staff')
                .select(['staff', 'branch.name'])
                .leftJoin(BranchEntity, 'branch', 'branch.id = staff.branch_id')
                .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode })
                .andWhere('LOWER(staff.designation) NOT IN (:...designations)', { designations: [DesignationEnum.Technician.toLowerCase(), DesignationEnum.SalesMan.toLowerCase()] });

            if (req.branchName) {
                nonTechnicalStaffQuery.andWhere('branch.name = :branchName', { branchName: req.branchName });
            }

            const nonTechnicalStaff = await nonTechnicalStaffQuery.getMany();

            // Map branch data
            const branchesMap = new Map<string, any>();

            result.forEach((branchData) => {
                const { branchName, branchManagerName, branchManagerPhoneNumber, branchManagerSalary, totalStaff, totalTechnicians, totalSales, totalNonTechnicians } = branchData;

                if (!branchesMap.has(branchName)) {
                    branchesMap.set(branchName, {
                        branchName: branchName || 'N/A',
                        branchManagerName: branchManagerName || 'N/A',
                        branchManagerPhoneNumber: branchManagerPhoneNumber || 'N/A',
                        branchManagerSalary: Number(branchManagerSalary) || 0,
                        totalStaff: Number(totalStaff) || 0,
                        totalTechnicians: Number(totalTechnicians) || 0,
                        totalSales: Number(totalSales) || 0,
                        totalNonTechnicians: Number(totalNonTechnicians) || 0,
                        technicalStaff: [],
                        salesStaff: [],
                        nonTechnicalStaff: []
                    });
                }

                // Push staff to the respective category
                technicalStaff.forEach(staff => {
                    if (staff.branchName === branchName) {
                        branchesMap.get(branchName)?.technicalStaff.push(staff);
                    }
                });

                salesStaff.forEach(staff => {
                    if (staff.branchName === branchName) {
                        branchesMap.get(branchName)?.salesStaff.push(staff);
                    }
                });

                nonTechnicalStaff.forEach(staff => {
                    if (staff.branchName === branchName) {
                        branchesMap.get(branchName)?.nonTechnicalStaff.push(staff);
                    }
                });
            });

            // Convert to array format
            const results = Array.from(branchesMap.values());

            return {
                status: true,
                errorCode: 200,
                internalMessage: "Data retrieved successfully",
                data: results
            };

        } catch (error) {
            console.error('Error fetching branch staff details:', error);
            throw new Error('Failed to fetch branch staff details');
        }
    }

    async getAllBranchStaffDetails(req: StaffSearchDto) {
        try {
            // Query to get all branch details along with the branch manager
            const branchQuery = this.createQueryBuilder('staff')
                .select([
                    'branch.name AS branchName',
                    'branchManager.name AS branchManagerName',
                    'branchManager.phone_number AS branchManagerPhoneNumber',
                    'branchManager.monthly_salary AS branchManagerSalary'
                ])
                .leftJoin(BranchEntity, 'branch', 'branch.id = staff.branch_id')
                .leftJoin(
                    StaffEntity,
                    'branchManager',
                    'branchManager.branch_id = branch.id AND LOWER(branchManager.designation) = :managerDesignation',
                    { managerDesignation: DesignationEnum.BranchManager.toLowerCase() }
                )
                .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode });

            if (req.branchName) {
                branchQuery.andWhere('branch.name = :branchName', { branchName: req.branchName });
            }

            const branchResults = await branchQuery.getRawMany();

            // Query to get all staff details including their branch
            const staffResults = await this.createQueryBuilder('staff')
                .leftJoinAndSelect('staff.branch', 'branch')
                .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode });

            if (req.branchName) {
                staffResults.andWhere('branch.name = :branchName', { branchName: req.branchName });
            }

            const fullStaffDetails = await staffResults.getMany(); // Fetch full staff entity objects

            // Map to store staff details by branch
            const branchStaffMap = new Map<string, any>();

            // Initialize branch data with no staff initially
            branchResults.forEach((branchData) => {
                const { branchName, branchManagerName, branchManagerPhoneNumber, branchManagerSalary } = branchData;

                branchStaffMap.set(branchName, {
                    branchName: branchName || 'N/A',
                    branchManagerName: branchManagerName || 'N/A',
                    branchManagerPhoneNumber: branchManagerPhoneNumber || 'N/A',
                    branchManagerSalary: Number(branchManagerSalary) || 0,
                    totalStaff: 0,
                    staffDetails: []
                });
            });

            // Assign all staff details to their respective branches
            fullStaffDetails.forEach((staff) => {
                const branchName = staff.branch?.branchName || 'N/A';

                if (!branchStaffMap.has(branchName)) {
                    branchStaffMap.set(branchName, {
                        branchName,
                        branchManagerName: 'N/A',
                        branchManagerPhoneNumber: 'N/A',
                        branchManagerSalary: 0,
                        totalStaff: 0,
                        staffDetails: []
                    });
                }

                branchStaffMap.get(branchName).staffDetails.push(staff);
                branchStaffMap.get(branchName).totalStaff += 1;
            });

            // Convert the Map to an array and return it
            return Array.from(branchStaffMap.values());
        } catch (error) {
            console.error('Error fetching branch staff details:', error);
            throw new Error('Failed to fetch branch staff details');
        }
    }






}


