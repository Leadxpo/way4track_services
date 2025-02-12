import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { DesignationEnum, StaffEntity } from "../entity/staff.entity";
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

    async payRoll(req: {
        branch?: string;
        companyCode: string;
        unitCode: string;
    }) {
        const query = this.createQueryBuilder('sf')
            .select(`
                sf.staff_id AS staffId,
                sf.name AS staffName,
                br.name AS branch,
                sf.staff_photo as staffPhoto,
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
        if (req.branch) {
            query.andWhere('br.name LIKE :branchName', { branchName: `%${req.branch}%` });
        }
        const payRollData = query.getRawMany();
        return payRollData;
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
                sf.designation AS staffDesignation,
                sf.name AS staffName,
                pa.permissions as staffPermissions
            `)
            .leftJoin('sf.permissions', 'pa')
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
                'staff.basic_salary as salary'

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

    // async getBranchStaffDetails(req: StaffSearchDto) {
    //     // Main query for branch aggregate data
    //     const query = this.createQueryBuilder('staff')
    //         .select([
    //             'branch.name AS branchName',
    //             'branchManager.name AS branchManagerName',
    //             'branchManager.phone_number AS branchManagerPhoneNumber',
    //             'branchManager.basic_salary AS branchManagerSalary',
    //             'COUNT(staff.staff_id) AS totalStaff',
    //             `SUM(CASE WHEN LOWER(staff.designation) = '${DesignationEnum.Technician.toLowerCase()}' THEN 1 ELSE 0 END) AS totalTechnicians`,
    //             `SUM(CASE WHEN LOWER(staff.designation) = '${DesignationEnum.SalesMan.toLowerCase()}' THEN 1 ELSE 0 END) AS totalSales`,
    //             `SUM(CASE WHEN LOWER(staff.designation) NOT IN ('${DesignationEnum.Technician.toLowerCase()}', '${DesignationEnum.SalesMan.toLowerCase()}') THEN 1 ELSE 0 END) AS totalNonTechnicians`,
    //         ])
    //         .leftJoin(BranchEntity, 'branch', 'branch.id = staff.branch_id')
    //         .leftJoin(StaffEntity, 'branchManager', 'branchManager.branch_id = branch.id AND LOWER(branchManager.designation) = :managerDesignation', { managerDesignation: DesignationEnum.BranchManager.toLowerCase() })
    //         .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
    //         .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode })
    //         .groupBy('branch.name, branchManager.name, branchManager.phone_number, branchManager.basic_salary');


    //     if (req.branchName) {
    //         query.andWhere('branch.name = :branchName', { branchName: req.branchName });
    //     }

    //     // Get aggregate branch data
    //     const result = await query.getRawOne();

    //     // Query to fetch all technical staff
    //     const technicalStaffQuery = this.createQueryBuilder('staff')
    //         .select([
    //             'staff.staff_id AS staffId',
    //             'staff.name AS staffName',
    //             'staff.designation AS staffDesignation',
    //             'branch.name AS branchName',
    //             'staff.phone_number as phoneNumber',
    //             'staff.email as email',
    //             'staff.basic_salary as basicSalary'
    //         ])
    //         .leftJoin(BranchEntity, 'branch', 'branch.id = staff.branch_id')
    //         .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
    //         .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode })
    //         .andWhere('LOWER(staff.designation) = :designation', { designation: DesignationEnum.Technician.toLowerCase() });

    //     if (req.branchName) {
    //         technicalStaffQuery.andWhere('branch.name = :branchName', { branchName: req.branchName });
    //     }

    //     const technicalStaff = await technicalStaffQuery.getRawMany();

    //     // Query to fetch all sales staff
    //     const salesStaffQuery = this.createQueryBuilder('staff')
    //         .select([
    //             'staff.staff_id AS staffId',
    //             'staff.name AS staffName',
    //             'staff.designation AS staffDesignation',
    //             'branch.name AS branchName',
    //             'staff.phone_number as phoneNumber',
    //             'staff.email as email',
    //             'staff.basic_salary as basicSalary'
    //         ])
    //         .leftJoin(BranchEntity, 'branch', 'branch.id = staff.branch_id')
    //         .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
    //         .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode })
    //         .andWhere('LOWER(staff.designation) = :designation', { designation: DesignationEnum.SalesMan.toLowerCase() });

    //     if (req.branchName) {
    //         salesStaffQuery.andWhere('branch.name = :branchName', { branchName: req.branchName });
    //     }

    //     const salesStaff = await salesStaffQuery.getRawMany();

    //     // Query to fetch all non-technical staff
    //     const nonTechnicalStaffQuery = this.createQueryBuilder('staff')
    //         .select([
    //             'staff.staff_id AS staffId',
    //             'staff.name AS staffName',
    //             'staff.designation AS staffDesignation',
    //             'branch.name AS branchName',
    //             'staff.phone_number as phoneNumber',
    //             'staff.email as email',
    //             'staff.basic_salary as basicSalary'
    //         ])
    //         .leftJoin(BranchEntity, 'branch', 'branch.id = staff.branch_id')
    //         .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
    //         .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode })
    //         .andWhere('LOWER(staff.designation) NOT IN (:...designations)', { designations: [DesignationEnum.Technician.toLowerCase(), DesignationEnum.SalesMan.toLowerCase()] });

    //     if (req.branchName) {
    //         nonTechnicalStaffQuery.andWhere('branch.name = :branchName', { branchName: req.branchName });
    //     }

    //     const nonTechnicalStaff = await nonTechnicalStaffQuery.getRawMany();

    //     return {
    //         branch: result,
    //         technicalStaff,
    //         salesStaff,
    //         nonTechnicalStaff,
    //     };
    // }

    async getBranchStaffDetails(req: StaffSearchDto) {
        try {
            // Main query for staff data grouped by branch, including branch manager details
            const query = this.createQueryBuilder('staff')
                .select([
                    'branch.name AS branchName',
                    'branchManager.name AS branchManagerName',
                    'branchManager.phone_number AS branchManagerPhoneNumber',
                    'branchManager.basic_salary AS branchManagerSalary',
                    'COUNT(staff.staff_id) AS totalStaff',
                    `SUM(CASE WHEN LOWER(staff.designation) = '${DesignationEnum.Technician.toLowerCase()}' THEN 1 ELSE 0 END) AS totalTechnicians`,
                    `SUM(CASE WHEN LOWER(staff.designation) = '${DesignationEnum.SalesMan.toLowerCase()}' THEN 1 ELSE 0 END) AS totalSales`,
                    `SUM(CASE WHEN LOWER(staff.designation) NOT IN ('${DesignationEnum.Technician.toLowerCase()}', '${DesignationEnum.SalesMan.toLowerCase()}') THEN 1 ELSE 0 END) AS totalNonTechnicians`
                ])
                .leftJoin(BranchEntity, 'branch', 'branch.id = staff.branch_id')
                .leftJoin(StaffEntity, 'branchManager', 'branchManager.branch_id = branch.id AND LOWER(branchManager.designation) = :managerDesignation', { managerDesignation: DesignationEnum.BranchManager.toLowerCase() })
                .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode })
                .groupBy('branch.name, branchManager.name, branchManager.phone_number, branchManager.basic_salary');

            // Execute the query to fetch the aggregated branch data
            const result = await query.getRawMany();

            // Query to fetch all technical staff for the specific branch
            const technicalStaffQuery = this.createQueryBuilder('staff')
                .select([
                    'staff.staff_id AS staffId',
                    'staff.name AS staffName',
                    'staff.designation AS staffDesignation',
                    'branch.name AS branchName',
                    'staff.phone_number as phoneNumber',
                    'staff.email as email',
                    'staff.basic_salary as basicSalary'
                ])
                .leftJoin(BranchEntity, 'branch', 'branch.id = staff.branch_id')
                .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode })
                .andWhere('LOWER(staff.designation) = :designation', { designation: DesignationEnum.Technician.toLowerCase() });

            const technicalStaff = await technicalStaffQuery.getRawMany();

            // Query to fetch all sales staff for the specific branch
            const salesStaffQuery = this.createQueryBuilder('staff')
                .select([
                    'staff.staff_id AS staffId',
                    'staff.name AS staffName',
                    'staff.designation AS staffDesignation',
                    'branch.name AS branchName',
                    'staff.phone_number as phoneNumber',
                    'staff.email as email',
                    'staff.basic_salary as basicSalary'
                ])
                .leftJoin(BranchEntity, 'branch', 'branch.id = staff.branch_id')
                .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode })
                .andWhere('LOWER(staff.designation) = :designation', { designation: DesignationEnum.SalesMan.toLowerCase() });

            const salesStaff = await salesStaffQuery.getRawMany();

            // Query to fetch all non-technical staff for the specific branch
            const nonTechnicalStaffQuery = this.createQueryBuilder('staff')
                .select([
                    'staff.staff_id AS staffId',
                    'staff.name AS staffName',
                    'staff.designation AS staffDesignation',
                    'branch.name AS branchName',
                    'staff.phone_number as phoneNumber',
                    'staff.email as email',
                    'staff.basic_salary as basicSalary'
                ])
                .leftJoin(BranchEntity, 'branch', 'branch.id = staff.branch_id')
                .where('staff.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('staff.unit_code = :unitCode', { unitCode: req.unitCode })
                .andWhere('LOWER(staff.designation) NOT IN (:...designations)', { designations: [DesignationEnum.Technician.toLowerCase(), DesignationEnum.SalesMan.toLowerCase()] });

            const nonTechnicalStaff = await nonTechnicalStaffQuery.getRawMany();

            // Create a map to aggregate the staff by branch
            const branchesMap = new Map<string, any>();

            result.forEach((branchData) => {
                const { branchName, branchManagerName, branchManagerPhoneNumber, branchManagerSalary, totalStaff, totalTechnicians, totalSales, totalNonTechnicians } = branchData;

                // Initialize the branch if it doesn't exist
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

                // Push the corresponding technical, sales, and non-technical staff data to the branch
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

            // Convert the map to an array of branch objects
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

}


