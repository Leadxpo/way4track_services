import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceTypeEntity } from './entity/service.entity';
import { ServiceTypeAdapter } from './service.adapter';
import { ServiceTypeService } from './service.service';
import { ServiceTypeController } from './service.controller';
import { ServiceTypeRepository } from './repo/service.repo';

@Module({
    imports: [TypeOrmModule.forFeature([ServiceTypeEntity])],
    providers: [ServiceTypeService, ServiceTypeAdapter, ServiceTypeRepository],
    controllers: [ServiceTypeController],
    exports: [ServiceTypeRepository, ServiceTypeService]

})
export class ServiceTypeModule { }
