import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssertsEntity } from './entity/asserts-entity';
import { AssertsController } from './asserts.controller';
import { AssertsService } from './asserts.service';
import { AssertsAdapter } from './asserts.adapter';
import { AssertsRepository } from './repo/asserts.repo';
import { VoucherModule } from 'src/voucher/voucher-module';
import { BranchModule } from 'src/branch/branch.module';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { VoucherRepository } from 'src/voucher/repo/voucher.repo';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([AssertsEntity, VoucherEntity]),
    MulterModule.register({ dest: './uploads' }),
    forwardRef(() => VoucherModule),
    forwardRef(() => BranchModule) // 🔥 Correctly placed
  ],
  controllers: [AssertsController],
  providers: [
    AssertsService,
    AssertsAdapter,
    VoucherRepository,
    {
      provide: AssertsRepository,
      useClass: AssertsRepository,
    },
  ],
  exports: [AssertsRepository, AssertsService],
})
export class AssertModule { }
