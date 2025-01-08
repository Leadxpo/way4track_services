import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AssertsDto } from './dto/asserts.dto';
import { AssertsIdDto } from './dto/asserts-id.dto';
import { AssertsService } from './asserts.service';
import { CommonResponse } from 'src/models/common-response';
import { FileInterceptor } from '@nestjs/platform-express';
import { AssertsVoucherIdDto } from './dto/asserts-voucher-id.dto';


@Controller('asserts')
export class AssertsController {
    constructor(private readonly assertsService: AssertsService) { }

    @UseInterceptors(FileInterceptor('photo'))
    @Post('create')
    async createAssert(
        @Body() createAssertsDto: AssertsDto,
        @UploadedFile() photo: Express.Multer.File,
    ): Promise<CommonResponse> {
        return this.assertsService.create(createAssertsDto, photo);
    }

    // @Post('deleteAssertDetails')
    // async deleteAssertDetails(@Body() dto: AssertsIdDto): Promise<CommonResponse> {
    //     try {
    //         return this.assertsService.deleteAssertDetails(dto);
    //     } catch (error) {
    //         console.log("Error in delete assert details in service..", error);
    //         return new CommonResponse(false, 500, 'Error deleting assert details');
    //     }
    // }

    @Post('getAssertDetails')
    async getAssertDetails(@Body() req: AssertsIdDto): Promise<CommonResponse> {
        try {
            return this.assertsService.getAssertDetails(req);
        } catch (error) {
            console.log("Error in get assert details in service..", error);
            return new CommonResponse(false, 500, 'Error fetching assert details');
        }
    }

    // @Post('uploadPhoto')
    // @UseInterceptors(FileInterceptor('photo'))
    // async uploadPhoto(
    //     @Body('assertId') assertId: number,
    //     @UploadedFile() photo: Express.Multer.File
    // ): Promise<CommonResponse> {
    //     try {
    //         return await this.assertsService.uploadAssertPhoto(assertId, photo);
    //     } catch (error) {
    //         console.error('Error uploading assert photo:', error);
    //         return new CommonResponse(false, 500, 'Error uploading photo');
    //     }
    // }
}
