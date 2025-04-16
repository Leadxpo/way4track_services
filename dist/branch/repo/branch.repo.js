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
exports.BranchRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const branch_entity_1 = require("../entity/branch.entity");
let BranchRepository = class BranchRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(branch_entity_1.BranchEntity, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async getBranchStaff(req) {
        const query = await this.createQueryBuilder('br')
            .select([
            'st.name AS name',
            'st.designation AS designation',
            'br.name AS branchName',
            'st.staff_photo AS staffPhoto',
            'as.asserts_name AS assertsName',
            'as.asserts_photo AS assertsPhoto',
            'as.asserts_amount AS assertsAmount'
        ])
            .leftJoin('br.staff', 'st')
            .leftJoin('br.asserts', 'as')
            .where('br.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('br.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('br.id = :id', { id: req.id })
            .getRawMany();
        return query;
    }
};
exports.BranchRepository = BranchRepository;
exports.BranchRepository = BranchRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], BranchRepository);
//# sourceMappingURL=branch.repo.js.map