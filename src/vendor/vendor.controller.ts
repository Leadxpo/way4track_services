import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorDto } from './dto/vendor.dto';
import { VendorIdDto } from './dto/vendor-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) { }

  @Post('handleVendorDetails')
  async handleVendorDetails(@Body() dto: VendorDto): Promise<CommonResponse> {
    try {
      return await this.vendorService.handleVendorDetails(dto);
    } catch (error) {
      console.error('Error in save vendor details:', error);
      return new CommonResponse(false, 500, 'Error saving vendor details');
    }
  }

  @Post('deleteVendorDetails')
  async deleteVendorDetails(@Body() dto: VendorIdDto): Promise<CommonResponse> {
    try {
      return await this.vendorService.deleteVendorDetails(dto);
    } catch (error) {
      console.error('Error in delete vendor details:', error);
      return new CommonResponse(false, 500, 'Error deleting vendor details');
    }
  }

  @Post('getVendorDetails')
  async getVendorDetails(@Body() req: VendorIdDto): Promise<CommonResponse> {
    try {
      return await this.vendorService.getVendorDetails(req);
    } catch (error) {
      console.error('Error in get vendor details:', error);
      return new CommonResponse(false, 500, 'Error fetching vendor details');
    }
  }
  @Post('getVendorNamesDropDown')
  async getVendorNamesDropDown(): Promise<CommonResponse> {
    try {
      return this.vendorService.getVendorNamesDropDown();
    } catch (error) {
      return new CommonResponse(false, 500, 'Error fetching branch type details');
    }
  }

  @Post('uploadPhoto')
  @UseInterceptors(FileInterceptor('photo'))
  async uploadPhoto(
    @Body('vendorId') vendorId: number,
    @UploadedFile() photo: Express.Multer.File
  ): Promise<CommonResponse> {
    try {
      return await this.vendorService.uploadVendorPhoto(vendorId, photo);
    } catch (error) {
      console.error('Error uploading vendor photo:', error);
      return new CommonResponse(false, 500, 'Error uploading photo');
    }
  }

}
