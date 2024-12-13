import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstimateEntity } from './entity/estimate.entity';
import { EstimateController } from './estimate.controller';
import { EstimateService } from './estimate.service';
import { EstimateRepository } from './repo/estimate.repo';
import { EstimateAdapter } from './estimate.adapter';
import { ClientModule } from 'src/client/client.module';



@Module({
    imports: [TypeOrmModule.forFeature([EstimateEntity]),
    forwardRef(() => ClientModule)],
    controllers: [EstimateController],
    providers: [EstimateService, EstimateRepository, EstimateAdapter],
    exports: [EstimateRepository, EstimateService]

})
export class EstimateAssignModule { }
