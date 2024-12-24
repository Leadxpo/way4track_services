import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StaffModule } from "src/staff/staff.module";
import { SubDealerModule } from "src/sub-dealer/sub-dealer.module";
import { LoginService } from "./login.service";
import { StaffRepository } from "src/staff/repo/staff-repo";
import { SubDealerRepository } from "src/sub-dealer/repo/sub-dealer.repo";
import { LoginController } from "./login.controller";


@Module({
    imports: [
        TypeOrmModule.forFeature([]),
        forwardRef(() => SubDealerModule),
        forwardRef(() => StaffModule),

    ],
    providers: [
        LoginService,
        StaffRepository,
        SubDealerRepository,
    ],
    controllers: [LoginController],
})
export class LoginModule { }
