import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsController } from './tickets.controller';
import { TicketsAdapter } from './tickets.adapter';
import { TicketsEntity } from './entity/tickets.entity';
import { TicketsService } from './tickets.services';
import { TicketsRepository } from './repo/tickets.repo';
import { NotificationModule } from 'src/notifications/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([TicketsEntity]),
forwardRef(() => NotificationModule)],
  controllers: [TicketsController],
  providers: [TicketsService, TicketsAdapter, TicketsRepository],
  exports:[TicketsRepository,TicketsService]

})
export class TicketsModule { }
