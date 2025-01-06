import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestRaiseEntity } from './entity/request-raise.entity';
import { RequestRaiseController } from './request-raise.controller';
import { RequestRaiseService } from './request-raise.service';
import { RequestRaiseRepository } from './repo/request-raise.repo';
import { RequestRaiseAdapter } from './request-raise.adapter';
import { NotificationModule } from 'src/notifications/notification.module';


@Module({
    imports: [TypeOrmModule.forFeature([RequestRaiseEntity]),
    forwardRef(() => NotificationModule)],
    controllers: [RequestRaiseController],
    providers: [RequestRaiseService, RequestRaiseRepository, RequestRaiseAdapter],
    exports: [RequestRaiseRepository, RequestRaiseService]

})
export class RequestRaiseModule { }
