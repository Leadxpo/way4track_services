import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceEntity } from './entity/devices-entity';
import { DeviceService } from './devices.service';
import { DeviceController } from './devices.controller';
import { DeviceRepository } from './repo/devices.repo';
import { DeviceAdapter } from './devices.adapter';
import { WebsiteProductModule } from 'src/website-product/website_product.module';


@Module({
  imports: [TypeOrmModule.forFeature([DeviceEntity]),
  forwardRef(() => WebsiteProductModule),
  ],
  providers: [DeviceService, DeviceAdapter, DeviceRepository],
  controllers: [DeviceController],
  exports: [DeviceRepository, DeviceService]

})
export class DevicesModule { }
