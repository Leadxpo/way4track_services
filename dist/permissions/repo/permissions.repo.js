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
exports.PermissionRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const permissions_entity_1 = require("../entity/permissions.entity");
const staff_entity_1 = require("../../staff/entity/staff.entity");
const branch_entity_1 = require("../../branch/entity/branch.entity");
const sub_dealer_entity_1 = require("../../sub-dealer/entity/sub-dealer.entity");
let PermissionRepository = class PermissionRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(permissions_entity_1.PermissionEntity, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async getStaffPermissions(req) {
        const query = this.createQueryBuilder('permission')
            .select([
            'branch.name AS branchName',
            'staff.staff_id AS staffId',
            'staff.name AS staffName',
            'sb.sub_dealer_id AS subDealerId',
            'sb.name AS subDealerName',
            'staff.designation AS designation',
            'staff.phone_number AS phoneNumber',
            'sb.sub_dealer_phone_number AS subDealerPhoneNumber',
            'staff.dob AS dob',
            'staff.address AS address',
            'sb.address AS subDealerAddress',
            'staff.email AS email',
            'sb.email AS subDealerEmail',
            'staff.aadhar_number AS aadharNumber',
            'sb.aadhar_number AS subDealerAadharNumber',
            'permission.role AS role',
            'permission.permissions AS permissions',
        ])
            .leftJoin(staff_entity_1.StaffEntity, 'staff', 'staff.id = permission.staff_id')
            .leftJoin(branch_entity_1.BranchEntity, 'branch', 'branch.id = staff.branch_id')
            .leftJoin(sub_dealer_entity_1.SubDealerEntity, 'sb', 'sb.id = permission.sub_dealer_id')
            .where('permission.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('permission.unit_code = :unitCode', { unitCode: req.unitCode });
        if (req.staffId) {
            query.andWhere('staff.staff_id = :staffId', { staffId: req.staffId });
        }
        if (req.subDealerId) {
            query.andWhere('sb.id = :subDealerId', { subDealerId: req.subDealerId });
        }
        const staffDetails = await query.getRawMany();
        return staffDetails;
    }
};
exports.PermissionRepository = PermissionRepository;
exports.PermissionRepository = PermissionRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], PermissionRepository);
//# sourceMappingURL=permissions.repo.js.map