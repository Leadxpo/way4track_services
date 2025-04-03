import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleTypeEntity } from './entity/vehicle-type.entity';
import { VehicleTypeAdapter } from './vehicle-type.adapter';
import { VehicleTypeRepository } from './repo/vehicle-type.repo';
import { VehicleTypeController } from './vehicle-type.controller';
import { VehicleTypeService } from './vehicle-type.service';


@Module({
    imports: [TypeOrmModule.forFeature([VehicleTypeEntity])],
    providers: [VehicleTypeService, VehicleTypeAdapter, VehicleTypeRepository],
    controllers: [VehicleTypeController],
    exports: [VehicleTypeRepository, VehicleTypeService]

})
export class VehicleTypeModule { }
