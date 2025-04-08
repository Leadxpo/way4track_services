import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubDealerStaffAdapter } from './sub-dealer-staff.adapter';
import { SubDealerStaffController } from './sub-dealer-staff.controller';
import { SubDealerStaffRepository } from './repo/sub-dealer-staff.repo';
import { SubDealerStaffService } from './sub-dealer.staff.service';
import { SubDelaerStaffEntity } from './entity/sub-dealer-staff.entity';
import { SubDealerModule } from 'src/sub-dealer/sub-dealer.module';

@Module({
    imports: [TypeOrmModule.forFeature([SubDelaerStaffEntity]), forwardRef(() => SubDealerModule),
    ],
    providers: [SubDealerStaffService, SubDealerStaffAdapter, SubDealerStaffRepository],
    controllers: [SubDealerStaffController],
    exports: [SubDealerStaffRepository, SubDealerStaffService],
})
export class SubDealerStaffModule { }
