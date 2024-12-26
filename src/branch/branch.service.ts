import { Injectable } from '@nestjs/common';
import { BranchRepository } from './repo/branch.repo';
import { BranchAdapter } from './branch.adapter';
import { BranchDto } from './dto/branch.dto';
import { BranchIdDto } from './dto/branch-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { join } from 'path';
import { promises as fs } from 'fs';
import { DesignationEnum } from 'src/staff/entity/staff.entity';

@Injectable()
export class BranchService {
    constructor(
        private adapter: BranchAdapter,
        private branchRepo: BranchRepository
    ) { }

    async saveBranchDetails(dto: BranchDto, photo: Express.Multer.File): Promise<CommonResponse> {
        try {
            // Handle photo upload
            let filePath: string | null = null;
            if (photo) {
                filePath = join(__dirname, '../../uploads/Branch_photos', `${Date.now()}-${photo.originalname}`);
                await fs.writeFile(filePath, photo.buffer); // Save the photo to the file system
            }

            // Convert DTO to Entity and set the photo path
            const entity = this.adapter.convertBranchDtoToEntity(dto);
            if (filePath) {
                entity.branchPhoto = filePath; // Save the photo path in the entity
            }

            // Save the branch details
            await this.branchRepo.save(entity);

            // Create the success message
            const message = dto.id
                ? 'Branch Details Updated Successfully'
                : 'Branch Details Created Successfully';

            return new CommonResponse(true, 65152, message, { branchPhoto: filePath });
        } catch (error) {
            throw new ErrorResponse(5416, error.message);
        }
    }

    async deleteBranchDetails(dto: BranchIdDto): Promise<CommonResponse> {
        try {
            const branchExists = await this.branchRepo.findOne({ where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode } });
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
            const branches = await this.branchRepo.find({
                where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode },
                relations: ['staff'],
            });

            if (branches.length === 0) {
                return new CommonResponse(false, 404, 'No Branches Found');
            }

            const data = branches.map(branch => {
                const manager = branch.staff.find(
                    (staff) => staff.designation === DesignationEnum.BranchManager
                );

                return {
                    branchId: branch.id,
                    branchName: branch.branchName,
                    managerName: manager ? manager.name : 'No Manager Assigned',
                    address: branch.branchAddress,
                    branchOpening: branch.branchOpening,
                    addressLine1: branch.addressLine1,
                    city: branch.city,
                    addressLine2: branch.addressLine2,
                    state: branch.state,
                    email: branch.email,
                    pincode: branch.pincode,
                    companyCode: branch.companyCode,
                    unitCode: branch.unitCode
                };
            });

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

    // async uploadBranchPhoto(branchId: number, photo: Express.Multer.File): Promise<CommonResponse> {
    //     try {
    //         const Branch = await this.branchRepo.findOne({ where: { id: branchId } });

    //         if (!Branch) {
    //             return new CommonResponse(false, 404, 'Branch not found');
    //         }

    //         const filePath = join(__dirname, '../../uploads/Branch_photos', `${branchId}-${Date.now()}.jpg`);
    //         await fs.writeFile(filePath, photo.buffer);

    //         Branch.branchPhoto = filePath;
    //         await this.branchRepo.save(Branch);

    //         return new CommonResponse(true, 200, 'Photo uploaded successfully', { photoPath: filePath });
    //     } catch (error) {
    //         throw new ErrorResponse(500, error.message);
    //     }
    // }
}
