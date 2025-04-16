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
exports.RequestRaiseRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const request_raise_entity_1 = require("../entity/request-raise.entity");
const branch_entity_1 = require("../../branch/entity/branch.entity");
const client_status_enum_1 = require("../../client/enum/client-status.enum");
let RequestRaiseRepository = class RequestRaiseRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(request_raise_entity_1.RequestRaiseEntity, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async getRequestBranchWise(req) {
        const query = this.createQueryBuilder('re')
            .select([
            'br.name AS branch',
            're.products AS products',
        ])
            .leftJoin(branch_entity_1.BranchEntity, 'br', 'br.id = re.branch_id')
            .where('re.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('re.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('re.status = :status', { status: client_status_enum_1.ClientStatusEnum.pending })
            .andWhere('re.request_type = :requestType', { requestType: request_raise_entity_1.RequestType.products });
        if (req.branch) {
            query.andWhere('br.name = :branch', { branch: req.branch });
        }
        query.groupBy('br.name, re.products');
        const result = await query.getRawMany();
        const transformedResult = [];
        result.forEach((item) => {
            const existingBranch = transformedResult.find(branch => branch.location === item.branch);
            const productList = typeof item.products === 'string'
                ? JSON.parse(item.products)
                : item.products || [];
            if (existingBranch) {
                productList.forEach((product) => {
                    const existingProduct = existingBranch.requests.find(req => req.name === product.productType);
                    if (existingProduct) {
                        existingProduct.count += product.quantity;
                    }
                    else {
                        existingBranch.requests.push({
                            name: product.productType,
                            count: product.quantity,
                        });
                    }
                });
            }
            else {
                transformedResult.push({
                    location: item.branch,
                    requests: productList.map(product => ({
                        name: product.productType,
                        count: product.quantity,
                    })),
                });
            }
        });
        return transformedResult;
    }
};
exports.RequestRaiseRepository = RequestRaiseRepository;
exports.RequestRaiseRepository = RequestRaiseRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], RequestRaiseRepository);
//# sourceMappingURL=request-raise.repo.js.map