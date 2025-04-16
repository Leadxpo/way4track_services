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
exports.VendorRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const vendor_entity_1 = require("../entity/vendor.entity");
let VendorRepository = class VendorRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(vendor_entity_1.VendorEntity, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async getVendorData(req) {
        const query = this.createQueryBuilder('ve')
            .select([
            've.vendor_id AS vendorId',
            've.vendor_phone_number AS phoneNumber',
            've.name AS name',
            've.starting_date AS joiningDate',
            'vr.payment_status AS paymentStatus',
            'vr.amount AS amount',
            'vr.voucher_id as voucherId',
        ])
            .leftJoin('ve.voucherId', 'vr')
            .where(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`);
        if (req.fromDate) {
            query.andWhere('ve.starting_date >= :fromDate', { fromDate: req.fromDate });
        }
        if (req.toDate) {
            query.andWhere('ve.starting_date <= :toDate', { toDate: req.toDate });
        }
        if (req.paymentStatus) {
            query.andWhere('vr.payment_status = :paymentStatus', { paymentStatus: req.paymentStatus });
        }
        const result = await query.getRawMany();
        return result;
    }
    async getDetailvendorData(req) {
        const query = await this.createQueryBuilder('ve')
            .select([
            've.vendor_id AS vendorId',
            've.vendor_phone_number AS phoneNumber',
            've.name AS name',
            've.starting_date AS joiningDate',
            'vr.payment_status AS paymentStatus',
            'vr.amount AS amount',
            'vr.voucher_id AS voucherId',
            've.email AS email',
            'vr.quantity AS quantity',
            've.address AS address',
            'vr.name AS voucherName',
            'vr.generation_date AS generationDate',
            've.product_type AS productType',
        ])
            .leftJoin('ve.voucherId', 'vr')
            .where(`ve.vendor_id = "${req.vendorId}"`)
            .andWhere(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`)
            .getRawMany();
        return query;
    }
};
exports.VendorRepository = VendorRepository;
exports.VendorRepository = VendorRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], VendorRepository);
//# sourceMappingURL=vendor.repo.js.map