import { Body, Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { CommonReq } from 'src/models/common-req';
import { CommonResponse } from 'src/models/common-response';
import { TechnicianWorksDto } from './dto/technician-works.dto';
import { TechnicianService } from './technician-works.service';
import { TechIdDto } from './dto/technician-id.dto';
import { BranchChartDto } from 'src/voucher/dto/balance-chart.dto';


const multerOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000000,
    },
};
@Controller('technician')
export class TechnicianController {
    constructor(private readonly techService: TechnicianService) { }


    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'photo1', maxCount: 1 },
                { name: 'photo2', maxCount: 1 },
                { name: 'photo3', maxCount: 1 },
                { name: 'photo4', maxCount: 1 },
                { name: 'screenShot', maxCount: 1 },

            ],
            multerOptions
        )
    )
    @Post('handleTechnicianDetails')
    async handleTechnicianDetails(
        @Body() dto: TechnicianWorksDto,
        @UploadedFiles() files: {
            photo1?: Express.Multer.File[],
            photo2?: Express.Multer.File[],
            photo3?: Express.Multer.File[],
            photo4?: Express.Multer.File[],
            screenShot?: Express.Multer.File[]
        }
    ): Promise<CommonResponse> {
        if (dto.id) {
            dto.id = Number(dto.id);
        }

        return this.techService.handleTechnicianDetails(dto, files);
    }

    @Post('deleteTechnicianDetails')
    async deleteTechnicianDetails(@Body() dto: TechIdDto): Promise<CommonResponse> {
        try {
            return this.techService.deleteTechnicianDetails(dto);
        } catch (error) {
            console.log("Error in delete assert details in service..", error);
            return new CommonResponse(false, 500, 'Error deleting assert details');
        }
    }

    @Post('getTechnicianDetailsById')
    async getTechnicianDetailsById(@Body() req: TechIdDto): Promise<CommonResponse> {
        try {
            return this.techService.getTechnicianDetailsById(req);
        } catch (error) {
            console.log("Error in create address in services..", error);
            return new CommonResponse(false, 500, 'Error fetching Technician type details');
        }
    }

    @Post('getTotalWorkAllocation')
    async getTotalWorkAllocation(@Body() req: {
        companyCode?: string;
        unitCode?: string
        staffId: string;
        date: string
    }) {
        try {
            return this.techService.getTotalWorkAllocation(req);
        } catch (error) {
            console.error('Error in delete vendor details:', error);
            return new CommonResponse(false, 500, 'Error deleting vendor details');
        }
    }

    @Post('getPaymentWorkAllocation')
    async getPaymentWorkAllocation(@Body() req: {
        companyCode?: string;
        unitCode?: string
        staffId: string;
        date: string
    }) {
        try {
            return this.techService.getPaymentWorkAllocation(req);
        } catch (error) {
            console.error('Error in delete vendor details:', error);
            return new CommonResponse(false, 500, 'Error deleting vendor details');
        }
    }

    @Post('getPaymentStatusData')
    async getPaymentStatus(@Body() req: CommonReq) {
        try {
            return this.techService.getPaymentStatus(req);
        } catch (error) {
            console.error('Error in delete vendor details:', error);
            return new CommonResponse(false, 500, 'Error deleting vendor details');
        }
    }

    @Post('getUpCommingWorkAllocation')
    async getUpCommingWorkAllocation(@Body() req: {
        companyCode?: string;
        unitCode?: string
        staffId: string;
    }) {
        try {
            return this.techService.getUpCommingWorkAllocation(req);
        } catch (error) {
            console.error('Error in delete vendor details:', error);
            return new CommonResponse(false, 500, 'Error deleting vendor details');
        }
    }

    @Post('getUpCommingWorkAllocationDetails')
    async getUpCommingWorkAllocationDetails(@Body() req: {
        companyCode?: string;
        unitCode?: string
        staffId: string;
    }) {
        try {
            return this.techService.getUpCommingWorkAllocationDetails(req);
        } catch (error) {
            console.error('Error in delete vendor details:', error);
            return new CommonResponse(false, 500, 'Error deleting vendor details');
        }
    }

    @Post('getClientDataForTechniciansTable')
    async getClientDataForTechniciansTable(@Body() req: {
        companyCode?: string;
        unitCode?: string
        clientId: string;
    }) {
        try {
            return this.techService.getClientDataForTechniciansTable(req);
        } catch (error) {
            console.error('Error in delete vendor details:', error);
            return new CommonResponse(false, 500, 'Error deleting vendor details');
        }
    }

    @Post('getTechnicianDetails')
    async getTechnicianDetails(@Body() req: CommonReq): Promise<CommonResponse> {
        try {
            return this.techService.getTechnicianDetails(req);
        } catch (error) {
            console.log("Error in create address in services..", error);
            return new CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }

    @Post('getStaffWorkAllocation')
    async getStaffWorkAllocation(@Body() req: {
        staffId: string; companyCode?: string;
        unitCode?: string
    }) {
        try {
            return this.techService.getStaffWorkAllocation(req);
        } catch (error) {
            console.error('Error in delete vendor details:', error);
            return new CommonResponse(false, 500, 'Error deleting vendor details');
        }
    }

    @Post('getSucessPaymentsForTable')
    async getSucessPaymentsForTable(@Body() req: BranchChartDto) {
        try {
            return this.techService.getSucessPaymentsForTable(req);
        } catch (error) {
            console.error('Error in delete vendor details:', error);
            return new CommonResponse(false, 500, 'Error deleting vendor details');
        }
    }

    @Post('getAllPaymentsForTable')
    async getAllPaymentsForTable(@Body() req: BranchChartDto) {
        try {
            return this.techService.getAllPaymentsForTable(req);
        } catch (error) {
            console.error('Error in delete vendor details:', error);
            return new CommonResponse(false, 500, 'Error deleting vendor details');
        }
    }

    @Post('getPendingPaymentsForTable')
    async getPendingPaymentsForTable(@Body() req: BranchChartDto) {
        try {
            return this.techService.getPendingPaymentsForTable(req);
        } catch (error) {
            console.error('Error in delete vendor details:', error);
            return new CommonResponse(false, 500, 'Error deleting vendor details');
        }
    }

    @Post('getPaymentStatusPayments')
    async getPaymentStatusPayments(@Body() req: BranchChartDto) {
        try {
            return this.techService.getPaymentStatusPayments(req);
        } catch (error) {
            console.error('Error in delete vendor details:', error);
            return new CommonResponse(false, 500, 'Error deleting vendor details');
        }
    }
}