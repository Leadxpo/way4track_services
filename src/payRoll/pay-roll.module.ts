import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollEntity } from './entity/pay-roll.entity';
import { PayrollService } from './pay-roll.service';
import { PayrollAdapter } from './pay-roll.adapter';
import { PayrollRepository } from './repo/payroll.repo';
import { PayRollController } from './pay-roll.controller';

@Module({
    imports: [TypeOrmModule.forFeature([PayrollEntity])],
    providers: [PayrollService, PayrollAdapter, PayrollRepository],
    controllers: [PayRollController],
    exports: [PayrollRepository, PayrollService]

})
export class PayRollModule { }
