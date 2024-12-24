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
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = sf.branch_id')
            .where(`sf.company_code = "${req.companyCode}"`)
            .andWhere(`sf.unit_code = "${req.unitCode}"`)
            .getRawMany();
        return query;
    }
    async staffAttendanceDetails(req) {
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
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = sf.branch_id')
            .leftJoin(attendence_entity_1.AttendanceEntity, 'a', 'a.staff_id = sf.id')
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
    async LoginDetails(req) {
        const query = this.createQueryBuilder('sf')
            .select(`
                sf.staff_id AS staffId,
                sf.password AS staffPassword,
                sf.designation AS staffDesignation
            `)
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
        console.log(query, "____________");
        return query;
    }
    async getStaffSearchDetails(req) {
        const query = this.createQueryBuilder('staff')
            .leftJoinAndSelect('staff.branch', 'branch')
            .where(`staff.company_code = "${req.companyCode}"`)
            .andWhere(`staff.unit_code = "${req.unitCode}"`);
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
};
exports.StaffRepository = StaffRepository;
exports.StaffRepository = StaffRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], StaffRepository);
//# sourceMappingURL=staff-repo.js.map