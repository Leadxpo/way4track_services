import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssertsEntity } from './entity/asserts-entity';
import { AssertsController } from './asserts.controller';
import { AssertsService } from './asserts.service';
import { AssertsAdapter } from './asserts.adapter';
import { AssertsRepository } from './repo/asserts.repo';
import { VoucherModule } from 'src/voucher/voucher-module';

@Module({
    imports: [TypeOrmModule.forFeature([AssertsEntity]),
    forwardRef(() => VoucherModule)],
    controllers: [AssertsController],
    providers: [AssertsService, AssertsAdapter,  {
        provide: AssertsRepository,
        useClass: AssertsRepository, 
      },],
    exports: [AssertsRepository, AssertsService]
})
export class AssertModule { }
