import { Body, Controller, Post } from "@nestjs/common";
import { LettersService } from "./letters.service";
import { CommonResponse } from "src/models/common-response";
import { LettersDto } from "./dto/letters.dto";
import { PermissionIdDto } from "src/permissions/dto/permission-id.dto";


@Controller('letters')
export class LetterController {
    constructor(private readonly service: LettersService) {

    }

    @Post('handleLettersDetails')
    async updateLettersDetails(@Body() dto: LettersDto): Promise<CommonResponse> {
        try {
            if (dto.id) {
                dto.id = Number(dto.id);
            }
            return this.service.updateLettersDetails(dto);
        } catch (error) {
            console.log("Error in create Letters in services..", error)
        }
    }

    @Post('saveLetterDetails')
    async saveLetterDetails(@Body() dto: LettersDto): Promise<CommonResponse> {
        try {
            return this.service.saveLetterDetails(dto);
        } catch (error) {
            console.log("Error in create Letters in services..", error)
        }
    }


    @Post('getLettersDetails')
    async getLettersDetails(@Body() req: PermissionIdDto): Promise<CommonResponse> {
        try {
            return this.service.getLettersDetails(req);
        } catch (error) {
            console.log("Error in create Permission in services..", error);
            return new CommonResponse(false, 500, 'Error fetching Permission type details');
        }
    }

    @Post('getStaffLetters')
    async getStaffLetters(@Body() req: { staffId?: string, companyCode: string, unitCode: string }): Promise<CommonResponse> {
        try {
            return this.service.getStaffLetters(req);
        } catch (error) {
            console.log("Error in create Permission in services..", error);
            return new CommonResponse(false, 500, 'Error fetching Permission type details');
        }
    }

}