import {Controller,Get,Post,Body,Param,Put,Delete,UploadedFile,UseInterceptors} from '@nestjs/common';
import { TermsAndConditionService } from './t&c.services';
import TermsAndConditionDto from './dto/t&c.dto';
import * as multer from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

const multerOptions = {
  storage: multer.memoryStorage(),
  limits: {
      fileSize: 1000000000,
  },
};

@Controller('terms_and_condition')
export class TermsAndConditionController {
  constructor(private readonly service: TermsAndConditionService) {}

  // ----------------------------------------
  // CREATE T&C  (WITH PHOTO)
  // ----------------------------------------
  @UseInterceptors(FileInterceptor('photo', multerOptions))
  @Post('handleTermsAndCondition')
  create(
    @Body() dto: TermsAndConditionDto,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    return this.service.create(dto, photo);
  }

  // ----------------------------------------
  // GET ALL
  // ----------------------------------------
  @Get('getAllTermsAndCondition')
  findAll() {
    return this.service.findAll();
  }

  // ----------------------------------------
  // GET ONE
  // ----------------------------------------
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  // ----------------------------------------
  // UPDATE T&C  (NOW PHOTO INCLUDED)
  // ----------------------------------------
  @UseInterceptors(FileInterceptor('photo', multerOptions))
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() dto: TermsAndConditionDto,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    return this.service.update(id, dto, photo);   // <-- photo passed here
  }

  // ----------------------------------------
  // DELETE
  // ----------------------------------------
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
