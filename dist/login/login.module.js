"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const staff_module_1 = require("../staff/staff.module");
const sub_dealer_module_1 = require("../sub-dealer/sub-dealer.module");
const login_service_1 = require("./login.service");
const staff_repo_1 = require("../staff/repo/staff-repo");
const sub_dealer_repo_1 = require("../sub-dealer/repo/sub-dealer.repo");
const login_controller_1 = require("./login.controller");
let LoginModule = class LoginModule {
};
exports.LoginModule = LoginModule;
exports.LoginModule = LoginModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([]),
            (0, common_1.forwardRef)(() => sub_dealer_module_1.SubDealerModule),
            (0, common_1.forwardRef)(() => staff_module_1.StaffModule),
        ],
        providers: [
            login_service_1.LoginService,
            staff_repo_1.StaffRepository,
            sub_dealer_repo_1.SubDealerRepository,
        ],
        controllers: [login_controller_1.LoginController],
    })
], LoginModule);
//# sourceMappingURL=login.module.js.map