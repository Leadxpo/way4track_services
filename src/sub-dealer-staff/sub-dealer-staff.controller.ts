import { Body, Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import * as multer from 'multer';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { CommonReq } from 'src/models/common-req';
import { CommonResponse } from 'src/models/common-response';
import { HiringIdDto } from 'src/hiring/dto/hiring-id.dto';
import { SubDealerStaffService } from './sub-dealer.staff.service';
import { CreateSubDealerStaffDto } from './dto/sub-dealer-staff.dto';
import { StaffSearchDto } from 'src/staff/dto/staff-search.dto';


@Controller('subDealerStaff')
export class SubDealerStaffController {
    constructor(private readonly service: SubDealerStaffService) { }

    @Post('handleSubDealerStaffDetails')

    async handleSubDealerStaffDetails(
        @Body() dto: CreateSubDealerStaffDto,
    ): Promise<CommonResponse> {
        try {
            if (dto.id) {
                dto.id = Number(dto.id);
            }
            return await this.service.handleSubDealerStaffDetails(dto);
        } catch (error) {
            console.error('Error in save hiring details with resume in service:', error);
            return new CommonResponse(false, 500, 'Error saving hiring details with resume');
        }
    }

    @Post('deleteSubDealerStaffDetails')
    async deleteSubDealerStaffDetails(@Body() dto: HiringIdDto): Promise<CommonResponse> {
        try {
            return await this.service.deleteSubDealerStaffDetails(dto);
        } catch (error) {
            console.error('Error in delete client details in service:', error);
            return new CommonResponse(false, 500, 'Error deleting client details');
        }
    }

    @Post('getSubDealerStaffDetails')
    async getSubDealerStaffDetails(@Body() req: CommonReq): Promise<CommonResponse> {
        try {
            return await this.service.getSubDealerStaffDetails(req);
        } catch (error) {
            console.error('Error in get client details in service:', error);
            return new CommonResponse(false, 500, 'Error fetching client details');
        }
    }

    @Post('getSubDealerStaffDetailsById')
    async getSubDealerStaffDetailsById(@Body() req: HiringIdDto): Promise<CommonResponse> {
        try {
            return await this.service.getSubDealerStaffDetailsById(req);
        } catch (error) {
            console.error('Error in get client details in service:', error);
            return new CommonResponse(false, 500, 'Error fetching client details');
        }
    }

    @Post('getSubDealerStaffNamesDropDown')
    async getSubDealerStaffNamesDropDown(): Promise<CommonResponse> {
        try {
            return this.service.getSubDealerStaffNamesDropDown();
        } catch (error) {
            return new CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }

    @Post('getSubDealerStaffSearchDetails')
    async getSubDealerStaffSearchDetails(@Body() req: StaffSearchDto): Promise<CommonResponse> {
        try {
            return await this.service.getSubDealerStaffSearchDetails(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
            //         // return new CommonResponse(false, 500, 'Error details');
        }
    }

}
