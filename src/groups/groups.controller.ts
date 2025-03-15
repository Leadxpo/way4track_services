import { Body, Controller, Post } from "@nestjs/common";
import { GroupsService } from "./groups.service";
import { GroupsDto } from "./dto/groups.dto";
import { CommonResponse } from "src/models/common-response";


@Controller('groups')
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) { }

    @Post('create')
    async create(@Body() dto: GroupsDto): Promise<GroupsDto> {
        return this.groupsService.create(dto);
    }

    @Post('findAll')
    async findAll(): Promise<GroupsDto[]> {
        return this.groupsService.findAll();
    }

    @Post('findOne')
    async findOne(@Body() id: number): Promise<GroupsDto> {
        return this.groupsService.findOne(id);
    }

    @Post('update')
    async update(@Body() dto: GroupsDto): Promise<GroupsDto> {
        return this.groupsService.update(dto);
    }

    @Post('delete')
    async delete(@Body() id: number): Promise<void> {
        return this.groupsService.delete(id);
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
            //         return new CommonResponse(false, 500, 'Error details');
        }
    }

}
