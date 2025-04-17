import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsiteProductModule } from 'src/website-product/website_product.module';
import { ApplicationEntity } from './entity/application-entity';
import { ApplicationRepository } from './repo/application.repo';
import { ApplicationAdapter } from './application.adapter';

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationEntity, ApplicationRepository]),
  forwardRef(() => WebsiteProductModule),
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService, ApplicationAdapter, ApplicationRepository],
})
export class ApplicationModule { }
