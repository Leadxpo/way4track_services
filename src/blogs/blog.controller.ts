
import { Controller, Post, Body, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { CommonResponse } from 'src/models/common-response';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { CommonReq } from 'src/models/common-req';
import * as multer from 'multer';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';

const multerOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000000,
    },
};

@Controller('blog')
export class BlogController {
    constructor(private readonly service: BlogService) { }

    @Post('handleBlogDetails')
    @UseInterceptors(FileFieldsInterceptor(
        [
            { name: 'photo', maxCount: 2 },
            { name: 'pdf', maxCount: 2 },
        ],
        multerOptions
    ))
    async handleBlogDetails(@Body() dto: CreateBlogDto, @UploadedFiles() photos: {
        photo?: Express.Multer.File[],
        pdf?: Express.Multer.File[],
    }
    ): Promise<CommonResponse> {
        try {
            if (dto.id) dto.id = Number(dto.id);
            return await this.service.handleBlogDetails(dto, photos);
        } catch (error) {
            return new CommonResponse(false, 500, 'Error saving Blog details');
        }
    }

    @Post('deleteBlogDetails')
    async deleteBlogDetails(@Body() dto: HiringIdDto): Promise<CommonResponse> {
        try {
            return await this.service.deleteBlogDetails(dto);
        } catch (error) {
            return new CommonResponse(false, 500, 'Error deleting Blog');
        }
    }

    @Post('getBlogDetails')
    async getBlogDetails(): Promise<CommonResponse> {
        try {
            return await this.service.getBlogDetails();
        } catch (error) {
            return new CommonResponse(false, 500, 'Error fetching Blog details');
        }
    }

    @Post('getBlogDetailsById')
    async getBlogDetailsById(@Body() req: HiringIdDto): Promise<CommonResponse> {
        try {
            return await this.service.getBlogDetailsById(req);
        } catch (error) {
            return new CommonResponse(false, 500, 'Error fetching Blog by ID');
        }
    }

}
