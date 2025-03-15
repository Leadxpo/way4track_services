import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubDealerModule } from 'src/sub-dealer/sub-dealer.module';
import { ClientModule } from 'src/client/client.module';
import { StaffModule } from 'src/staff/staff.module';
import { ProductAssignModule } from 'src/product-assign/product-assign.module';
import { LedgerEntity } from './entity/ledger.entity';
import { LedgerRepository } from './repo/ledger.repo';
import { LedgerAdapter } from './ledger.adapter';
import { LedgerService } from './ledger .service';
import { LedgerController } from './ledger.controller';
import { GroupsModule } from 'src/groups/groups.module';


@Module({
    imports: [TypeOrmModule.forFeature([LedgerEntity]),
    forwardRef(() => SubDealerModule),
    forwardRef(() => ClientModule),
    forwardRef(() => ProductAssignModule),
    forwardRef(() => GroupsModule),
    forwardRef(() => StaffModule),],
    providers: [LedgerService, LedgerAdapter, LedgerRepository],
    controllers: [LedgerController],
    exports: [LedgerRepository, LedgerService]

})
export class LedgerModule { }
