


import { Injectable } from "@nestjs/common";
import { GroupsDto } from "./dto/groups.dto";
import { GroupsAdapter } from "./groups.adapter";
import { CommonResponse } from "src/models/common-response";
import { UnderType, UnderPrimary, UnderSecondary } from "./entity/groups.entity";
import { GropusRepository } from "./repo/groups.repo";
import { ErrorResponse } from "src/models/error-response";
import { CommonReq } from "src/models/common-req";

@Injectable()
export class GroupsService {
    constructor(
        private readonly groupsRepository: GropusRepository,
        private readonly adapter: GroupsAdapter
    ) { }

    async create(dto: GroupsDto): Promise<CommonResponse> {
        try {
            const entity = this.adapter.toEntity(dto);
            const savedEntity = await this.groupsRepository.insert(entity);
            return new CommonResponse(true, 201, 'group details created successfully', savedEntity);
        } catch (error) {
            console.error(`Error creating group details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to create group details: ${error.message}`);
        }

    }

    async findAll(req: CommonReq): Promise<CommonResponse> {
        try {
            const group = await this.groupsRepository.find({ where: { companyCode: req.companyCode, unitCode: req.unitCode } });
            if (!group) {
                return new CommonResponse(false, 404, 'group not found');
            }
            else {
                return new CommonResponse(true, 200, 'group details fetched successfully', group);
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async findOne(id: number): Promise<CommonResponse> {
        try {

            const group = await this.groupsRepository.findOne({ where: { id: id, } });

            if (!group) {
                return new CommonResponse(false, 404, 'group not found');
            }
            else {
                return new CommonResponse(true, 200, 'group details fetched successfully', group);
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }

    }

    async update(dto: GroupsDto): Promise<CommonResponse> {
        try {
            const existinggroup = await this.groupsRepository.findOne({ where: { id: dto.id } });

            if (!existinggroup) {
                throw new Error('group not found');
            }

            await this.groupsRepository.update(dto.id, {
                name: dto.name,
                under: dto.under,
                companyCode: dto.companyCode,
                unitCode: dto.unitCode,
                underType: dto.underType,
            });

            return new CommonResponse(true, 200, 'group details updated successfully');
        } catch (error) {
            console.error(`Error updating group details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to update group details: ${error.message}`);
        }

    }

    async delete(id: number): Promise<CommonResponse> {
        try {
            const group = await this.groupsRepository.findOne({
                where: {
                    id: id,
                }
            });

            if (!group) {
                return new CommonResponse(false, 404, 'group not found');
            }

            await this.groupsRepository.delete({ id: id });

            return new CommonResponse(true, 200, 'group details deleted successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
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
