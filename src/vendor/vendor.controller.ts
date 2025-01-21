import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorDto } from './dto/vendor.dto';
import { VendorIdDto } from './dto/vendor-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommonReq } from 'src/models/common-req';

@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) { }

  @UseInterceptors(FileInterceptor('photo'))
  @Post('handleVendorDetails')
  async handleVendorDetails(@Body() dto: VendorDto, @UploadedFile() photo?: Express.Multer.File): Promise<CommonResponse> {
    try {
      return await this.vendorService.handleVendorDetails(dto, photo);
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

  @Post('getVendorDetailsById')
  async getVendorDetailsById(@Body() req: VendorIdDto): Promise<CommonResponse> {
    try {
      return await this.vendorService.getVendorDetailsById(req);
    } catch (error) {
      console.error('Error in get vendor details:', error);
      return new CommonResponse(false, 500, 'Error fetching vendor details');
    }
  }

  @Post('getVendorDetails')
  async getVendorDetails(@Body() req: CommonReq): Promise<CommonResponse> {
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

}
