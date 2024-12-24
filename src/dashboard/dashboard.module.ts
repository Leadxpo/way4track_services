import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { ProductAssignDashboardService } from './product-assign-dashboard.service';
import { ClientDashboardService } from './client-dashboards.service';
import { AssertDashboardService } from './assert-dashboard.service';
import { StaffDashboardService } from './staff-dashboard.service';
import { SubDealerDashboardService } from './sub-dealer-dashboard-service';
import { VendorDashboardService } from './vendor-dashboard.service';
import { TicketsDashboardService } from './tickets-dashboard.service';
import { ProductAssignRepository } from 'src/product-assign/repo/product-assign.repo';
import { ClientRepository } from 'src/client/repo/client.repo';
import { AssertsRepository } from 'src/asserts/repo/asserts.repo';
import { StaffRepository } from 'src/staff/repo/staff-repo';
import { SubDealerRepository } from 'src/sub-dealer/repo/sub-dealer.repo';
import { VendorRepository } from 'src/vendor/repo/vendor.repo';
import { TicketsRepository } from 'src/tickets/repo/tickets.repo';
import { ProductAssignModule } from 'src/product-assign/product-assign.module';
import { ClientModule } from 'src/client/client.module';
import { AssertModule } from 'src/asserts/asserts.module';
import { StaffModule } from 'src/staff/staff.module';
import { SubDealerModule } from 'src/sub-dealer/sub-dealer.module';
import { VendorModule } from 'src/vendor/vendor.module';
import { TicketsModule } from 'src/tickets/tickets.module';
import { VoucherModule } from 'src/voucher/voucher-module';
import { VoucherRepository } from 'src/voucher/repo/voucher.repo';
import { VoucherDashboardService } from './voucher-dashboard-service';
import { AppointmentDashboardService } from './appointment-dashboard.service';
import { AppointmentRepository } from 'src/appointment/repo/appointement.repo';
import { AppointmentModule } from 'src/appointment/appointement.module';
import { EstimateModule } from 'src/estimate/estimate.module';
import { EstimateDashboardService } from './estimate-dashboard.service';
import { EstimateRepository } from 'src/estimate/repo/estimate.repo';

@Module({
    imports: [
        TypeOrmModule.forFeature([]),
        forwardRef(() => ProductAssignModule),
        forwardRef(() => ClientModule),
        forwardRef(() => AssertModule),
        forwardRef(() => SubDealerModule),
        forwardRef(() => VendorModule),
        forwardRef(() => TicketsModule),
        forwardRef(() => VoucherModule),
        forwardRef(() => StaffModule),
        forwardRef(() => AppointmentModule),
        forwardRef(() => EstimateModule),

    ],
    providers: [
        ProductAssignDashboardService,
        ClientDashboardService,
        AssertDashboardService,
        StaffDashboardService,
        SubDealerDashboardService,
        VendorDashboardService,
        VoucherDashboardService,
        TicketsDashboardService,
        AppointmentDashboardService,
        ProductAssignRepository,
        EstimateDashboardService,
        ClientRepository,
        AssertsRepository,
        StaffRepository,
        SubDealerRepository,
        VendorRepository,
        TicketsRepository,
        VoucherRepository,
        AppointmentRepository,
        EstimateRepository
    ],
    controllers: [DashboardController],
})
export class DashboardModule { }
