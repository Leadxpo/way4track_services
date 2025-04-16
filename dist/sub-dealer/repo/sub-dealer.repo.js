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
exports.SubDealerRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const sub_dealer_entity_1 = require("../entity/sub-dealer.entity");
let SubDealerRepository = class SubDealerRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(sub_dealer_entity_1.SubDealerEntity, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async getSubDealerData(req) {
        const query = this.createQueryBuilder('sb')
            .select([
            'sb.sub_dealer_id AS SubDealerId',
            'sb.sub_dealer_phone_number AS phoneNumber',
            'sb.name AS name',
            'sb.starting_date AS joiningDate',
            'vr.payment_status AS paymentStatus',
            'vr.amount AS amount',
            'vr.voucher_id as voucherId',
        ])
            .leftJoin('sb.voucherId', 'vr')
            .where(`sb.company_code = "${req.companyCode}"`)
            .andWhere(`sb.unit_code = "${req.unitCode}"`);
        if (req.fromDate) {
            query.andWhere('sb.starting_date >= :fromDate', { fromDate: req.fromDate });
        }
        if (req.toDate) {
            query.andWhere('sb.starting_date <= :toDate', { toDate: req.toDate });
        }
        if (req.paymentStatus) {
            query.andWhere('vr.payment_status = :paymentStatus', { paymentStatus: req.paymentStatus });
        }
        const result = await query.getRawMany();
        return result;
    }
    async getDetailSubDealerData(req) {
        const query = await this.createQueryBuilder('sb')
            .select([
            'sb.sub_dealer_id AS subDealerId',
            'sb.sub_dealer_phone_number AS phoneNumber',
            'sb.name AS name',
            'sb.starting_date AS joiningDate',
            'vr.payment_status AS paymentStatus',
            'vr.amount AS amount',
            'vr.quantity as quantity',
            'vr.voucher_id AS voucherId',
            'sb.email AS email',
            'sb.address AS address',
            'vr.name AS voucherName',
            'vr.generation_date AS generationDate',
            'vr.product_type AS productType',
        ])
            .leftJoin('sb.voucherId', 'vr')
            .where(`sb.sub_dealer_id='${req.subDealerId}'`)
            .andWhere(`sb.company_code = "${req.companyCode}"`)
            .andWhere(`sb.unit_code = "${req.unitCode}"`)
            .groupBy(`vr.voucher_id `)
            .getRawOne();
        return query;
    }
    async SubDealerLoginDetails(req) {
        const query = this.createQueryBuilder('sf')
            .select(`
                sf.sub_dealer_id AS staffId,
                sf.password AS staffPassword,
                sf.name as staffName,
                pa.permissions AS staffPermissions
            `)
            .leftJoin('sf.permissions', 'pa')
            .where(`sf.sub_dealer_id = :staffId AND sf.password = :staffPassword`, {
            staffId: req.staffId,
            staffPassword: req.password
        })
            .andWhere(`sf.company_code = :companyCode AND sf.unit_code = :unitCode`, {
            companyCode: req.companyCode,
            unitCode: req.unitCode
        })
            .getRawOne();
        return query;
    }
};
exports.SubDealerRepository = SubDealerRepository;
exports.SubDealerRepository = SubDealerRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], SubDealerRepository);
//# sourceMappingURL=sub-dealer.repo.js.map