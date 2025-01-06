import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationEntity } from './entity/notification.entity';
import { RequestRaiseEntity } from 'src/request-raise/entity/request-raise.entity';
import { TicketsEntity } from 'src/tickets/entity/tickets.entity';
import { RequestRaiseModule } from 'src/request-raise/request-raise.module';
import { TicketsModule } from 'src/tickets/tickets.module';
import { NotificationRepository } from './repo/notification.repo';
import { WorkAllocationModule } from 'src/work-allocation/work-allocation.module';
import { NotificationAdapter } from './notification.adapter';
@Module({
    imports: [
        TypeOrmModule.forFeature([NotificationEntity, RequestRaiseEntity, TicketsEntity]),
        forwardRef(() => RequestRaiseModule),
        forwardRef(() => TicketsModule),
        forwardRef(() => WorkAllocationModule),
    ],
    controllers: [NotificationController],
    providers: [NotificationService, NotificationRepository, NotificationAdapter],
    exports: [NotificationRepository, NotificationService, NotificationAdapter],
})
export class NotificationModule { }
