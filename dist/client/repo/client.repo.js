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
exports.ClientRepository = void 0;
const common_1 = require("@nestjs/common");
const client_entity_1 = require("../entity/client.entity");
const typeorm_1 = require("typeorm");
const voucher_entity_1 = require("../../voucher/entity/voucher.entity");
const branch_entity_1 = require("../../branch/entity/branch.entity");
let ClientRepository = class ClientRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(client_entity_1.ClientEntity, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async getClientData(req) {
        const query = await this.createQueryBuilder('cl')
            .select([
            'cl.client_id AS clientId',
            'cl.phone_number AS phoneNumber',
            'cl.name AS name',
            'cl.joining_date AS joiningDate',
            'vr.payment_status AS paymentStatus',
            'vr.amount AS amount',
            'vr.voucher_id as voucherId',
        ])
            .leftJoin(voucher_entity_1.VoucherEntity, 'vr', 'vr.id = cl.voucher_id')
            .where(`cl.company_code = "${req.companyCode}"`)
            .andWhere(`cl.unit_code = "${req.unitCode}"`)
            .getRawMany();
        return query;
    }
    async getDetailClientData(req) {
        console.log(req, "++++++++++++++++++++++");
        const query = await this.createQueryBuilder('cl')
            .select([
            'cl.client_id AS clientId',
            'cl.phone_number AS phoneNumber',
            'cl.name AS name',
            'cl.joining_date AS joiningDate',
            'vr.payment_status AS paymentStatus',
            'vr.amount AS amount',
            'vr.voucher_id AS voucherId',
            'br.name AS branchName',
            'cl.email AS email',
            'cl.dob AS dob',
            'cl.status AS status',
            'cl.address AS address',
            'vr.name AS voucherName',
            'vr.generation_date AS generationDate',
            'vr.product_type AS productType',
        ])
            .leftJoin(voucher_entity_1.VoucherEntity, 'vr', 'vr.id = cl.voucher_id')
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = cl.branch_id')
            .where(`cl.client_id='${req.clientId}'`)
            .andWhere(`cl.company_code = "${req.companyCode}"`)
            .andWhere(`cl.unit_code = "${req.unitCode}"`)
            .groupBy(`vr.voucher_id `)
            .getRawOne();
        console.log(query, "++++++++++++++++++++++++++++++");
        return query;
    }
    async getSearchDetailClient(req) {
        const query = this.createQueryBuilder('cl')
            .select([
            'cl.client_id AS clientId',
            'cl.phone_number AS phoneNumber',
            'cl.name AS name',
            'cl.joining_date AS joiningDate',
            'vr.payment_status AS paymentStatus',
            'vr.amount AS amount',
            'vr.voucher_id AS voucherId',
            'br.name AS branchName',
            'cl.email AS email',
            'cl.dob AS dob',
            'cl.address AS address',
            'cl.status AS status',
            'vr.name AS voucherName',
            'vr.generation_date AS generationDate',
            'vr.product_type AS productType',
        ])
            .leftJoin(voucher_entity_1.VoucherEntity, 'vr', 'vr.id = cl.voucher_id')
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = cl.branch_id')
            .where(`cl.company_code = "${req.companyCode}"`)
            .andWhere(`cl.unit_code = "${req.unitCode}"`);
        if (req.clientId) {
            query.andWhere('cl.client_id = :clientId', { clientId: req.clientId });
        }
        if (req.name) {
            query.andWhere('cl.name LIKE :name', { name: `%${req.name}%` });
        }
        if (req.status) {
            query.andWhere('cl.status = :status', { status: req.status });
        }
        const result = await query.groupBy('vr.voucher_id').getRawMany();
        console.log(result, "++++++++++++++++++++++++++++++");
        return result;
    }
};
exports.ClientRepository = ClientRepository;
exports.ClientRepository = ClientRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], ClientRepository);
//# sourceMappingURL=client.repo.js.map