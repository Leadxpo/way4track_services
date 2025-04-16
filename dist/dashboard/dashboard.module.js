"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const dashboard_controller_1 = require("./dashboard.controller");
const product_assign_dashboard_service_1 = require("./product-assign-dashboard.service");
const client_dashboards_service_1 = require("./client-dashboards.service");
const assert_dashboard_service_1 = require("./assert-dashboard.service");
const staff_dashboard_service_1 = require("./staff-dashboard.service");
const sub_dealer_dashboard_service_1 = require("./sub-dealer-dashboard-service");
const vendor_dashboard_service_1 = require("./vendor-dashboard.service");
const tickets_dashboard_service_1 = require("./tickets-dashboard.service");
const product_assign_repo_1 = require("../product-assign/repo/product-assign.repo");
const client_repo_1 = require("../client/repo/client.repo");
const asserts_repo_1 = require("../asserts/repo/asserts.repo");
const staff_repo_1 = require("../staff/repo/staff-repo");
const sub_dealer_repo_1 = require("../sub-dealer/repo/sub-dealer.repo");
const vendor_repo_1 = require("../vendor/repo/vendor.repo");
const tickets_repo_1 = require("../tickets/repo/tickets.repo");
const product_assign_module_1 = require("../product-assign/product-assign.module");
const client_module_1 = require("../client/client.module");
const asserts_module_1 = require("../asserts/asserts.module");
const staff_module_1 = require("../staff/staff.module");
const sub_dealer_module_1 = require("../sub-dealer/sub-dealer.module");
const vendor_module_1 = require("../vendor/vendor.module");
const tickets_module_1 = require("../tickets/tickets.module");
const voucher_module_1 = require("../voucher/voucher-module");
const voucher_repo_1 = require("../voucher/repo/voucher.repo");
const voucher_dashboard_service_1 = require("./voucher-dashboard-service");
const appointment_dashboard_service_1 = require("./appointment-dashboard.service");
const appointement_repo_1 = require("../appointment/repo/appointement.repo");
const appointement_module_1 = require("../appointment/appointement.module");
const estimate_module_1 = require("../estimate/estimate.module");
const estimate_dashboard_service_1 = require("./estimate-dashboard.service");
const estimate_repo_1 = require("../estimate/repo/estimate.repo");
const account_dashboard_service_1 = require("./account.dashboard.service");
const account_module_1 = require("../account/account.module");
const pay_roll_module_1 = require("../payRoll/pay-roll.module");
const payroll_repo_1 = require("../payRoll/repo/payroll.repo");
let DashboardModule = class DashboardModule {
};
exports.DashboardModule = DashboardModule;
exports.DashboardModule = DashboardModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([]),
            (0, common_1.forwardRef)(() => product_assign_module_1.ProductAssignModule),
            (0, common_1.forwardRef)(() => client_module_1.ClientModule),
            (0, common_1.forwardRef)(() => asserts_module_1.AssertModule),
            (0, common_1.forwardRef)(() => sub_dealer_module_1.SubDealerModule),
            (0, common_1.forwardRef)(() => vendor_module_1.VendorModule),
            (0, common_1.forwardRef)(() => tickets_module_1.TicketsModule),
            (0, common_1.forwardRef)(() => voucher_module_1.VoucherModule),
            (0, common_1.forwardRef)(() => staff_module_1.StaffModule),
            (0, common_1.forwardRef)(() => appointement_module_1.AppointmentModule),
            (0, common_1.forwardRef)(() => estimate_module_1.EstimateModule),
            (0, common_1.forwardRef)(() => account_module_1.AccountModule),
            (0, common_1.forwardRef)(() => pay_roll_module_1.PayRollModule),
        ],
        providers: [
            product_assign_dashboard_service_1.ProductAssignDashboardService,
            account_dashboard_service_1.AccountDashboardService,
            client_dashboards_service_1.ClientDashboardService,
            assert_dashboard_service_1.AssertDashboardService,
            staff_dashboard_service_1.StaffDashboardService,
            sub_dealer_dashboard_service_1.SubDealerDashboardService,
            vendor_dashboard_service_1.VendorDashboardService,
            voucher_dashboard_service_1.VoucherDashboardService,
            tickets_dashboard_service_1.TicketsDashboardService,
            appointment_dashboard_service_1.AppointmentDashboardService,
            product_assign_repo_1.ProductAssignRepository,
            estimate_dashboard_service_1.EstimateDashboardService,
            client_repo_1.ClientRepository,
            asserts_repo_1.AssertsRepository,
            staff_repo_1.StaffRepository,
            sub_dealer_repo_1.SubDealerRepository,
            vendor_repo_1.VendorRepository,
            tickets_repo_1.TicketsRepository,
            voucher_repo_1.VoucherRepository,
            appointement_repo_1.AppointmentRepository,
            estimate_repo_1.EstimateRepository,
            payroll_repo_1.PayrollRepository
        ],
        controllers: [dashboard_controller_1.DashboardController],
    })
], DashboardModule);
//# sourceMappingURL=dashboard.module.js.map