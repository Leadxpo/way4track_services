import { Body, Controller, HttpException, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProductAssignDto } from './dto/product-assign.dto';
import { CommonResponse } from 'src/models/common-response';
import { ProductAssignIdDto } from './dto/product-assign-id.dto';
import { ProductAssignService } from './product-assign.service';
import { ProductAssignEntity } from './entity/product-assign.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('product-assign')
export class ProductAssignController {
    constructor(private readonly productAssignService: ProductAssignService) { }

    @Post('handleProductDetails')
    @UseInterceptors(FileInterceptor('file'))
    async handleProductDetails(@Body() dto: ProductAssignDto, @UploadedFile() file: Express.Multer.File): Promise<CommonResponse> {
        try {
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

    @Post('assignProduct')
    async assignProduct(@Body() assignData: any): Promise<ProductAssignEntity> {
        try {
            return await this.productAssignService.assignProduct(assignData);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('markInHands')
    async markInHands(@Body() productAssignId: number, companyCode: string, unitCode: string): Promise<ProductAssignEntity> {
        try {
            return await this.productAssignService.markInHands(productAssignId, companyCode, unitCode);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
    }
}
