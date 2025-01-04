import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './entity/account.entity';
import { AccountService } from './account.service';
import { AccountAdapter } from './account.adapter';
import { AccountRepository } from './repo/account.repo';
import { AccountController } from './account.controller';
import { BranchModule } from 'src/branch/branch.module';
import { VoucherModule } from 'src/voucher/voucher-module';



@Module({
    imports: [TypeOrmModule.forFeature([AccountEntity]),
    forwardRef(() => BranchModule),
    forwardRef(() => VoucherModule)],
    providers: [AccountService, AccountAdapter, AccountRepository],
    controllers: [AccountController],
    exports: [AccountRepository, AccountService]
})
export class AccountModule { }
