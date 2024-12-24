import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HiringEntity } from './entity/hiring.entity';
import { HiringService } from './hiring.service';
import { HiringController } from './hiring.controller';
import { HiringAdapter } from './hiring.adapter';
import { HiringRepository } from './repo/hiring.repo';

@Module({
  imports: [TypeOrmModule.forFeature([HiringEntity])],
  providers: [HiringService, HiringAdapter, HiringRepository],
  controllers: [HiringController],
  exports: [HiringRepository, HiringService]

})
export class HiringModule { }
