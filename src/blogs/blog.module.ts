import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './entity/blog.entity';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { WebsiteProductModule } from 'src/website-product/website_product.module';
import { BlogAdapter } from './blog.adapter';
import { BlogRepository } from './repo/blog.repo';

@Module({
    imports: [TypeOrmModule.forFeature([BlogEntity]),
    forwardRef(() => WebsiteProductModule),],
    providers: [BlogRepository, BlogService, BlogAdapter,],
    controllers: [BlogController],
    exports: [BlogRepository, BlogService, BlogAdapter]
})
export class BlogModule { }
