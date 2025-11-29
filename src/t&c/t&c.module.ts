import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TermsAndConditionEntity } from './entity/t&c.entity';
import { TermsAndConditionController } from './t&c.controller';
import { TermsAndConditionService } from './t&c.services';
import { TermsAndConditionRepository } from './repo/t&c.repo';


@Module({
    imports: [TypeOrmModule.forFeature([TermsAndConditionEntity]),
    ],
    controllers: [TermsAndConditionController],
    providers: [TermsAndConditionService, TermsAndConditionRepository],
    exports: [TermsAndConditionService],
})
export class TermsAndConditionModule { }
