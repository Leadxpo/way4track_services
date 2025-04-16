
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsiteProductEntity } from './entity/website-entity';
import { WebsiteProductRepository } from './repo/website-product.repo';
import { WebsiteProductAdapter } from './website-product.adapter';
import { WebsiteProductService } from './website-product.service';
import { WebsiteProductController } from './website-product.controller';



@Module({
  imports: [TypeOrmModule.forFeature([WebsiteProductEntity])],
  providers: [WebsiteProductService, WebsiteProductAdapter, WebsiteProductRepository],
  controllers: [WebsiteProductController],
  exports: [WebsiteProductRepository, WebsiteProductService, WebsiteProductAdapter]

})
export class WebsiteProductModule { }
