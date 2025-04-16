"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const staff_entity_1 = require("../entity/staff.entity");
const branch_entity_1 = require("../../branch/entity/branch.entity");
const attendence_entity_1 = require("../../attendence/entity/attendence.entity");
let StaffRepository = class StaffRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(staff_entity_1.StaffEntity, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async payRoll(req) {
        const payrollEndDate = new Date(req.date);
        payrollEndDate.setDate(25);
        const payrollStartDate = new Date(payrollEndDate);
        payrollStartDate.setDate(26);
        payrollStartDate.setMonth(payrollStartDate.getMonth() - 1);
        const payrollMonth = payrollStartDate.getMonth() + 1;
        const payrollYear = payrollStartDate.getFullYear();
        const query = this.createQueryBuilder('sf')
            .select([
            'sf.staff_id AS staffId',
            'sf.name AS staffName',
            'br.name AS branch',
            'sf.designation AS designation',
            'sf.staff_photo AS staffPhoto',
            'sf.carry_forward_leaves as carryForwardLeaves',
            'SUM(CASE WHEN a.status = "P" THEN 1 ELSE 0 END) AS presentDays',
            'SUM(CASE WHEN a.status = "L" THEN 1 ELSE 0 END) AS leaveDays',
            'sf.monthly_salary AS actualSalary',
            'SUM(CASE WHEN a.in_time_remark LIKE "%L%" THEN 1 ELSE 0 END) AS lateDays',
            'SUM(CASE WHEN a.in_time_remark LIKE "%E%" THEN COALESCE(TIME_TO_SEC(a.in_time_remark) / 60, 0) ELSE 0 END) AS totalInTimeEarlyMinutes',
            'SUM(CASE WHEN a.out_time_remark LIKE "%E%" THEN COALESCE(TIME_TO_SEC(a.out_time_remark) / 60, 0) ELSE 0 END) AS totalOutTimeEarlyMinutes',
            'SUM(CASE WHEN a.in_time_remark LIKE "%L%" THEN COALESCE(TIME_TO_SEC(a.in_time_remark) / 60, 0) ELSE 0 END) AS totalInTimeLateMinutes',
            'SUM(CASE WHEN a.out_time_remark LIKE "%L%" THEN COALESCE(TIME_TO_SEC(a.out_time_remark) / 60, 0) ELSE 0 END) AS totalOutTimeLateMinutes',
            ` SUM(
                    CASE 
                        WHEN CAST(SUBSTRING_INDEX(a.out_time_remark, ':', 1) AS UNSIGNED) >= 6  
                        THEN 1 
                        ELSE 0 
                    END
                ) AS daysWith6HoursOutLate`,
            `SUM(
  CASE 
    WHEN a.in_time_remark LIKE '%E%' THEN
      TIME_TO_SEC(REPLACE(a.in_time_remark, 'E', '')) / 60
    ELSE 0
  END
) AS earlyOTMinutes`,
            `SUM(
  CASE 
    WHEN a.out_time_remark LIKE '%L%' THEN
      CASE 
        WHEN TIME_TO_SEC(REPLACE(a.out_time_remark, 'L', '')) / 3600 >= 6 THEN 0
        ELSE TIME_TO_SEC(REPLACE(a.out_time_remark, 'L', '')) / 60
      END
    ELSE 0
  END
) AS lateOTMinutes`,
            `${payrollMonth} AS payrollMonth`,
            `${payrollYear} AS payrollYear`
        ])
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = sf.branch_id')
            .leftJoin('sf.attendance', 'a')
            .where('sf.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('sf.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('a.day BETWEEN :startDate AND :endDate', {
            startDate: payrollStartDate.toISOString().split('T')[0],
            endDate: payrollEndDate.toISOString().split('T')[0],
        });
        if (req.branch) {
            query.andWhere('br.name LIKE :branchName', { branchName: `%${req.branch}%` });
        }
        query.groupBy('sf.staff_id, br.name,payrollMonth,payrollYear');
        const result = await query.getRawMany();
        const groupedData = result.map((record) => {
            const totalPayrollDays = Math.ceil((payrollEndDate.getTime() - payrollStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            const monthDays = totalPayrollDays;
            const actualSalary = Number(record.actualSalary) || 0;
            const perDaySalary = actualSalary / monthDays;
            const perHourSalary = perDaySalary / 9 || 0;
            const halfDaySalary = perDaySalary / 2;
            let carryForwardLeaves = 12;
            if (Number(record.leaveDays) >= 1) {
                carryForwardLeaves -= 1;
            }
            const presentDays = Number(record.presentDays) || 0;
            const actualEarnedSalary = Number(record.leaveDays) > 1
                ? perDaySalary * presentDays
                : perDaySalary * monthDays;
            let totalInTimeEarlyMinutes = Number(record.totalInTimeEarlyMinutes) || 0;
            let totalOutTimeLateMinutes = Number(record.totalOutTimeLateMinutes) || 0;
            let totalEarlyMinutes = totalInTimeEarlyMinutes + totalOutTimeLateMinutes;
            let totalEarlyHours = (totalEarlyMinutes / 60) || 0;
            let totalOutTimeEarlyMinutes = Number(record.totalOutTimeEarlyMinutes) || 0;
            let totalInTimeLateMinutes = Number(record.totalInTimeLateMinutes) || 0;
            let totalOTMinutes = Number(record.earlyOTMinutes) + Number(record.lateOTMinutes) || 0;
            const daysWith6HoursOutLate = Number(record.daysWith6HoursOutLate) || 0;
            const extraHalfSalary = Number(record.daysWith6HoursOutLate) * halfDaySalary || 0;
            let totalOTPayableMinutes = totalOTMinutes;
            let totalOTHoursWorked = totalOTPayableMinutes / 60;
            if (totalOTHoursWorked >= 8 && Number(record.lateDays) < 2) {
                totalOTHoursWorked *= 1.5;
            }
            else if (totalOTHoursWorked >= 8 && Number(record.lateDays) > 2) {
                totalOTHoursWorked *= 1;
            }
            let finalOTAmount = totalOTHoursWorked * perHourSalary;
            const totalOutTimeEarly = Number(totalOutTimeEarlyMinutes) / 60 || 0;
            const totalInTimeLateHours = Number(totalInTimeLateMinutes) / 60 || 0;
            let totalLateHours = totalOutTimeEarly + totalInTimeLateHours;
            let lateDeductions = totalLateHours * perHourSalary || 0;
            const grossSalary = Math.round(actualEarnedSalary + (isNaN(finalOTAmount) ? 0 : finalOTAmount));
            const ESIC_Employee = Math.round(grossSalary * 0.0075) || 0;
            const ESIC_Employer = Math.round(grossSalary * 0.0325) || 0;
            const PFDayWage = Math.round(actualSalary * 0.4) || 0;
            const PF_Employee = Math.round(PFDayWage * 0.12) || 0;
            const PF_Employer1 = Math.round(PFDayWage * 0.0833) || 0;
            const PF_Employer2 = Math.round(PFDayWage * 0.0367) || 0;
            const updatedNetSalary = grossSalary - lateDeductions - PF_Employee + extraHalfSalary;
            return {
                staffId: record.staffId,
                staffName: record.staffName,
                branch: record.branch,
                designation: record.designation,
                staffPhoto: record.staffPhoto,
                year: payrollYear || 0,
                month: payrollMonth || 0,
                monthDays,
                presentDays: Number(record.presentDays) || 0,
                leaveDays: Number(record.leaveDays) || 0,
                actualSalary: Number(record.actualSalary),
                totalEarlyHours: Number(totalEarlyHours) || 0,
                totalLateHours: Number(totalLateHours) || 0,
                lateDays: Number(record.lateDays) || 0,
                perDaySalary,
                perHourSalary,
                totalOTHours: totalOTHoursWorked,
                OTAmount: isNaN(finalOTAmount) ? 0 : finalOTAmount,
                lateDeductions: isNaN(lateDeductions) ? 0 : lateDeductions,
                grossSalary: isNaN(grossSalary) ? 0 : grossSalary,
                ESIC_Employee,
                ESIC_Employer,
                PF_Employee,
                PF_Employer1,
                PF_Employer2,
                extraHalfSalary,
                daysOutLate6HoursOrMore: daysWith6HoursOutLate,
                netSalary: isNaN(updatedNetSalary) ? 0 : updatedNetSalary,
                salaryStatus: '',
                carryForwardLeaves,
                professionalTax: 0,
                incentives: 0,
                foodAllowance: 0,
                leaveEncashment: 0,
                plBikeNeedToPay: 0,
                plBikeAmount: 0,
                advanceAmount: 0,
                payableAmount: 0
            };
        });
        return groupedData;
    }
    async staffAttendanceDetails(req) {
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
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = sf.branch_id')
            .leftJoin(attendence_entity_1.AttendanceEntity, 'a', 'a.staff_id = sf.id')
            .where('sf.staff_id = :staffId', { staffId })
            .andWhere('sf.staff_status = :status', { status: 'ACTIVE' })
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
            let dailyHours = 0;
            if (attendance?.inTime && attendance?.outTime) {
                dailyHours = (new Date(attendance.outTime).getTime() - new Date(attendance.inTime).getTime()) / (1000 * 60 * 60);
            }
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
                status: attendance?.status || 'Absent',
                totalHours: dailyHours.toFixed(2)
            };
        });
        return allDaysOfMonth;
    }
    async calculateTotalHours(timeRecords) {
        return timeRecords.reduce((total, record) => {
            const inTime = new Date(record.inTime).getTime();
            const outTime = new Date(record.outTime).getTime();
            return total + (outTime - inTime) / (1000 * 60 * 60);
        }, 0);
    }
    async LoginDetails(req) {
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
            .leftJoin(branch_entity_1.BranchEntity, 'branch', 'branch.id=sf.branch_id')
            .where(`sf.staff_id = :staffId AND sf.password = :password AND sf.designation = :designation`, {
            staffId: req.staffId,
            password: req.password,
            designation: req.designation,
        })
            .andWhere(`sf.company_code = :companyCode AND sf.unit_code = :unitCode`, {
            companyCode: req.companyCode,
            unitCode: req.unitCode,
        })
            .getRawOne();
        return query;
    }
    async getStaffSearchDetails(req) {
        const query = this.createQueryBuilder('staff')
            .select([
            'staff.id as id',
            'branch.name AS branchName',
            'staff.staff_id AS staffId',
            'staff.name AS staffName',
            'staff.designation AS designation',
            'staff.phone_number AS phoneNumber',
        ])
            .leftJoinAndSelect(branch_entity_1.BranchEntity, 'branch', 'branch.id = staff.branch_id')
            .andWhere('staff.staff_status = :status', { status: 'ACTIVE' })
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
        const staffDetails = await query.getRawMany();
        return staffDetails;
    }
    async getStaff(req) {
        const query = this.createQueryBuilder('staff')
            .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('staff.staff_status = :status', { status: 'ACTIVE' })
            .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('staff.designation IN (:...designations)', {
            designations: ['Accountant', 'Warehouse Manager', 'HR'],
        });
        if (req.staffId) {
            query.andWhere('staff.staff_id = :staffId', { staffId: req.staffId });
        }
        return await query.getMany();
    }
    async getStaffCardsDetails(req) {
        const query = this.createQueryBuilder('staff')
            .select([
            'COUNT(staff.staff_id) AS totalStaff',
            `SUM(CASE WHEN LOWER(staff.designation) = 'technician' THEN 1 ELSE 0 END) AS totalTechnicians`,
            `SUM(CASE WHEN LOWER(staff.designation) = 'salesman' THEN 1 ELSE 0 END) AS totalSales`,
            `SUM(CASE WHEN LOWER(staff.designation) NOT IN ('technician', 'salesman') THEN 1 ELSE 0 END) AS totalNonTechnicians`,
        ])
            .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('staff.staff_status = :status', { status: 'ACTIVE' })
            .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode });
        return await query.getRawOne();
    }
    async getTotalStaffDetails(req) {
        const query = this.createQueryBuilder('staff')
            .leftJoin(branch_entity_1.BranchEntity, 'branch', 'branch.id = staff.branch_id')
            .leftJoin(staff_entity_1.StaffEntity, 'branchManager', 'branchManager.branch_id = branch.id AND LOWER(branchManager.designation) = :managerDesignation', { managerDesignation: 'branch manager' })
            .select([
            'branch.name AS branchName',
            'COUNT(staff.staff_id) AS totalStaff',
            `SUM(CASE WHEN LOWER(staff.designation) = 'technician' THEN 1 ELSE 0 END) AS totalTechnicians`,
            `SUM(CASE WHEN LOWER(staff.designation) = 'salesman' THEN 1 ELSE 0 END) AS totalSales`,
            `SUM(CASE WHEN LOWER(staff.designation) NOT IN ('technician', 'salesman') THEN 1 ELSE 0 END) AS totalNonTechnicians`,
        ])
            .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('staff.staff_status = :status', { status: 'ACTIVE' })
            .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode });
        if (req.branchName) {
            query.andWhere('branch.name = :branchName', { branchName: req.branchName });
        }
        const result = await query.groupBy('branch.name').getRawMany();
        const staffDetailsQuery = this.createQueryBuilder('staff')
            .leftJoin(branch_entity_1.BranchEntity, 'branch', 'branch.id = staff.branch_id')
            .leftJoin(staff_entity_1.StaffEntity, 'branchManager', 'branchManager.branch_id = branch.id AND LOWER(branchManager.designation) = :managerDesignation', { managerDesignation: 'branch manager' })
            .select([
            'staff.staff_id AS staffId',
            'staff.name AS staffName',
            'staff.phone_number AS phoneNumber',
            'staff.id as id',
            'staff.designation AS staffDesignation',
            'branch.name AS branchName',
            'branchManager.name AS branchManagerName',
            'branchManager.phone_number AS branchManagerPhoneNumber',
        ])
            .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('staff.staff_status = :status', { status: 'ACTIVE' })
            .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode });
        if (req.branchName) {
            staffDetailsQuery.andWhere('branch.name = :branchName', { branchName: req.branchName });
        }
        const staffResult = await staffDetailsQuery.getRawMany();
        return { result, staff: staffResult };
    }
    async getBranchStaffDetails(req) {
        try {
            const query = this.createQueryBuilder('staff')
                .select([
                'branch.name AS branchName',
                'branchManager.name AS branchManagerName',
                'branchManager.phone_number AS branchManagerPhoneNumber',
                'branchManager.monthly_salary AS branchManagerSalary',
                'COUNT(staff.staff_id) AS totalStaff',
                `SUM(CASE WHEN LOWER(staff.designation) = 'technician' THEN 1 ELSE 0 END) AS totalTechnicians`,
                `SUM(CASE WHEN LOWER(staff.designation) = 'salesman' THEN 1 ELSE 0 END) AS totalSales`,
                `SUM(CASE WHEN LOWER(staff.designation) NOT IN ('technician', 'salesman') THEN 1 ELSE 0 END) AS totalNonTechnicians`
            ])
                .leftJoin(branch_entity_1.BranchEntity, 'branch', 'branch.id = staff.branch_id')
                .leftJoinAndSelect(staff_entity_1.StaffEntity, 'branchManager', 'branchManager.branch_id = branch.id AND LOWER(staff.designation) = :managerDesignation', { managerDesignation: 'branch manager' })
                .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('staff.staff_status = :status', { status: 'ACTIVE' })
                .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode });
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
            const technicalStaff = await this.createQueryBuilder('staff')
                .select(['staff', 'branch.name'])
                .leftJoin(branch_entity_1.BranchEntity, 'branch', 'branch.id = staff.branch_id')
                .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('staff.staff_status = :status', { status: 'ACTIVE' })
                .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode })
                .andWhere('LOWER(staff.designation) = :designation', { designation: 'technician' })
                .getMany();
            const salesStaff = await this.createQueryBuilder('staff')
                .select(['staff', 'branch.name'])
                .leftJoin(branch_entity_1.BranchEntity, 'branch', 'branch.id = staff.branch_id')
                .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('staff.staff_status = :status', { status: 'ACTIVE' })
                .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode })
                .andWhere('LOWER(staff.designation) = :designation', { designation: 'salesman' })
                .getMany();
            const nonTechnicalStaff = await this.createQueryBuilder('staff')
                .select(['staff', 'branch.name'])
                .leftJoin(branch_entity_1.BranchEntity, 'branch', 'branch.id = staff.branch_id')
                .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('staff.staff_status = :status', { status: 'ACTIVE' })
                .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode })
                .andWhere('LOWER(staff.designation) NOT IN (:...designations)', { designations: ['technician', 'salesman'] })
                .getMany();
            const branchesMap = new Map();
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
            return {
                status: true,
                errorCode: 200,
                internalMessage: 'Data retrieved successfully',
                data: Array.from(branchesMap.values())
            };
        }
        catch (error) {
            console.error('Error fetching branch staff details:', error);
            throw new Error('Failed to fetch branch staff details');
        }
    }
    async getAllBranchStaffDetails(req) {
        try {
            const branchQuery = this.createQueryBuilder('staff')
                .select([
                'branch.name AS branchName',
                'branchManager.name AS branchManagerName',
                'branchManager.phone_number AS branchManagerPhoneNumber',
                'branchManager.monthly_salary AS branchManagerSalary'
            ])
                .leftJoin(branch_entity_1.BranchEntity, 'branch', 'branch.id = staff.branch_id')
                .leftJoin(staff_entity_1.StaffEntity, 'branchManager', 'branchManager.branch_id = branch.id AND LOWER(branchManager.designation) = :managerDesignation', { managerDesignation: 'branch manager' })
                .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('staff.staff_status = :status', { status: 'ACTIVE' })
                .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode });
            if (req.branchName) {
                branchQuery.andWhere('branch.name = :branchName', { branchName: req.branchName });
            }
            const branchResults = await branchQuery.getRawMany();
            const staffResults = await this.createQueryBuilder('staff')
                .leftJoinAndSelect('staff.branch', 'branch')
                .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('staff.staff_status = :status', { status: 'ACTIVE' })
                .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode });
            if (req.branchName) {
                staffResults.andWhere('branch.name = :branchName', { branchName: req.branchName });
            }
            const fullStaffDetails = await staffResults.getMany();
            const branchStaffMap = new Map();
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
            return Array.from(branchStaffMap.values());
        }
        catch (error) {
            console.error('Error fetching branch staff details:', error);
            throw new Error('Failed to fetch branch staff details');
        }
    }
};
exports.StaffRepository = StaffRepository;
exports.StaffRepository = StaffRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], StaffRepository);
//# sourceMappingURL=staff-repo.js.map