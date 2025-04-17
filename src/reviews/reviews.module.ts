
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from './entity/reviews-entity';
import { ReviewService } from './reviews.service';
import { ReviewController } from './reviews.controller';
import { ReviewAdapter } from './reviews.adapter';
import { ReviewRepository } from './repo/reviews.repo';
@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity])],
  providers: [ReviewService, ReviewAdapter, ReviewRepository],
  controllers: [ReviewController],
  exports: [ReviewRepository, ReviewService]
})
export class ReviewsModule { }
