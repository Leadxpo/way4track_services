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
import { EstimateAssignModule } from './estimate/estimate.module';
import { EstimateEntity } from './estimate/entity/estimate.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'WayTrackService',
      entities: [AssertsEntity, BranchEntity, ClientEntity, StaffEntity, VendorEntity, SubDealerEntity, ProductEntity, RequestRaiseEntity, VoucherEntity, WorkAllocationEntity, HiringEntity, TicketsEntity, AppointmentEntity, ProductAssignEntity, AttendanceEntity, EstimateEntity],
      synchronize: false,
      logging: true,
    }),
    TypeOrmModule.forFeature([AssertsEntity, BranchEntity, ClientEntity, StaffEntity, VendorEntity, SubDealerEntity, ProductEntity, RequestRaiseEntity, VoucherEntity, WorkAllocationEntity, HiringEntity, TicketsEntity, AppointmentEntity, ProductAssignEntity, AttendanceEntity, EstimateEntity]),
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
    EstimateAssignModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }



