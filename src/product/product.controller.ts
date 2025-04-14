import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommonResponse } from 'src/models/common-response';
import { ProductDto } from './dto/product.dto';
import { ProductIdDto } from './dto/product.id.dto';
import { CommonReq } from 'src/models/common-req';
import * as multer from 'multer';
const multerOptions = {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1000000000,
  },
};
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post('bulk-upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async bulkUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body() productDto: ProductDto
  ): Promise<CommonResponse> {
    try {
      if (productDto.id) {
        productDto.id = Number(productDto.id);
      }
      return await this.productService.createOrUpdateProduct(productDto, file);
    } catch (error) {
      console.error('Error processing file and form data:', error);
      return new CommonResponse(false, 500, 'Error processing file and form data');
    }
  }


  @Post('deleteProductDetails')
  async deleteProductDetails(@Body() dto: ProductIdDto): Promise<CommonResponse> {
    try {
      return await this.productService.deleteProductDetails(dto);
    } catch (error) {
      console.error('Error in delete client details in service:', error);
      return new CommonResponse(false, 500, 'Error deleting client details');
    }
  }

  @Post('getproductDetails')
  async getproductDetails(@Body() req: ProductIdDto): Promise<CommonResponse> {
    try {
      return await this.productService.getproductDetails(req);
    } catch (error) {
      console.error('Error in get client details in service:', error);
      return new CommonResponse(false, 500, 'Error fetching client details');
    }
  }

  @Post('getAllproductDetails')
  async getAllproductDetails(@Body() req: CommonReq): Promise<CommonResponse> {
    try {
      return await this.productService.getAllproductDetails(req);
    } catch (error) {
      console.error('Error in get client details in service:', error);
      return new CommonResponse(false, 500, 'Error fetching client details');
    }
  }

  @Post('getSearchDetailProduct')
  async getSearchDetailProduct(@Body() req: ProductIdDto): Promise<CommonResponse> {
    try {
      return await this.productService.getSearchDetailProduct(req);
    } catch (error) {
      console.error('Error in get client details in service:', error);
      return new CommonResponse(false, 500, 'Error fetching client details');
    }
  }

  @Post('getProductNamesDropDown')
  async getProductNamesDropDown(): Promise<CommonResponse> {
    try {
      return this.productService.getProductNamesDropDown();
    } catch (error) {
      return new CommonResponse(false, 500, 'Error fetching branch type details');
    }
  }


  @Post('getDetailProduct')
  async getDetailProduct(@Body() req: CommonReq): Promise<CommonResponse> {
    try {
      return this.productService.getDetailProduct(req);
    } catch (error) {
      return new CommonResponse(false, 500, 'Error fetching branch type details');
    }
  }


  @Post('productAssignDetails')
  async productAssignDetails(@Body() req: {
    branchName?: string;
    subDealerId?: string
    companyCode?: string;
    unitCode?: string;
  }): Promise<CommonResponse> {
    try {
      return this.productService.productAssignDetails(req);
    } catch (error) {
      return new CommonResponse(false, 500, 'Error fetching branch type details');
    }
  }
}
