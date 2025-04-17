


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionEntity } from './entity/promotional-entity';
import { PromotionRepository } from './repo/promotional.repo';
import { PromotionService } from './promotional.service';
import { PromotionController } from './promotional.controller';
import { PromotionAdapter } from './promotional-adapter';


@Module({
  imports: [TypeOrmModule.forFeature([PromotionEntity])],
  providers: [PromotionService, PromotionAdapter, PromotionRepository],
  controllers: [PromotionController],
  exports: [PromotionRepository, PromotionService]

})
export class PromotionalModule { }

