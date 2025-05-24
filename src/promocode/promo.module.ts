import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {PromocodeController } from './promo.controller';
import {PromocodeAdapter } from './promo.adapter';
import {PromoEntity } from './entity/promo.entity';
import {PromocodeService } from './promo.services';
import {PromocodesRepository } from './repo/promo.repo';

@Module({
  imports: [TypeOrmModule.forFeature([PromoEntity])],
  controllers: [PromocodeController],
  providers: [PromocodeService,PromocodeAdapter,PromocodesRepository],
  exports: [PromocodesRepository,PromocodeService]

})
export class PromocodesModule { }
