import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from 'src/account/account.module';
import { EmiPaymentEntity } from './entity/emi-payments';
import { EmiPaymentRepository } from './repo/emi-payment-repo';
import { VoucherModule } from './voucher-module';

@Module({
    imports: [
        TypeOrmModule.forFeature([EmiPaymentEntity, EmiPaymentRepository]),

        forwardRef(() => AccountModule),
        forwardRef(() => VoucherModule),

    ],
    controllers: [],
    providers: [EmiPaymentRepository,],
    exports: [EmiPaymentRepository],
})
export class EMIModule { }
