import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ClientIdDto } from './dto/client-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { ClientDto } from './dto/client.dto';
import { ClientService } from './client.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('client')
export class ClientController {
    constructor(private readonly clientService: ClientService) { }

    @Post('saveClientDetails')
    async saveClientDetails(@Body() dto: ClientDto): Promise<CommonResponse> {
        try {
            return await this.clientService.saveClientDetails(dto);
        } catch (error) {
            console.error('Error in save client details in service:', error);
            return new CommonResponse(false, 500, 'Error saving client details');
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
    async getClientDetails(@Body() req: ClientIdDto): Promise<CommonResponse> {
        try {
            return await this.clientService.getClientDetails(req);
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

    @Post('uploadPhoto')
    @UseInterceptors(FileInterceptor('photo'))
    async uploadPhoto(
        @Body('clientId') clientId: number,
        @UploadedFile() photo: Express.Multer.File
    ): Promise<CommonResponse> {
        try {
            return await this.clientService.uploadClientPhoto(clientId, photo);
        } catch (error) {
            console.error('Error uploading client photo:', error);
            return new CommonResponse(false, 500, 'Error uploading photo');
        }
    }
}
