import { Body, Controller, Post } from "@nestjs/common";
import { GroupsService } from "./groups.service";
import { GroupsDto } from "./dto/groups.dto";
import { CommonResponse } from "src/models/common-response";
import { CommonReq } from "src/models/common-req";


@Controller('groups')
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) { }

    @Post('create')
    async create(@Body() dto: GroupsDto): Promise<CommonResponse> {
        try {
           
            return await this.groupsService.create(dto);
        } catch (error) {
            console.error('Error in save hiring details with resume in service:', error);
            return new CommonResponse(false, 500, 'Error saving hiring details with resume');
        }
    }

    @Post('findAll')
    async findAll(@Body() req: CommonReq): Promise<CommonResponse> {
        try {
            return await this.groupsService.findAll(req);

        } catch (error) {
            console.error('Error in get client details in service:', error);
            return new CommonResponse(false, 500, 'Error fetching client details');
        }
    }

    @Post('findOne')
    async findOne(@Body() id: number): Promise<CommonResponse> {
        try {
            return await this.groupsService.findOne(id);
        } catch (error) {
            console.error('Error in get client details in service:', error);
            return new CommonResponse(false, 500, 'Error fetching client details');
        }
    }

    @Post('update')
    async update(@Body() dto: GroupsDto): Promise<CommonResponse> {
        try {
            if (dto.id) {
                dto.id = Number(dto.id);
            }
            return await this.groupsService.update(dto);
        } catch (error) {
            console.error('Error in save hiring details with resume in service:', error);
            return new CommonResponse(false, 500, 'Error saving hiring details with resume');
        }
    }

    @Post('delete')
    async delete(@Body() id: number): Promise<CommonResponse> {
        try {
            return await this.groupsService.delete(id);
        } catch (error) {
            console.error('Error in delete client details in service:', error);
            return new CommonResponse(false, 500, 'Error deleting client details');
        }
    }

    @Post('getGroupDataForTable')
    async getGroupDataForTable(@Body() req: {
        underType?: string;
        under?: string;
        name?: string;
        companyCode: string;
        unitCode: string;
    }): Promise<CommonResponse> {
        try {
            return await this.groupsService.getGroupDataForTable(req)
        }
        catch (error) {
            console.log("Error in details in service..", error);
                 
        }
    }

}
