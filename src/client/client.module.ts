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

@Module({
    imports: [TypeOrmModule.forFeature([ClientEntity]),
    forwardRef(() => BranchModule),
    forwardRef(() => DevicesModule),
    forwardRef(() => ReviewsModule),
    MulterModule.register({
        dest: './uploads',
    }),],
    controllers: [ClientController],
    providers: [ClientService, ClientRepository, ClientAdapter],
    exports: [ClientRepository, ClientService]
})
export class ClientModule { }
