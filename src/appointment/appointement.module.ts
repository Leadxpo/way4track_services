import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentEntity } from './entity/appointement.entity';
import { AppointmentAdapter } from './appointement.adapter';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { AppointmentRepository } from './repo/appointement.repo';


@Module({
  imports: [TypeOrmModule.forFeature([AppointmentEntity])],
  providers: [AppointmentService, AppointmentAdapter, AppointmentRepository],
  controllers: [AppointmentController],
  exports: [AppointmentRepository, AppointmentService]
})
export class AppointmentModule { }
