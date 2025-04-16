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
const otp_generation_entity_1 = require("./otp-generation/entity/otp-generation.entity");
const otp_generation_module_1 = require("./otp-generation/otp-generation.module");
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
const account_module_1 = require("./account/account.module");
const account_entity_1 = require("./account/entity/account.entity");
const notification_module_1 = require("./notifications/notification.module");
const notification_entity_1 = require("./notifications/entity/notification.entity");
const technician_works_entity_1 = require("./technician-works/entity/technician-works.entity");
const technician_work_module_1 = require("./technician-works/technician-work.module");
const letters_entity_1 = require("./letters/entity/letters.entity");
const letters_module_1 = require("./letters/letters.module");
const dispatch_entity_1 = require("./dispatch/entity/dispatch.entity");
const dispatch_module_1 = require("./dispatch/dispatch.module");
const product_type_entity_1 = require("./product-type/entity/product-type.entity");
const product_type_module_1 = require("./product-type/product-type.module");
const designation_module_1 = require("./designation/designation.module");
const designation_entity_1 = require("./designation/entity/designation.entity");
const sales_man_module_1 = require("./sales-man/sales-man.module");
const sales_man_entity_1 = require("./sales-man/entity/sales-man.entity");
const pay_roll_module_1 = require("./payRoll/pay-roll.module");
const pay_roll_entity_1 = require("./payRoll/entity/pay-roll.entity");
const ledger_module_1 = require("./ledger/ledger.module");
const ledger_entity_1 = require("./ledger/entity/ledger.entity");
const groups_module_1 = require("./groups/groups.module");
const groups_entity_1 = require("./groups/entity/groups.entity");
const vehicle_type_entity_1 = require("./vehicle-type/entity/vehicle-type.entity");
const vehicle_type_module_1 = require("./vehicle-type/vehicle-type.module");
const service_entity_1 = require("./service-type/entity/service.entity");
const service_module_1 = require("./service-type/service.module");
const sub_dealer_staff_module_1 = require("./sub-dealer-staff/sub-dealer-staff.module");
const sub_dealer_staff_entity_1 = require("./sub-dealer-staff/entity/sub-dealer-staff.entity");
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
                database: 'localdb',
                entities: [asserts_entity_1.AssertsEntity, branch_entity_1.BranchEntity, client_entity_1.ClientEntity, staff_entity_1.StaffEntity, vendor_entity_1.VendorEntity, sub_dealer_entity_1.SubDealerEntity, product_entity_1.ProductEntity, request_raise_entity_1.RequestRaiseEntity, voucher_entity_1.VoucherEntity, work_allocation_entity_1.WorkAllocationEntity, hiring_entity_1.HiringEntity, tickets_entity_1.TicketsEntity, appointement_entity_1.AppointmentEntity, product_assign_entity_1.ProductAssignEntity, attendence_entity_1.AttendanceEntity, estimate_entity_1.EstimateEntity, permissions_entity_1.PermissionEntity, account_entity_1.AccountEntity, notification_entity_1.NotificationEntity, technician_works_entity_1.TechnicianWorksEntity, letters_entity_1.LettersEntity, dispatch_entity_1.DispatchEntity, product_type_entity_1.ProductTypeEntity, otp_generation_entity_1.OtpEntity, designation_entity_1.DesignationEntity, sales_man_entity_1.SalesWorksEntity, pay_roll_entity_1.PayrollEntity, ledger_entity_1.LedgerEntity, groups_entity_1.GroupsEntity, vehicle_type_entity_1.VehicleTypeEntity, service_entity_1.ServiceTypeEntity, sub_dealer_staff_entity_1.SubDelaerStaffEntity],
                synchronize: true,
                logging: true,
            }),
            typeorm_1.TypeOrmModule.forFeature([asserts_entity_1.AssertsEntity, branch_entity_1.BranchEntity, client_entity_1.ClientEntity, staff_entity_1.StaffEntity, vendor_entity_1.VendorEntity, sub_dealer_entity_1.SubDealerEntity, product_entity_1.ProductEntity, request_raise_entity_1.RequestRaiseEntity, voucher_entity_1.VoucherEntity, work_allocation_entity_1.WorkAllocationEntity, hiring_entity_1.HiringEntity, tickets_entity_1.TicketsEntity, appointement_entity_1.AppointmentEntity, product_assign_entity_1.ProductAssignEntity, attendence_entity_1.AttendanceEntity, estimate_entity_1.EstimateEntity, permissions_entity_1.PermissionEntity, notification_entity_1.NotificationEntity, technician_works_entity_1.TechnicianWorksEntity, letters_entity_1.LettersEntity, dispatch_entity_1.DispatchEntity, product_type_entity_1.ProductTypeEntity, otp_generation_entity_1.OtpEntity, designation_entity_1.DesignationEntity, sales_man_entity_1.SalesWorksEntity, pay_roll_entity_1.PayrollEntity, ledger_entity_1.LedgerEntity, groups_entity_1.GroupsEntity, vehicle_type_entity_1.VehicleTypeEntity, service_entity_1.ServiceTypeEntity, sub_dealer_staff_entity_1.SubDelaerStaffEntity]),
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
            permissions_module_1.PermissionModule,
            account_module_1.AccountModule,
            notification_module_1.NotificationModule,
            technician_work_module_1.TechnicianModule,
            letters_module_1.LettersModule,
            dispatch_module_1.DispatchModule,
            product_type_module_1.ProductTypeModule,
            otp_generation_module_1.OTPModule,
            designation_module_1.DesignationModule,
            sales_man_module_1.SalesworkModule,
            pay_roll_module_1.PayRollModule,
            ledger_module_1.LedgerModule,
            groups_module_1.GroupsModule,
            vehicle_type_module_1.VehicleTypeModule,
            service_module_1.ServiceTypeModule,
            sub_dealer_staff_module_1.SubDealerStaffModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map