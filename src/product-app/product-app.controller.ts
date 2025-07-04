import {
    Controller,
    Post,
    Body,
    UploadedFiles,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { ProductAppService } from './product-app.service';
import { ProductAppDto } from './dto/product-app.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CommonResponse } from 'src/models/common-response';
import * as multer from 'multer';

const multerOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000000,
    },
};
@Controller('product-apps') 
export class ProductAppController {
    constructor(private readonly service: ProductAppService) { }


    @UseInterceptors(FileInterceptor('photo', multerOptions))
    @Post('handleUpdateAppDetails')
    async handleUpdateAppDetails(
        @Body() dto: ProductAppDto,
        @UploadedFile() photo?: Express.Multer.File,
    ): Promise<CommonResponse> {
        try {
            if (dto.id) dto.id = Number(dto.id);
            return await this.service.handleUpdateAppDetails(dto, photo);
        } catch (error) {
            return new CommonResponse(false, 500, 'Error saving ProductApp details');
        }
    }
    @Post('handleBulkProductApp')
    @UseInterceptors(FilesInterceptor('photos'))
    async handleBulkProductApp(
        @Body('dtoList') dtoListJson: string,
        @UploadedFiles() photos: Express.Multer.File[],
    ): Promise<CommonResponse> {
        const dtoList = JSON.parse(dtoListJson)
        return await this.service.handleBulkProductApp(dtoList, photos);
    }


    @Post('getAll')
    async getAll(): Promise<CommonResponse> {
        try {
            return await this.service.findAll();

        } catch (error) {
            console.error('Error in get request details in service:', error);
            return new CommonResponse(false, 500, 'Error fetching request details');
        }
    }
}
