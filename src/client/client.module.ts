import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from './entity/client.entity';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { ClientRepository } from './repo/client.repo';
import { ClientAdapter } from './client.adapter';
import { BranchModule } from 'src/branch/branch.module';
import { MulterModule } from '@nestjs/platform-express';
import { DevicesModule } from 'src/devices/devices.module';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { StaffModule } from 'src/staff/staff.module';

@Module({
    imports: [TypeOrmModule.forFeature([ClientEntity,StaffEntity]),
    forwardRef(() => BranchModule),
    forwardRef(() => DevicesModule),
    forwardRef(() => ReviewsModule),
    forwardRef(() => StaffModule),
    MulterModule.register({
        dest: './uploads',
    }),],
    controllers: [ClientController],
    providers: [ClientService, ClientRepository, ClientAdapter],
    exports: [ClientRepository, ClientService]
})
export class ClientModule { }
