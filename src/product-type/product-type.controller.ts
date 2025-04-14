import { Body, Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import * as multer from 'multer';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { CommonReq } from 'src/models/common-req';
import { ProductTypeService } from './product-type.service';
import { ProductTypeDto } from './dto/product-type.dto';
import { CommonResponse } from 'src/models/common-response';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
const multerOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000000,
    },
};
@Controller('productType')
export class ProductTypeController {
    constructor(private readonly service: ProductTypeService) { }

    @Post('handleProductTypeDetails')
    // @UseInterceptors(FileFieldsInterceptor(
    //     [
    //         { name: 'photo', maxCount: 1 },
    //         { name: 'image', maxCount: 1 },
    //     ],
    //     multerOptions
    // ))
    async handleProductTypeDetails(
        @Body() dto: ProductTypeDto,
        //  @UploadedFiles() photos: {
        //     photo?: Express.Multer.File[],
        //     image?: Express.Multer.File[],

        //         }
    ): Promise<CommonResponse> {
        try {
            if (dto.id) {
                dto.id = Number(dto.id);
            }
            return await this.service.handleProductTypeDetails(dto);
        } catch (error) {
            console.error('Error in save hiring details with resume in service:', error);
            return new CommonResponse(false, 500, 'Error saving hiring details with resume');
        }
    }

    @Post('deleteProductTypeDetails')
    async deleteProductTypeDetails(@Body() dto: HiringIdDto): Promise<CommonResponse> {
        try {
            return await this.service.deleteProductTypeDetails(dto);
        } catch (error) {
            console.error('Error in delete client details in service:', error);
            return new CommonResponse(false, 500, 'Error deleting client details');
        }
    }

    @Post('getProductTypeDetails')
    async getProductTypeDetails(@Body() req: CommonReq): Promise<CommonResponse> {
        try {
            return await this.service.getProductTypeDetails(req);
        } catch (error) {
            console.error('Error in get client details in service:', error);
            return new CommonResponse(false, 500, 'Error fetching client details');
        }
    }

    @Post('getProductTypeDetailsById')
    async getProductTypeDetailsById(@Body() req: HiringIdDto): Promise<CommonResponse> {
        try {
            return await this.service.getProductTypeDetailsById(req);
        } catch (error) {
            console.error('Error in get client details in service:', error);
            return new CommonResponse(false, 500, 'Error fetching client details');
        }
    }

    @Post('getProductTypeNamesDropDown')
    async getProductTypeNamesDropDown(): Promise<CommonResponse> {
        try {
            return this.service.getProductTypeNamesDropDown();
        } catch (error) {
            return new CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }

}
