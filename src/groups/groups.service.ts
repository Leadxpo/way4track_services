


import { Injectable } from "@nestjs/common";
import { GroupsDto } from "./dto/groups.dto";
import { GroupsAdapter } from "./groups.adapter";
import { CommonResponse } from "src/models/common-response";
import { UnderType, UnderPrimary, UnderSecondary } from "./entity/groups.entity";
import { GropusRepository } from "./repo/groups.repo";

@Injectable()
export class GroupsService {
    constructor(
        private readonly groupsRepository: GropusRepository,
        private readonly adapter: GroupsAdapter
    ) { }

    async create(dto: GroupsDto): Promise<GroupsDto> {
        const entity = this.adapter.toEntity(dto);
        const savedEntity = await this.groupsRepository.save(entity);
        return this.adapter.toDto(savedEntity);
    }

    async findAll(): Promise<GroupsDto[]> {
        const entities = await this.groupsRepository.find();
        return entities.map(entity => this.adapter.toDto(entity));
    }

    async findOne(id: number): Promise<GroupsDto> {
        const entity = await this.groupsRepository.findOne({ where: { id } });
        if (!entity) throw new Error('Group not found');
        return this.adapter.toDto(entity);
    }

    async update(dto: GroupsDto): Promise<GroupsDto> {
        await this.groupsRepository.update(dto.id, dto);
        return this.findOne(dto.id);
    }

    async delete(id: number): Promise<void> {
        await this.groupsRepository.delete(id);
    }

    async getGroupDataForTable(req: {
        underType?: string;
        under?: string;
        name?: string;
        companyCode: string;
        unitCode: string;
    }): Promise<CommonResponse> {
        const VoucherData = await this.groupsRepository.getGroupDataForTable(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }


    // getUnderOptions(underType: UnderType): string[] {
    //     return underType === UnderType.PRIMARY ? Object.values(UnderPrimary) : Object.values(UnderSecondary);
    // }
}
