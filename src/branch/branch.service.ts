import { Injectable } from '@nestjs/common';
import { BranchRepository } from './repo/branch.repo';
import { BranchAdapter } from './branch.adapter';
import { BranchDto } from './dto/branch.dto';
import { BranchIdDto } from './dto/branch-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class BranchService {
    constructor(
        private adapter: BranchAdapter,
        private branchRepo: BranchRepository
    ) { }

    async saveBranchDetails(dto: BranchDto): Promise<CommonResponse> {
        try {
            const internalMessage = dto.id
                ? 'Branch Details Updated Successfully'
                : 'Branch Details Created Successfully';

            const convertDto = this.adapter.convertBranchDtoToEntity(dto);
            await this.branchRepo.save(convertDto);

            return new CommonResponse(true, 65152, internalMessage);
        } catch (error) {
            throw new ErrorResponse(5416, error.message);
        }
    }

    async deleteBranchDetails(dto: BranchIdDto): Promise<CommonResponse> {
        try {
            const branchExists = await this.branchRepo.findOne({ where: { id: dto.id } });
            if (!branchExists) {
                throw new ErrorResponse(404, `Branch with ID ${dto.id} does not exist`);
            }
            await this.branchRepo.delete(dto.id);
            return new CommonResponse(true, 65153, 'Branch Details Deleted Successfully');
        } catch (error) {
            throw new ErrorResponse(5417, error.message);
        }
    }

    async getBranchDetails(req: BranchIdDto): Promise<CommonResponse> {
        try {
            const branches = await this.branchRepo.find({ where: { id: req.id } });
            if (branches.length === 0) {
                return new CommonResponse(false, 404, 'No Branches Found');
            }
            const data = branches.map(branch => ({
                branchId: branch.id,
                branchName: branch.branchName,
                managerName: branch.managerName,
                address: `${branch.addressLine1}, ${branch.addressLine2}, ${branch.city}, ${branch.state}, ${branch.pincode}`,
                branchOpening: branch.branchOpening,
                email: branch.email
            }));

            return new CommonResponse(true, 200, 'Branches Retrieved Successfully', data);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getBranchNamesDropDown(): Promise<CommonResponse> {
        const data = await this.branchRepo.find({ select: ['branchName', 'id', 'branchNumber'] });
        if (data.length) {
            return new CommonResponse(true, 75483, "Data Retrieved Successfully", data)
        } else {
            return new CommonResponse(false, 4579, "There Is No branch names")
        }
    }

    async uploadBranchPhoto(branchId: number, photo: Express.Multer.File): Promise<CommonResponse> {
        try {
            const Branch = await this.branchRepo.findOne({ where: { id: branchId } });

            if (!Branch) {
                return new CommonResponse(false, 404, 'Branch not found');
            }

            const filePath = join(__dirname, '../../uploads/Branch_photos', `${branchId}-${Date.now()}.jpg`);
            await fs.writeFile(filePath, photo.buffer);

            Branch.branchPhoto = filePath;
            await this.branchRepo.save(Branch);

            return new CommonResponse(true, 200, 'Photo uploaded successfully', { photoPath: filePath });
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }
}
