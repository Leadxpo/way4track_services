import { Controller, Post, Body, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { CommonResponse } from 'src/models/common-response';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { CommonReq } from 'src/models/common-req';
import { WebsiteProductService } from './website-product.service';
import { WebsiteProductDto } from './dto/website.dto';
import * as multer from 'multer';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';

const multerOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000000,
    },
};

@Controller('website-product')
export class WebsiteProductController {
    constructor(private readonly service: WebsiteProductService) { }

    @Post('handleWebsiteProductDetails')
    @UseInterceptors(FileFieldsInterceptor(
        [
            { name: 'homeBanner', maxCount: 1 },
            { name: 'footerBanner', maxCount: 1 },
            { name: 'banner1', maxCount: 1 },
            { name: 'banner2', maxCount: 1 },
            { name: 'banner3', maxCount: 1 },
            { name: 'blogImage', maxCount: 1 },
            { name: 'productIcon', maxCount: 1 },
            { name: 'chooseImage', maxCount: 1 },
            { name: 'solutionImage', maxCount: 1 },
        ],
        multerOptions
    ))
    async handleWebsiteProductDetails(@Body() dto: WebsiteProductDto, @UploadedFiles() photos: {
        homeBanner?: Express.Multer.File[],
        footerBanner?: Express.Multer.File[],
        banner1?: Express.Multer.File[],
        banner2?: Express.Multer.File[],
        banner3?: Express.Multer.File[],
        blogImage?: Express.Multer.File[],
        productIcon?: Express.Multer.File[],
        chooseImage?: Express.Multer.File[],
        solutionImage?: Express.Multer.File[],

    }
    ): Promise<CommonResponse> {
        try {
            if (dto.id) dto.id = Number(dto.id);
            return await this.service.handleWebsiteProductDetails(dto, photos);
        } catch (error) {
            return new CommonResponse(false, 500, 'Error saving WebsiteProduct details');
        }
    }

    @Post('deleteWebsiteProductDetails')
    async deleteWebsiteProductDetails(@Body() dto: HiringIdDto): Promise<CommonResponse> {
        try {
            return await this.service.deleteWebsiteProductDetails(dto);
        } catch (error) {
            return new CommonResponse(false, 500, 'Error deleting WebsiteProduct');
        }
    }

    @Post('getWebsiteProductDetails')
    async getWebsiteProductDetails(@Body() req: CommonReq): Promise<CommonResponse> {
        try {
            return await this.service.getWebsiteProductDetails(req);
        } catch (error) {
            return new CommonResponse(false, 500, 'Error fetching WebsiteProduct details');
        }
    }

    @Post('getWebsiteProductDetailsById')
    async getWebsiteProductDetailsById(@Body() req: HiringIdDto): Promise<CommonResponse> {
        try {
            return await this.service.getWebsiteProductDetailsById(req);
        } catch (error) {
            return new CommonResponse(false, 500, 'Error fetching WebsiteProduct by ID');
        }
    }

    @Post('getWebsiteProductDropdown')
    async getWebsiteProductDropdown(): Promise<CommonResponse> {
        try {
            return await this.service.getWebsiteProductDropdown();
        } catch (error) {
            return new CommonResponse(false, 500, 'Error fetching dropdown');
        }
    }
}
