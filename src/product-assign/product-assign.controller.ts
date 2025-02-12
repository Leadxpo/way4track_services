import { Body, Controller, HttpException, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProductAssignDto } from './dto/product-assign.dto';
import { CommonResponse } from 'src/models/common-response';
import { ProductAssignIdDto } from './dto/product-assign-id.dto';
import { ProductAssignService } from './product-assign.service';
import { ProductAssignEntity } from './entity/product-assign.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommonReq } from 'src/models/common-req';
import * as multer from 'multer';
const multerOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000000,
    },
};
@Controller('product-assign')
export class ProductAssignController {
    constructor(private readonly productAssignService: ProductAssignService) { }

    @Post('handleProductDetails')
    @UseInterceptors(FileInterceptor('file', multerOptions))
    async handleProductDetails(@Body() dto: ProductAssignDto, @UploadedFile() file: Express.Multer.File): Promise<CommonResponse> {
        try {
            if (dto.id) {
                dto.id = Number(dto.id);
            }
            return await this.productAssignService.handleProductDetails(dto, file);
        } catch (error) {
            console.error('Error in save product assignment in service:', error);
            return new CommonResponse(false, 500, 'Error saving product assignment');
        }
    }

    @Post('deleteProductAssign')
    async deleteProductAssign(@Body() dto: ProductAssignIdDto): Promise<CommonResponse> {
        try {
            return await this.productAssignService.deleteProductAssign(dto);
        } catch (error) {
            console.error('Error in delete product assignment in service:', error);
            return new CommonResponse(false, 500, 'Error deleting product assignment');
        }
    }

    @Post('getProductAssign')
    async getProductAssign(@Body() req: ProductAssignIdDto): Promise<CommonResponse> {
        try {
            return await this.productAssignService.getProductAssign(req);
        } catch (error) {
            console.error('Error in get product assignment in service:', error);
            return new CommonResponse(false, 500, 'Error fetching product assignment');
        }
    }

    @Post('getAllProductAssign')
    async getAllProductAssign(@Body() req: CommonReq): Promise<CommonResponse> {
        try {
            return await this.productAssignService.getAllProductAssign(req);
        } catch (error) {
            console.error('Error in get product assignment in service:', error);
            return new CommonResponse(false, 500, 'Error fetching product assignment');
        }
    }
}
