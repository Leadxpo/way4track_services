import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import * as multer from 'multer';
import { ClientIdDto } from './dto/client-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { ClientDto } from './dto/client.dto';
import { ClientService } from './client.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommonReq } from 'src/models/common-req';
import { LoginDto } from 'src/login/dto/login.dto';
const multerOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000000,
    },
};
@Controller('client')
export class ClientController {
    constructor(private readonly clientService: ClientService) { }

    @Post('handleClientDetails')
    @UseInterceptors(FileInterceptor('file', multerOptions))
    async handleClientDetails(
        @Body() dto: ClientDto,
        @UploadedFile() file: Express.Multer.File
    ): Promise<CommonResponse> {
        try {
            if (dto.id) {
                dto.id = Number(dto.id);
            }
            return await this.clientService.handleClientDetails(dto, file);
        } catch (error) {
            console.error('Error in save hiring details with resume in service:', error);
            return new CommonResponse(false, 500, 'Error saving hiring details with resume');
        }
    }

    @Post('deleteClientDetails')
    async deleteClientDetails(@Body() dto: ClientIdDto): Promise<CommonResponse> {
        try {
            return await this.clientService.deleteClientDetails(dto);
        } catch (error) {
            console.error('Error in delete client details in service:', error);
            return new CommonResponse(false, 500, 'Error deleting client details');
        }
    }

    @Post('getClientDetails')
    async getClientDetails(@Body() req: CommonReq): Promise<CommonResponse> {
        try {
            return await this.clientService.getClientDetails(req);
        } catch (error) {
            console.error('Error in get client details in service:', error);
            return new CommonResponse(false, 500, 'Error fetching client details');
        }
    }

    @Post('getClientDetailsById')
    async getClientDetailsById(@Body() req: ClientIdDto): Promise<CommonResponse> {
        try {
            return await this.clientService.getClientDetailsById(req);
        } catch (error) {
            console.error('Error in get client details in service:', error);
            return new CommonResponse(false, 500, 'Error fetching client details');
        }
    }

    @Post('clientLoginDetails')
    async clientLoginDetails(@Body() req: LoginDto): Promise<CommonResponse> {
        try {
            return await this.clientService.clientLoginDetails(req);
        } catch (error) {
            console.error('Error in get client details in service:', error);
            return new CommonResponse(false, 500, 'Error fetching client details');
        }
    }

    @Post('getClientNamesDropDown')
    async getClientNamesDropDown(): Promise<CommonResponse> {
        try {
            return this.clientService.getClientNamesDropDown();
        } catch (error) {
            return new CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }

    @Post('updateIsStatus')
    async updateIsStatus(@Body() dto: ClientIdDto): Promise<CommonResponse> {

        return this.clientService.updateIsStatus(dto);

    }

    @Post('getClientVerification')
    async getClientVerification(@Body() req: ClientDto): Promise<CommonResponse> {
        try {
            return this.clientService.getClientVerification(req);
        } catch (error) {
            console.log("Error in create address in services..", error);
            return new CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }

    @Post('getClientByPhoneNumber')
    async getClientByPhoneNumber(@Body() req: ClientDto): Promise<CommonResponse> {
        try {
            return this.clientService.getClientByPhoneNumber(req);
        } catch (error) {
            console.log("Error in create address in services..", error);
            return new CommonResponse(false, 500, 'Error fetching branch type details');
        }
    }
}
