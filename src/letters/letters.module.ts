import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffModule } from 'src/staff/staff.module';
import { LettersEntity } from './entity/letters.entity';
import { LetterController } from './letters.controller';
import { LettersService } from './letters.service';
import { LettersAdapter } from './letters.adapter';
import { LettersRepository } from './repo/letters.repo';


@Module({
    imports: [TypeOrmModule.forFeature([LettersEntity]),
    forwardRef(() => StaffModule)],
    controllers: [LetterController],
    providers: [LettersService, LettersRepository, LettersAdapter],
    exports: [LettersRepository, LettersService],
})
export class LettersModule { }
