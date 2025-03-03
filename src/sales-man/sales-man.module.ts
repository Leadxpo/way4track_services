import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from 'src/client/client.module';
import { ProductModule } from 'src/product/product.module';
import { SalesWorksEntity } from './entity/sales-man.entity';
import { SalesWorksController } from './sales-man.controller';
import { SalesWorksService } from './sales-man.service';
import { SalesworkRepository } from './repo/sales-man.repo';
import { SalesWorksAdapter } from './sales-man.adapter ';
import { StaffModule } from 'src/staff/staff.module';



@Module({
    imports: [TypeOrmModule.forFeature([SalesWorksEntity]),
   
    forwardRef(() => ProductModule),
    forwardRef(() => StaffModule),
],
    controllers: [SalesWorksController],
    providers: [SalesWorksService, SalesworkRepository, SalesWorksAdapter],
    exports: [SalesworkRepository, SalesWorksService]

})
export class SalesworkModule { }
