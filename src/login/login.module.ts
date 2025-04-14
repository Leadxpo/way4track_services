import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StaffModule } from "src/staff/staff.module";
import { SubDealerModule } from "src/sub-dealer/sub-dealer.module";
import { LoginService } from "./login.service";
import { StaffRepository } from "src/staff/repo/staff-repo";
import { SubDealerRepository } from "src/sub-dealer/repo/sub-dealer.repo";
import { LoginController } from "./login.controller";
import { SubDealerStaffModule } from "src/sub-dealer-staff/sub-dealer-staff.module";
import { SubDealerStaffRepository } from "src/sub-dealer-staff/repo/sub-dealer-staff.repo";


@Module({
    imports: [
        TypeOrmModule.forFeature([]),
        forwardRef(() => SubDealerModule),
        forwardRef(() => StaffModule),
        forwardRef(() => SubDealerStaffModule),


    ],
    providers: [
        LoginService,
        StaffRepository,
        SubDealerRepository,
        SubDealerStaffRepository
    ],
    controllers: [LoginController],
})
export class LoginModule { }
