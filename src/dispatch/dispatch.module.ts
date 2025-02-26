import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DispatchEntity } from './entity/dispatch.entity';
import { DispatchController } from './dispatch.controller';
import { DispatchAdapter } from './dispatch.adapter';
import { DispatchService } from './dispatch.service';
import { DispatchRepository } from './repo/dispatch.repo';
import { SubDealerModule } from 'src/sub-dealer/sub-dealer.module';
import { ClientModule } from 'src/client/client.module';
import { StaffModule } from 'src/staff/staff.module';
import { ProductAssignModule } from 'src/product-assign/product-assign.module';


@Module({
    imports: [TypeOrmModule.forFeature([DispatchEntity]),
    forwardRef(() => SubDealerModule),
    forwardRef(() => ClientModule),
    forwardRef(() => ProductAssignModule),
    forwardRef(() => StaffModule),],
    providers: [DispatchService, DispatchAdapter, DispatchRepository],
    controllers: [DispatchController],
    exports: [DispatchRepository, DispatchService]

})
export class DispatchModule { }
