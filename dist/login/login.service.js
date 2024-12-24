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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const common_response_1 = require("../models/common-response");
const staff_repo_1 = require("../staff/repo/staff-repo");
const staff_entity_1 = require("../staff/entity/staff.entity");
const sub_dealer_repo_1 = require("../sub-dealer/repo/sub-dealer.repo");
let LoginService = class LoginService {
    constructor(staffRepository, subDealerRepo) {
        this.staffRepository = staffRepository;
        this.subDealerRepo = subDealerRepo;
    }
    async LoginDetails(req) {
        let login;
        if (!req.staffId || !req.password || !req.designation || !req.companyCode || !req.unitCode) {
            throw new Error('Missing required login details.');
        }
        if (req.designation === staff_entity_1.DesignationEnum.SubDealer) {
            login = await this.subDealerRepo.SubDealerLoginDetails(req);
        }
        else {
            login = await this.staffRepository.LoginDetails(req);
        }
        if (!login) {
            return new common_response_1.CommonResponse(false, 401, "Data does not match the credentials.", []);
        }
        else {
            return new common_response_1.CommonResponse(true, 200, "Login successful.", login);
        }
    }
};
exports.LoginService = LoginService;
exports.LoginService = LoginService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(staff_repo_1.StaffRepository)),
    __metadata("design:paramtypes", [staff_repo_1.StaffRepository,
        sub_dealer_repo_1.SubDealerRepository])
], LoginService);
//# sourceMappingURL=login.service.js.map