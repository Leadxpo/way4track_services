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
exports.AttendenceRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const attendence_entity_1 = require("../entity/attendence.entity");
const staff_entity_1 = require("../../staff/entity/staff.entity");
let AttendenceRepository = class AttendenceRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(attendence_entity_1.AttendanceEntity, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async getStaffAttendance(req) {
        const query = this.createQueryBuilder('a')
            .select([
            'a.id AS id',
            'staff.staff_id AS staffId',
            'a.day AS day',
            'a.branch_name AS branchName',
            'a.in_time AS inTime',
            'a.out_time AS outTime',
            'a.in_time_remark AS inTimeRemark',
            'a.out_time_remark AS outTimeRemark',
            'a.status AS status',
            'staff.name AS staffName',
        ])
            .leftJoin(staff_entity_1.StaffEntity, 'staff', 'staff.id = a.staff_id')
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
        query.orderBy('a.day', 'ASC');
        return await query.getRawMany();
    }
};
exports.AttendenceRepository = AttendenceRepository;
exports.AttendenceRepository = AttendenceRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], AttendenceRepository);
//# sourceMappingURL=attendence.repo.js.map