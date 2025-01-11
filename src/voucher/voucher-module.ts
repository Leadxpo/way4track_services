import { forwardRef, Module } from '@nestjs/common';
import { VoucherRepository } from './repo/voucher.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoucherEntity } from './entity/voucher.entity';
import { VoucherController } from './voucher-controller';
import { VoucherService } from './voucher-service';
import { VoucherAdapter } from './voucher.adapter';
import { BranchModule } from 'src/branch/branch.module';
import { VendorModule } from 'src/vendor/vendor.module';
import { SubDealerModule } from 'src/sub-dealer/sub-dealer.module';
import { ClientModule } from 'src/client/client.module';
import { AccountModule } from 'src/account/account.module';
import { EstimateModule } from 'src/estimate/estimate.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([VoucherEntity, VoucherRepository]),
        forwardRef(() => BranchModule),
        forwardRef(() => VendorModule),
        forwardRef(() => SubDealerModule),
        forwardRef(() => ClientModule),
        forwardRef(() => AccountModule),
        forwardRef(() => EstimateModule)
    ],
    controllers: [VoucherController],
    providers: [VoucherService, VoucherAdapter, VoucherRepository],
    exports: [VoucherRepository, VoucherService],
})
export class VoucherModule { }
