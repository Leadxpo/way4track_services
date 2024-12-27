import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchEntity } from './entity/branch.entity';
import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';
import { BranchRepository } from './repo/branch.repo';
import { BranchAdapter } from './branch.adapter';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [TypeOrmModule.forFeature([BranchEntity]), MulterModule.register({
        dest: './uploads', 
    }),],
    controllers: [BranchController],
    providers: [BranchService, BranchRepository, BranchAdapter],
    exports: [BranchRepository, BranchService],
})
export class BranchModule { }
