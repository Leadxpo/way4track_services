import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmenitiesRepository } from './repo/amenities.repo';
import { AmenitiesService } from './amenities.service';
import { AmenitiesController } from './amenities.controller';
import { AmenitiesAdapter } from './amenities.adapter';
import { AmenitiesEntity } from './entity/amenities-entity';
import { WebsiteProductModule } from 'src/website-product/website_product.module';

@Module({
  imports: [TypeOrmModule.forFeature([AmenitiesEntity, AmenitiesRepository]),
  forwardRef(() => WebsiteProductModule),
  ],
  controllers: [AmenitiesController],
  providers: [AmenitiesService, AmenitiesAdapter, AmenitiesRepository],
})
export class AmenitiesModule { }
