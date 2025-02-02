import { Injectable } from '@nestjs/common';
import { BranchRepository } from './repo/branch.repo';
import { BranchAdapter } from './branch.adapter';
import { BranchDto } from './dto/branch.dto';
import { BranchIdDto } from './dto/branch-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { join } from 'path';
import { promises as fs } from 'fs';
import { CommonReq } from 'src/models/common-req';
import { BranchEntity } from './entity/branch.entity';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class BranchService {
    private storage: Storage;
    private bucketName: string;

    constructor(
        private readonly adapter: BranchAdapter,
        private readonly branchRepo: BranchRepository
    ) {
        this.storage = new Storage({
            projectId: process.env.GCLOUD_PROJECT_ID || 'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });

        // Set the bucket name
        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }

    async saveBranchDetails(dto: BranchDto, photo: Express.Multer.File): Promise<CommonResponse> {
        try {
            let fileUrl: string | null = null;

            // Check if this is an update and the entity already has a file
            let entity: BranchEntity | null = null;
            if (dto.id) {
                entity = await this.branchRepo.findOneBy({ id: dto.id });
                if (!entity) {
                    throw new ErrorResponse(404, 'Branch not found');
                }

                // If there's an existing file, delete it from GCS
                if (entity.branchPhoto) {
                    const existingFilePath = entity.branchPhoto.replace(`https://storage.googleapis.com/${this.bucketName}/`, '');
                    const file = this.storage.bucket(this.bucketName).file(existingFilePath);
                    try {
                        await file.delete();
                        console.log(`Deleted old file from GCS: ${existingFilePath}`);
                    } catch (error) {
                        console.error(`Error deleting file from GCS: ${error.message}`);
                        // Proceed even if the file doesn't exist or can't be deleted
                    }
                }

                // Merge updated details
                entity = this.branchRepo.merge(entity, dto);
            } else {
                // For new branches, convert DTO to Entity
                entity = this.adapter.convertBranchDtoToEntity(dto);
            }

            // Handle new photo upload
            if (photo) {
                const bucket = this.storage.bucket(this.bucketName);

                // Generate a unique file name
                const uniqueFileName = `Branch_photos/${Date.now()}-${photo.originalname}`;

                // Upload the file to Google Cloud Storage
                const file = bucket.file(uniqueFileName);

                await file.save(photo.buffer, {
                    contentType: photo.mimetype,
                    resumable: false,
                });

                console.log(`File uploaded to GCS: ${uniqueFileName}`);

                // Get the public URL of the uploaded file
                fileUrl = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
                entity.branchPhoto = fileUrl; // Set the file URL in the entity
            }

            console.log('Entity to be saved:', entity);

            // Save the branch details to the database
            await this.branchRepo.save(entity);

            // Create success message
            const message = dto.id ? 'Branch Details Updated Successfully' : 'Branch Details Created Successfully';

            return new CommonResponse(true, 65152, message, { branchPhoto: fileUrl });
        } catch (error) {
            console.error('Error saving branch details:', error);
            throw new ErrorResponse(5416, error.message); // Handle error and return response
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

    async getBranchDetails(req: CommonReq): Promise<CommonResponse> {
        const branch = await this.branchRepo.find({
            where: { companyCode: req.companyCode, unitCode: req.unitCode }
        });
        if (!branch.length) {
            return new CommonResponse(false, 35416, "There Is No List");
        } else {
            return new CommonResponse(true, 35416, "Branch List Retrieved Successfully", branch);
        }
    }

    async getBranchStaff(req: BranchIdDto): Promise<CommonResponse> {
        const branch = await this.branchRepo.getBranchStaff(req)
        if (!branch.length) {
            return new CommonResponse(false, 35416, "There Is No List");
        } else {
            return new CommonResponse(true, 35416, "Branch List Retrieved Successfully", branch);
        }
    }

    async getBranchDetailsById(req: BranchIdDto): Promise<CommonResponse> {
        try {
            const branch = await this.branchRepo.findOne({
                where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode },
                relations: ['staff', 'asserts'],
            });

            if (!branch) {
                return new CommonResponse(false, 404, 'No Branch Found');
            }

            const data = {
                branchId: branch.id,
                branchName: branch.branchName,
                branchNumber: branch.branchNumber,
                address: branch.branchAddress,
                branchOpening: branch.branchOpening,
                addressLine1: branch.addressLine1,
                city: branch.city,
                addressLine2: branch.addressLine2,
                state: branch.state,
                email: branch.email,
                pincode: branch.pincode,
                branchPhoto: branch.branchPhoto,
                companyCode: branch.companyCode,
                unitCode: branch.unitCode,
                staff: branch.staff.map(staff => ({
                    name: staff.name,
                    designation: staff.designation,
                    staffPhoto: staff.staffPhoto,
                })),
                asserts: branch.asserts.map(assert => ({
                    name: assert.assertsName,
                    photo: assert.assetPhoto,
                    amount: assert.assertsAmount,
                    type: assert.assetType
                })),
            };

            return new CommonResponse(true, 200, 'Branch Retrieved Successfully', data);
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

}
