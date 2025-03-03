import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DesignationEntity } from './entity/designation.entity';
import { DesignationService } from './designation.service';
import { DesignationAdapter } from './designation.adapter';
import { DesignationRepository } from './repo/designation.repo';
import { DesignationController } from './designation.controller';


@Module({
  imports: [TypeOrmModule.forFeature([DesignationEntity])],
  providers: [DesignationService, DesignationAdapter, DesignationRepository],
  controllers: [DesignationController],
  exports: [DesignationRepository, DesignationService]

})
export class DesignationModule { }
