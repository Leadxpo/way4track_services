import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommonResponse } from 'src/models/common-response';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post('bulk-upload')
  @UseInterceptors(FileInterceptor('file'))
  async bulkUpload(@UploadedFile() file: Express.Multer.File): Promise<CommonResponse> {
    return this.productService.bulkUploadProducts(file);
  }

  @Post('uploadPhoto')
  @UseInterceptors(FileInterceptor('photo'))
  async uploadPhoto(
    @Body('productId') productId: number,
    @UploadedFile() photo: Express.Multer.File
  ): Promise<CommonResponse> {
    try {
      return await this.productService.uploadProductPhoto(productId, photo);
    } catch (error) {
      console.error('Error uploading staff photo:', error);
      return new CommonResponse(false, 500, 'Error uploading photo');
    }
  }
}
