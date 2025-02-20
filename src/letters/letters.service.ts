import { Injectable } from "@nestjs/common";
import { CommonResponse } from "src/models/common-response";
import { ErrorResponse } from "src/models/error-response";
import { StaffRepository } from "src/staff/repo/staff-repo";
import { LettersDto } from "./dto/letters.dto";
import { LettersAdapter } from "./letters.adapter";
import { PermissionIdDto } from "src/permissions/dto/permission-id.dto";
import { LettersRepository } from "./repo/letters.repo";

@Injectable()
export class LettersService {
    constructor(
        private adapter: LettersAdapter,
        private repo: LettersRepository,
        private readonly staffRepo: StaffRepository
    ) { }



    async saveLetterDetails(dto: LettersDto): Promise<CommonResponse> {
        try {
            // Fetch the staff entity based on the staffId provided in the DTO
            const staff = await this.staffRepo.findOne({ where: { staffId: dto.staffId } });

            if (!staff) {
                throw new ErrorResponse(5417, 'Staff not found');
            }

            // Debugging: Check if Letters are received or default is needed
            console.log("Incoming Letters:", dto);
            // Convert DTO to entity
            const entity = this.adapter.convertLettersDtoToEntity(dto);

            // Associate the existing staff entity with the permission entity
            entity.staffId = staff; // Use the full staff entity instead of just the ID


            // Debugging: Check entity before saving
            console.log("Entity Before Save:", entity);

            // Save the permission entity
            await this.repo.insert(entity);

            return new CommonResponse(true, 65152, 'Permission Details Created Successfully');
        } catch (error) {
            console.error('Error:', error.message);
            throw new ErrorResponse(5416, error.message);
        }
    }

    async updateLettersDetails(dto: LettersDto): Promise<CommonResponse> {
        try {
            // Ensure the staff entity exists
            const staff = await this.staffRepo.findOne({ where: { staffId: dto.staffId } });
            if (!staff) {
                throw new ErrorResponse(5417, 'Staff not found');
            }

            // Ensure the permission entity exists
            const permission = await this.repo.findOne({ where: { staffId: staff } });
            if (!permission) {
                throw new ErrorResponse(5417, 'Permission not found');
            }

            // Merge updated values
            const permissionEntity = this.adapter.convertLettersDtoToEntity(dto);
            const updatedEntity = this.repo.merge(permission, permissionEntity);

            // Debugging: Check if the entity is valid before saving
            console.log("Updated Permission Entity:", updatedEntity);

            // Save changes
            await this.repo.save(updatedEntity);

            return new CommonResponse(true, 65152, 'Permission Details Updated Successfully');
        } catch (error) {
            console.error('Error:', error.message);
            throw new ErrorResponse(5416, error.message);
        }
    }


    async getLettersDetails(req: PermissionIdDto): Promise<CommonResponse> {
        try {
            const Letters = await this.repo.findOne({
                where: { companyCode: req.companyCode, unitCode: req.unitCode },
                relations: ['staffId']
            });

            if (!Letters) {
                return new CommonResponse(false, 404, 'Letters not found');
            }
            return new CommonResponse(true, 200, 'Permission details fetched successfully', Letters);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getStaffLetters(req: { staffId?: string, companyCode: string, unitCode: string }): Promise<CommonResponse> {
        const data = await this.repo.getStaffLetters(req)
        if (!data) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", data)
        }

    }
}
