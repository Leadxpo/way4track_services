import { Module } from '@nestjs/common';
import { PromotionalController } from './promotional.controller';
import { PromotionalService } from './promotional.service';

@Module({
  controllers: [PromotionalController],
  providers: [PromotionalService]
})
export class PromotionalModule {}
