import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchEntity } from './entity/branch.entity';
import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';
import { BranchRepository } from './repo/branch.repo';
import { BranchAdapter } from './branch.adapter';

@Module({
    imports: [TypeOrmModule.forFeature([BranchEntity])],
    controllers: [BranchController],
    providers: [BranchService, BranchRepository, BranchAdapter],
    exports: [BranchRepository, BranchService],
})
export class BranchModule { }
