import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { CommonReq } from 'src/models/common-req';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { BranchAdapter } from './branch.adapter';
import { BranchIdDto } from './dto/branch-id.dto';
import { BranchDto } from './dto/branch.dto';
import { BranchEntity } from './entity/branch.entity';
import { BranchRepository } from './repo/branch.repo';

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

    async saveBranchDetails(
        dto: BranchDto,
        photos?: { photo?: Express.Multer.File[]; image?: Express.Multer.File[] }
    ): Promise<CommonResponse> {
        try {
            photos = photos ?? { photo: [], image: [] };
            let filePaths: Record<keyof typeof photos, string | undefined> = { photo: undefined, image: undefined };

            console.log(dto, "Received DTO");

            // Upload new files to Google Cloud Storage (GCS)
            for (const [key, fileArray] of Object.entries(photos)) {
                if (fileArray?.length > 0) {
                    const file = fileArray[0]; // First file
                    const uniqueFileName = `branch_photos/${Date.now()}-${file.originalname}`;
                    const storageFile = this.storage.bucket(this.bucketName).file(uniqueFileName);

                    await storageFile.save(file.buffer, {
                        contentType: file.mimetype,
                        resumable: false,
                    });

                    console.log(`File uploaded to GCS: ${uniqueFileName}`);
                    filePaths[key as keyof typeof photos] = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
                }
            }

            let entity: BranchEntity | null = null;

            if (dto.id) {
                // Fetch existing entity for updates
                entity = await this.branchRepo.findOneBy({ id: dto.id });

                if (!entity) {
                    throw new ErrorResponse(404, 'Branch not found');
                }

                const photoMapping: Record<'photo' | 'image', keyof BranchEntity> = {
                    photo: 'branchPhoto',
                    image: 'qrPhoto'
                };

                // Delete old files if new ones are uploaded
                for (const key in photoMapping) {
                    const entityField = photoMapping[key as keyof typeof photoMapping];

                    if (filePaths[key as keyof typeof filePaths]) {
                        const existingFilePath = entity[entityField];

                        // Ensure existingFilePath is a string before using replace()
                        if (typeof existingFilePath === 'string') {
                            const existingFileName = existingFilePath.replace(`https://storage.googleapis.com/${this.bucketName}/`, '');
                            const file = this.storage.bucket(this.bucketName).file(existingFileName);

                            try {
                                await file.delete();
                                console.log(`Deleted old file from GCS: ${existingFileName}`);
                            } catch (error) {
                                console.error(`Error deleting old file from GCS: ${error.message}`);
                            }
                        }

                        // ✅ Fix: Explicit type assertion to prevent 'never' type error
                        (entity as any)[entityField] = filePaths[key as keyof typeof filePaths];

                    }
                }

                // Merge new DTO data into the existing entity
                entity = this.branchRepo.merge(entity, dto);
            } else {
                // Create new branch entity
                entity = this.adapter.convertBranchDtoToEntity(dto);
                entity.branchPhoto = filePaths.photo;
                entity.qrPhoto = filePaths.image;
            }

            console.log("Final data before saving:", entity);

            // Save entity
            await this.branchRepo.save(entity);

            // Success message
            const message = dto.id ? 'Branch Details Updated Successfully' : 'Branch Details Created Successfully';

            return new CommonResponse(true, 200, message);
        } catch (error) {
            console.error('Error saving branch details:', error);
            throw new ErrorResponse(500, error.message);
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
            where: { companyCode: req.companyCode, unitCode: req.unitCode },
            relations: ['accounts'],
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
                relations: ['staff', 'asserts', 'accounts','product'],
            });

            if (!branch) {
                return new CommonResponse(false, 404, 'No Branch Found');
            }
            return new CommonResponse(true, 200, 'Branch Retrieved Successfully', branch);
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
