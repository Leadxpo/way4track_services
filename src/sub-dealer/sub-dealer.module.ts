import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubDealerEntity } from './entity/sub-dealer.entity';
import { SubDealerController } from './sub-dealer.controller';
import { SubDealerService } from './sub-dealer.service';
import { SubDealerRepository } from './repo/sub-dealer.repo';
import { SubDealerAdapter } from './sub-dealer.adapter';
import { VoucherModule } from 'src/voucher/voucher-module';



@Module({
    imports: [TypeOrmModule.forFeature([SubDealerEntity]),
    forwardRef(() => VoucherModule)],
    controllers: [SubDealerController],
    providers: [SubDealerService, SubDealerRepository, SubDealerAdapter],
    exports: [SubDealerService, SubDealerRepository]
})
export class SubDealerModule { }
