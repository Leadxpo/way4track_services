import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpEntity } from './entity/otp-generation.entity';
import { OTPGenerationController } from './otp-generation.controller';
import { OTPGenerationService } from './otp-generation.services';
import { OTPRepository } from './repo/otp-generation.repo';
import { StaffModule } from 'src/staff/staff.module';
import { NotificationModule } from 'src/notifications/notification.module';
import { ClientModule } from 'src/client/client.module';


@Module({
    imports: [TypeOrmModule.forFeature([OtpEntity]),
    forwardRef(() => StaffModule),
    forwardRef(() => ClientModule),
    ],
    controllers: [OTPGenerationController],
    providers: [OTPGenerationService, OTPRepository],
    exports: [OTPGenerationService],
})
export class OTPModule { }
