import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { BranchRepository } from 'src/branch/repo/branch.repo';
import { CommonReq } from 'src/models/common-req';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { VoucherRepository } from 'src/voucher/repo/voucher.repo';
import { AssertsAdapter } from './asserts.adapter';
import { AssertsIdDto } from './dto/asserts-id.dto';
import { AssertsDto } from './dto/asserts.dto';
import { AssertsEntity } from './entity/asserts-entity';
import { AssertsRepository } from './repo/asserts.repo';
@Injectable()
export class AssertsService {
    private storage: Storage;
    private bucketName: string;
    constructor(
        private adapter: AssertsAdapter,
        private assertsRepository: AssertsRepository,
        private voucherRepo: VoucherRepository,
        private readonly branchRepo: BranchRepository

    ) {
        this.storage = new Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });

        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }

    async getAssertDetails(req: AssertsIdDto): Promise<CommonResponse> {
        try {
            const assert = await this.assertsRepository.findOne({
                relations: ['branchId'],
                where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode },
            });

            if (!assert) {
                return new CommonResponse(false, 404, 'Assert not found');
            }
            const data = this.adapter.convertEntityToDto(assert);
            return new CommonResponse(true, 6541, 'Data Retrieved Successfully', data);
        } catch (error) {
            console.error('Error in getAssertDetails service:', error);
            return new CommonResponse(false, 500, 'Error fetching assert details');
        }
    }

    async getAllAssertDetails(req: CommonReq): Promise<CommonResponse> {
        try {
            const assert = await this.assertsRepository.find({
                relations: ['branchId'],
                where: { companyCode: req.companyCode, unitCode: req.unitCode },
            });

            if (!assert) {
                return new CommonResponse(false, 404, 'Assert not found');
            }
            return new CommonResponse(true, 6541, 'Data Retrieved Successfully', assert);
        } catch (error) {
            console.error('Error in getAssertDetails service:', error);
            return new CommonResponse(false, 500, 'Error fetching assert details');
        }
    }

    async create(createAssertsDto: AssertsDto, photo: Express.Multer.File): Promise<CommonResponse> {
        try {

            let entity: AssertsEntity | null = null;

            if (createAssertsDto.id) {
                // Fetch existing entity if updating
                entity = await this.assertsRepository.findOneBy({ id: createAssertsDto.id });
                if (!entity) {
                    throw new ErrorResponse(404, 'Asset not found');
                }

                // Merge new data into the existing entity, EXCLUDING branchId
                const { branchId,...rest } = createAssertsDto;

                entity = this.assertsRepository.merge(entity, rest);

                // Fetch and assign BranchEntity properly
                if (branchId) {
                    const branchEntity = await this.branchRepo.findOne({ where: { id: branchId } });
                    if (!branchEntity) {
                        throw new Error(`Branch with ID ${branchId} not found`);
                    }
                    entity.branchId = branchEntity; // Assign full entity instead of number
                }
                if (photo && entity.assetPhoto) {
                    const existingFilePath = entity.assetPhoto.replace(`https://storage.googleapis.com/${this.bucketName}/`, '');
                    const file = this.storage.bucket(this.bucketName).file(existingFilePath);

                    try {
                        await file.delete();
                        console.log(`Deleted old file from GCS: ${existingFilePath}`);
                    } catch (error) {
                        console.error(`Error deleting old file from GCS: ${error.message}`);
                    }
                }
            } else {
                // Create a new entity if ID does not exist
                entity = await this.adapter.convertDtoToEntity(createAssertsDto);
            }

            // Upload new file if provided
            let filePath: string | null = null;
            if (photo) {
                const bucket = this.storage.bucket(this.bucketName);
                const uniqueFileName = `assert_photos/${Date.now()}-${photo.originalname}`;
                const file = bucket.file(uniqueFileName);

                await file.save(photo.buffer, {
                    contentType: photo.mimetype,
                    resumable: false,
                });

                console.log(`File uploaded to GCS: ${uniqueFileName}`);
                filePath = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
                entity.assetPhoto = filePath;
            }

            // Save the entity
            await this.assertsRepository.save(entity);

            const message = createAssertsDto.id
                ? 'Assert Details Updated Successfully'
                : 'Assert Details Created Successfully';

            return new CommonResponse(true, 200, message, { photoPath: filePath });

        } catch (error) {
            console.error('Error saving asset details:', error);
            throw new ErrorResponse(500, error.message);
        }
    }

    async deleteAssertDetails(dto: AssertsIdDto): Promise<CommonResponse> {
        try {
            console.log(dto, "++++")
            const assertExists = await this.assertsRepository.findOne({ where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode } });
            console.log(assertExists, "++++")

            if (!assertExists) {
                throw new ErrorResponse(404, `assert with ID ${dto.id} does not exist`);
            }
            await this.assertsRepository.delete(dto.id);
            return new CommonResponse(true, 65153, 'assert Details Deleted Successfully');
        } catch (error) {
            throw new ErrorResponse(5417, error.message);
        }
    }

}
