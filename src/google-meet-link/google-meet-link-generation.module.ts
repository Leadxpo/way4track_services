import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleMeetLinkEntity } from './entity/google-meet-link-generation.entity';
import { GoogleMeetLinkController } from './google-meet-link-generation.controller';
import { GoogleMeetLinkService } from './google-meet-link-generation.services';
import { GoogleMeetLinkRepository } from './repo/google-meet-link-generation.repo';


@Module({
    imports: [TypeOrmModule.forFeature([GoogleMeetLinkEntity]),
    ],
    controllers: [GoogleMeetLinkController],
    providers: [GoogleMeetLinkService, GoogleMeetLinkRepository],
    exports: [GoogleMeetLinkService],
})
export class GoogleMeetLinkModule { }
