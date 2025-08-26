import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstimateEntity } from './entity/estimate.entity';
import { EstimateController } from './estimate.controller';
import { EstimateService } from './estimate.service';
import { EstimateRepository } from './repo/estimate.repo';
import { EstimateAdapter } from './estimate.adapter';
import { ClientModule } from 'src/client/client.module';
import { ProductModule } from 'src/product/product.module';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { StaffModule } from 'src/staff/staff.module';



@Module({
    imports: [TypeOrmModule.forFeature([EstimateEntity,StaffEntity]),
    forwardRef(() => ClientModule),
    forwardRef(() => StaffModule),
    forwardRef(() => ProductModule)],
    controllers: [EstimateController],
    providers: [EstimateService, EstimateRepository, EstimateAdapter],
    exports: [EstimateRepository, EstimateService]

})
export class EstimateModule { }
