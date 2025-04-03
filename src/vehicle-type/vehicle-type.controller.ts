import { Body, Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import * as multer from 'multer';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { CommonReq } from 'src/models/common-req';
import { CommonResponse } from 'src/models/common-response';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { VehicleTypeService } from './vehicle-type.service';
import { VehicleTypeDto } from './dto/vehicle-type.dto';

@Controller('VehicleType')
export class VehicleTypeController {
    constructor(private readonly vehicleTypeService: VehicleTypeService) { }

    @Post('handleVehicleTypeDetails')

    async handleVehicleTypeDetails(
        @Body() dto: VehicleTypeDto,
    ): Promise<CommonResponse> {
        try {
            if (dto.id) {
                dto.id = Number(dto.id);
            }
            return await this.vehicleTypeService.handleVehicleTypeDetails(dto);
        } catch (error) {
            console.error('Error in save hiring details with resume in Vehicle:', error);
            return new CommonResponse(false, 500, 'Error saving hiring details with resume');
        }
    }

    @Post('deleteVehicleTypeDetails')
    async deleteVehicleTypeDetails(@Body() dto: HiringIdDto): Promise<CommonResponse> {
        try {
            return await this.vehicleTypeService.deleteVehicleTypeDetails(dto);
        } catch (error) {
            console.error('Error in delete client details in Vehicle:', error);
            return new CommonResponse(false, 500, 'Error deleting client details');
        }
    }

    @Post('getVehicleTypeDetails')
    async getVehicleTypeDetails(@Body() req: CommonReq): Promise<CommonResponse> {
        try {
            return await this.vehicleTypeService.getVehicleTypeDetails(req);
        } catch (error) {
            console.error('Error in get client details in Vehicle:', error);
            return new CommonResponse(false, 500, 'Error fetching client details');
        }
    }

    @Post('getVehicleTypeDetailsById')
    async getVehicleTypeDetailsById(@Body() req: HiringIdDto): Promise<CommonResponse> {
        try {
            return await this.vehicleTypeService.getVehicleTypeDetailsById(req);
        } catch (error) {
            console.error('Error in get client details in Vehicle:', error);
            return new CommonResponse(false, 500, 'Error fetching client details');
        }
    }

    @Post('getVehicleTypeNamesDropDown')
    async getVehicleTypeNamesDropDown(): Promise<CommonResponse> {
        try {
            return this.vehicleTypeService.getVehicleTypeNamesDropDown();
        } catch (error) {
            return new CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }

}
