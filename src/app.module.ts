import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssertsEntity } from './asserts/entity/asserts-entity';
import { BranchModule } from './branch/branch.module';
import { AssertModule } from './asserts/asserts.module';
import { BranchEntity } from './branch/entity/branch.entity';
import { ClientModule } from './client/client.module';
import { StaffModule } from './staff/staff.module';
import { ClientEntity } from './client/entity/client.entity';
import { StaffEntity } from './staff/entity/staff.entity';
import { OtpEntity } from './otp-generation/entity/otp-generation.entity';
import { OTPModule } from './otp-generation/otp-generation.module';
import { VendorModule } from './vendor/vendor.module';
import { VendorEntity } from './vendor/entity/vendor.entity';
import { SubDealerModule } from './sub-dealer/sub-dealer.module';
import { SubDealerEntity } from './sub-dealer/entity/sub-dealer.entity';
import { ProductModule } from './product/product.module';
import { ProductEntity } from './product/entity/product.entity';
import { RequestRaiseModule } from './request-raise/request-raise.module';
import { RequestRaiseEntity } from './request-raise/entity/request-raise.entity';
import { VoucherModule } from './voucher/voucher-module';
import { VoucherEntity } from './voucher/entity/voucher.entity';
import { WorkAllocationModule } from './work-allocation/work-allocation.module';
import { WorkAllocationEntity } from './work-allocation/entity/work-allocation.entity';
import { HiringModule } from './hiring/hiring.module';
import { HiringEntity } from './hiring/entity/hiring.entity';
import { TicketsModule } from './tickets/tickets.module';
import { TicketsEntity } from './tickets/entity/tickets.entity';
import { AppointmentModule } from './appointment/appointement.module';
import { AppointmentEntity } from './appointment/entity/appointement.entity';
import { ProductAssignModule } from './product-assign/product-assign.module';
import { ProductAssignEntity } from './product-assign/entity/product-assign.entity';
import { DashboardModule } from './dashboard/dashboard.module';
import { AttendanceModule } from './attendence/attendence.module';
import { AttendanceEntity } from './attendence/entity/attendence.entity';
import { EstimateModule } from './estimate/estimate.module';
import { EstimateEntity } from './estimate/entity/estimate.entity';
import { LoginModule } from './login/login.module';
import { PermissionModule } from './permissions/permissions.module';
import { PermissionEntity } from './permissions/entity/permissions.entity';
import { AccountModule } from './account/account.module';
import { AccountEntity } from './account/entity/account.entity';
import { NotificationModule } from './notifications/notification.module';
import { NotificationEntity } from './notifications/entity/notification.entity';
import { EmiPaymentRepository } from './voucher/repo/emi-payment-repo';
import { EmiPaymentEntity } from './voucher/entity/emi-payments';
// import { EMIModule } from './voucher/emi-module';
import { TechnicianWorksEntity } from './technician-works/entity/technician-works.entity';
import { TechnicianModule } from './technician-works/technician-work.module';
import { LettersEntity } from './letters/entity/letters.entity';
import { LettersModule } from './letters/letters.module';
import { DispatchEntity } from './dispatch/entity/dispatch.entity';
import { DispatchModule } from './dispatch/dispatch.module';
import { ProductTypeEntity } from './product-type/entity/product-type.entity';
import { ProductTypeModule } from './product-type/product-type.module';
import { DesignationModule } from './designation/designation.module';
import { DesignationEntity } from './designation/entity/designation.entity';
import { SalesworkModule } from './sales-man/sales-man.module';
import { SalesWorksEntity } from './sales-man/entity/sales-man.entity';
import { PayRollModule } from './payRoll/pay-roll.module';
import { PayrollEntity } from './payRoll/entity/pay-roll.entity';
import { LedgerModule } from './ledger/ledger.module';
import { LedgerEntity } from './ledger/entity/ledger.entity';
import { GroupsModule } from './groups/groups.module';
import { GroupsEntity } from './groups/entity/groups.entity';
import { VehicleTypeEntity } from './vehicle-type/entity/vehicle-type.entity';
import { VehicleTypeModule } from './vehicle-type/vehicle-type.module';
import { ServiceTypeEntity } from './service-type/entity/service.entity';
import { ServiceTypeModule } from './service-type/service.module';
import { SubDealerStaffModule } from './sub-dealer-staff/sub-dealer-staff.module';
import { SubDelaerStaffEntity } from './sub-dealer-staff/entity/sub-dealer-staff.entity';
import { WebsiteProductModule } from './website-product/website_product.module';
import { WebsiteProductService } from './website-product/website-product.service';
import { ApplicationModule } from './application/application.module';
import { AmenitiesModule } from './amenities/amenities.module';
import { WebsiteProductEntity } from './website-product/entity/website-entity';
import { DeviceEntity } from './devices/entity/devices-entity';
import { DevicesModule } from './devices/devices.module';
import { ApplicationEntity } from './application/entity/application-entity';
import { AmenitiesEntity } from './amenities/entity/amenities-entity';
import { ReviewsModule } from './reviews/reviews.module';
import { ReviewEntity } from './reviews/entity/reviews-entity';
import { PromotionalModule } from './promotional/promotional.module';
import { PromotionEntity } from './promotional/entity/promotional-entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'way4',
      entities: [AssertsEntity, BranchEntity, ClientEntity, StaffEntity, VendorEntity, SubDealerEntity, ProductEntity, RequestRaiseEntity, VoucherEntity, WorkAllocationEntity, HiringEntity, TicketsEntity, AppointmentEntity, ProductAssignEntity, AttendanceEntity, EstimateEntity, PermissionEntity, AccountEntity, NotificationEntity, TechnicianWorksEntity, LettersEntity, DispatchEntity, ProductTypeEntity, OtpEntity, DesignationEntity, SalesWorksEntity, PayrollEntity, LedgerEntity, GroupsEntity, VehicleTypeEntity, ServiceTypeEntity, SubDelaerStaffEntity, WebsiteProductEntity, DeviceEntity, ApplicationEntity, AmenitiesEntity, ReviewEntity, PromotionEntity],
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([AssertsEntity, BranchEntity, ClientEntity, StaffEntity, VendorEntity, SubDealerEntity, ProductEntity, RequestRaiseEntity, VoucherEntity, WorkAllocationEntity, HiringEntity, TicketsEntity, AppointmentEntity, ProductAssignEntity, AttendanceEntity, EstimateEntity, PermissionEntity, NotificationEntity, TechnicianWorksEntity, LettersEntity, DispatchEntity, ProductTypeEntity, OtpEntity, DesignationEntity, SalesWorksEntity, PayrollEntity, LedgerEntity, GroupsEntity, VehicleTypeEntity, ServiceTypeEntity, SubDelaerStaffEntity, WebsiteProductEntity, DeviceEntity, ApplicationEntity, AmenitiesEntity, ReviewEntity, PromotionEntity]),
    BranchModule,
    AssertModule,
    ClientModule,
    StaffModule,
    VendorModule,
    SubDealerModule,
    ProductModule,
    RequestRaiseModule,
    VoucherModule,
    WorkAllocationModule,
    HiringModule,
    TicketsModule,
    AppointmentModule,
    ProductAssignModule,
    DashboardModule,
    AttendanceModule,
    EstimateModule,
    LoginModule,
    PermissionModule,
    AccountModule,
    NotificationModule,
    // EMIModule,
    TechnicianModule,
    LettersModule,
    DispatchModule,
    ProductTypeModule,
    OTPModule,
    DesignationModule,
    SalesworkModule,
    PayRollModule,
    LedgerModule,
    GroupsModule,
    VehicleTypeModule,
    ServiceTypeModule,
    SubDealerStaffModule,
    WebsiteProductModule,
    ApplicationModule,
    AmenitiesModule,
    ReviewsModule,
    PromotionalModule,
    DevicesModule
  ],
  controllers: [],
  providers: [WebsiteProductService],
})
export class AppModule { }




