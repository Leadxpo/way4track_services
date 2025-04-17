import { Module } from '@nestjs/common';
import { WebsiteProductController } from './website-product.controller';

@Module({
  controllers: [WebsiteProductController]
})
export class WebsiteProductModule {}
