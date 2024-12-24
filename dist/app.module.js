"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const asserts_entity_1 = require("./asserts/entity/asserts-entity");
const branch_module_1 = require("./branch/branch.module");
const asserts_module_1 = require("./asserts/asserts.module");
const branch_entity_1 = require("./branch/entity/branch.entity");
const client_module_1 = require("./client/client.module");
const staff_module_1 = require("./staff/staff.module");
const client_entity_1 = require("./client/entity/client.entity");
const staff_entity_1 = require("./staff/entity/staff.entity");
const vendor_module_1 = require("./vendor/vendor.module");
const vendor_entity_1 = require("./vendor/entity/vendor.entity");
const sub_dealer_module_1 = require("./sub-dealer/sub-dealer.module");
const sub_dealer_entity_1 = require("./sub-dealer/entity/sub-dealer.entity");
const product_module_1 = require("./product/product.module");
const product_entity_1 = require("./product/entity/product.entity");
const request_raise_module_1 = require("./request-raise/request-raise.module");
const request_raise_entity_1 = require("./request-raise/entity/request-raise.entity");
const voucher_module_1 = require("./voucher/voucher-module");
const voucher_entity_1 = require("./voucher/entity/voucher.entity");
const work_allocation_module_1 = require("./work-allocation/work-allocation.module");
const work_allocation_entity_1 = require("./work-allocation/entity/work-allocation.entity");
const hiring_module_1 = require("./hiring/hiring.module");
const hiring_entity_1 = require("./hiring/entity/hiring.entity");
const tickets_module_1 = require("./tickets/tickets.module");
const tickets_entity_1 = require("./tickets/entity/tickets.entity");
const appointement_module_1 = require("./appointment/appointement.module");
const appointement_entity_1 = require("./appointment/entity/appointement.entity");
const product_assign_module_1 = require("./product-assign/product-assign.module");
const product_assign_entity_1 = require("./product-assign/entity/product-assign.entity");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const attendence_module_1 = require("./attendence/attendence.module");
const attendence_entity_1 = require("./attendence/entity/attendence.entity");
const estimate_module_1 = require("./estimate/estimate.module");
const estimate_entity_1 = require("./estimate/entity/estimate.entity");
const login_module_1 = require("./login/login.module");
const permissions_module_1 = require("./permissions/permissions.module");
const permissions_entity_1 = require("./permissions/entity/permissions.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: 'localhost',
                port: 3306,
                username: 'root',
                password: 'root',
                database: 'waytrackservice',
                entities: [asserts_entity_1.AssertsEntity, branch_entity_1.BranchEntity, client_entity_1.ClientEntity, staff_entity_1.StaffEntity, vendor_entity_1.VendorEntity, sub_dealer_entity_1.SubDealerEntity, product_entity_1.ProductEntity, request_raise_entity_1.RequestRaiseEntity, voucher_entity_1.VoucherEntity, work_allocation_entity_1.WorkAllocationEntity, hiring_entity_1.HiringEntity, tickets_entity_1.TicketsEntity, appointement_entity_1.AppointmentEntity, product_assign_entity_1.ProductAssignEntity, attendence_entity_1.AttendanceEntity, estimate_entity_1.EstimateEntity, permissions_entity_1.PermissionEntity],
                synchronize: true,
                logging: true,
            }),
            typeorm_1.TypeOrmModule.forFeature([asserts_entity_1.AssertsEntity, branch_entity_1.BranchEntity, client_entity_1.ClientEntity, staff_entity_1.StaffEntity, vendor_entity_1.VendorEntity, sub_dealer_entity_1.SubDealerEntity, product_entity_1.ProductEntity, request_raise_entity_1.RequestRaiseEntity, voucher_entity_1.VoucherEntity, work_allocation_entity_1.WorkAllocationEntity, hiring_entity_1.HiringEntity, tickets_entity_1.TicketsEntity, appointement_entity_1.AppointmentEntity, product_assign_entity_1.ProductAssignEntity, attendence_entity_1.AttendanceEntity, estimate_entity_1.EstimateEntity, permissions_entity_1.PermissionEntity]),
            branch_module_1.BranchModule,
            asserts_module_1.AssertModule,
            client_module_1.ClientModule,
            staff_module_1.StaffModule,
            vendor_module_1.VendorModule,
            sub_dealer_module_1.SubDealerModule,
            product_module_1.ProductModule,
            request_raise_module_1.RequestRaiseModule,
            voucher_module_1.VoucherModule,
            work_allocation_module_1.WorkAllocationModule,
            hiring_module_1.HiringModule,
            tickets_module_1.TicketsModule,
            appointement_module_1.AppointmentModule,
            product_assign_module_1.ProductAssignModule,
            dashboard_module_1.DashboardModule,
            attendence_module_1.AttendanceModule,
            estimate_module_1.EstimateModule,
            login_module_1.LoginModule,
            permissions_module_1.PermissionModule
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map