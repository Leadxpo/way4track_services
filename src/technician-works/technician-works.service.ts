import { Storage } from '@google-cloud/storage';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AttendenceRepository } from 'src/attendence/repo/attendence.repo';
import { LoginDto } from 'src/login/dto/login.dto';
import { CommonReq } from 'src/models/common-req';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { PermissionsDto } from 'src/permissions/dto/permissions.dto';
import { PermissionsService } from 'src/permissions/permissions.services';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { TechnicianWorksDto } from './dto/technician-works.dto';
import { TechnicianWorksAdapter } from './technician-works.adapter';
import { TechinicianWoksRepository } from './repo/technician-works.repo';
import { ProductRepository } from 'src/product/repo/product.repo';
import { TechnicianWorksEntity } from './entity/technician-works.entity';
import { TechIdDto } from './dto/technician-id.dto';
import { WorkStatusEnum } from 'src/work-allocation/enum/work-status-enum';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { ProductEntity } from 'src/product/entity/product.entity';
import { ClientEntity } from 'src/client/entity/client.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';


@Injectable()
export class TechnicianService {
    private storage: Storage;
    private bucketName: string;
    constructor(
        private adapter: TechnicianWorksAdapter,
        private repo: TechinicianWoksRepository,
        private productRepo: ProductRepository
    ) {
        this.storage = new Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });

        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }

    async handleTechnicianDetails(req: TechnicianWorksDto, photo?: Express.Multer.File): Promise<CommonResponse> {
        try {
            let filePath: string | null = null;

            // Handle photo upload
            if (photo) {
                const bucket = this.storage.bucket(this.bucketName);
                const uniqueFileName = `vechile_photos/${Date.now()}-${photo.originalname}`;
                const file = bucket.file(uniqueFileName);

                await file.save(photo.buffer, {
                    contentType: photo.mimetype,
                    resumable: false,
                });

                console.log(`File uploaded to GCS: ${uniqueFileName}`);
                filePath = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
            }
            if (req.id && req.id !== null) {
                console.log("🔄 Updating existing Technician record...");
                return await this.updateTechnicianDetails(req, filePath);
            } else {
                console.log("🆕 Creating a new Technician record...");
                return await this.createTechnicianDetails(req, filePath);
            }
        } catch (error) {
            console.error(`❌ Error handling Technician details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to handle Technician details: ${error.message}`);
        }
    }

    async createTechnicianDetails(req: TechnicianWorksDto, filePath?: string | null): Promise<CommonResponse> {
        try {
            if (req.imeiNumber) {
                if (req.workStatus === WorkStatusEnum.COMPLETED) {
                    await this.productRepo.update(
                        { imeiNumber: req.imeiNumber },
                        { location: 'install' }
                    );
                }
            }

            const newTechnician = this.adapter.convertDtoToEntity(req);
            if (filePath) {
                newTechnician.vehiclePhoto = filePath;
            }
            await this.repo.insert(newTechnician);
            return new CommonResponse(true, 65152, 'Technician Details and Permissions Created Successfully');
        } catch (error) {
            console.error(`Error creating Technician details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to create Technician details: ${error.message}`);
        }
    }

    async updateTechnicianDetails(req: TechnicianWorksDto, filePath?: string | null): Promise<CommonResponse> {
        try {
            let existingTechnician: TechnicianWorksEntity | null = null;

            if (req.id) {
                existingTechnician = await this.repo.findOne({
                    where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode }
                });
            }

            if (!existingTechnician) {
                return new CommonResponse(false, 4002, 'Work not found for the provided ID.');
            }

            // Update product location if work status is completed
            if (req.workStatus === WorkStatusEnum.COMPLETED) {
                await this.productRepo.update(
                    { imeiNumber: req.imeiNumber },
                    { location: 'install' }
                );
            }

            // Delete old vehicle photo if a new one is uploaded
            if (existingTechnician.vehiclePhoto && filePath) {
                const existingFilePath = existingTechnician.vehiclePhoto.replace(`https://storage.googleapis.com/${this.bucketName}/`, '');
                const file = this.storage.bucket(this.bucketName).file(existingFilePath);

                try {
                    await file.delete();
                    console.log(`Deleted old file from GCS: ${existingFilePath}`);
                } catch (error) {
                    console.error(`Error deleting old file from GCS: ${error.message}`);
                }
            }

            // Update vehiclePhoto if a new file path is provided
            if (filePath) {
                existingTechnician.vehiclePhoto = filePath;
            }

            // Convert DTO to entity and ensure ID is retained
            const technicianEntity = this.adapter.convertDtoToEntity(req);
            technicianEntity.id = existingTechnician.id;

            // Merge updated fields into existing technician
            Object.assign(existingTechnician, technicianEntity);

            // Save the updated technician entity
            await this.repo.save(existingTechnician);

            return new CommonResponse(true, 65152, 'Work Details Updated Successfully');
        } catch (error) {
            console.error(`Error updating work details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to update work details: ${error.message}`);
        }
    }

    async deleteTechnicianDetails(dto: TechIdDto): Promise<CommonResponse> {
        try {
            const TechnicianExists = await this.repo.findOne({ where: { id: dto.id, companyCode: dto.companyCode, unitCode: dto.unitCode } });
            if (!TechnicianExists) {
                throw new ErrorResponse(404, `work with id ${dto.id} does not exist`);
            }
            await this.repo.delete(dto.id);
            return new CommonResponse(true, 65153, 'work Details Deleted Successfully');
        } catch (error) {
            throw new ErrorResponse(5417, error.message);
        }
    }

    async getTechnicianDetails(req: CommonReq): Promise<CommonResponse> {
        const branch = await this.repo.find({
            where: { companyCode: req.companyCode, unitCode: req.unitCode }, relations: ['branchId', 'voucherId', 'staffId', 'productId', 'clientId', 'workId']
        });
        if (!branch.length) {
            return new CommonResponse(false, 35416, "There Is No List");
        } else {
            return new CommonResponse(true, 35416, "work List Retrieved Successfully", branch);
        }
    }

    async getTechnicianDetailsById(req: TechIdDto): Promise<CommonResponse> {
        try {
            const Technician = await this.repo.createQueryBuilder('Technician')
                .leftJoinAndSelect(BranchEntity, 'branch', 'branch.id = Technician.branch_id')
                .leftJoinAndSelect(StaffEntity, 'sf', 'sf.id = Technician.staff_id')
                .leftJoinAndSelect(ProductEntity, 'pa', 'pa.id = Technician.product_id')
                .leftJoinAndSelect(ClientEntity, 'cl', 'cl.id = Technician.client_id')
                .leftJoinAndSelect(VoucherEntity, 've', 've.id = Technician.voucher_id')

                .where('Technician.id = :id', { id: req.id })
                .andWhere('Technician.companyCode = :companyCode', { companyCode: req.companyCode })
                .andWhere('Technician.unitCode = :unitCode', { unitCode: req.unitCode })
                .getOne();

            if (!Technician) {
                return new CommonResponse(false, 404, 'work not found');
            }
            console.log(Technician);  // Log the result before conversion to DTO

            // const data = this.adapter.convertEntityToDto([Technician]);
            // console.log(data);  // Log the result before conversion to DTO

            return new CommonResponse(true, 200, 'work details fetched successfully', Technician);
        } catch (error) {
            console.error("Error in getTechnicianDetailsById service:", error);
            return new CommonResponse(false, 500, 'Error fetching Technician details');
        }
    }

    async getTotalWorkAllocation(req: {
        companyCode?: string;
        unitCode?: string
        staffId: string;
        date: string
    }): Promise<CommonResponse> {
        const VoucherData = await this.repo.getTotalWorkAllocation(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getPaymentWorkAllocation(req: {
        companyCode?: string;
        unitCode?: string
        staffId: string;
        date: string
    }): Promise<CommonResponse> {
        const VoucherData = await this.repo.getPaymentWorkAllocation(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getStaffWorkAllocation(req: {
        staffId: string; companyCode?: string;
        unitCode?: string
    }): Promise<CommonResponse> {
        const VoucherData = await this.repo.getStaffWorkAllocation(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getUpCommingWorkAllocation(req: {
        companyCode?: string;
        unitCode?: string
        staffId: string;
    }): Promise<CommonResponse> {
        const VoucherData = await this.repo.getUpCommingWorkAllocation(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }
}
