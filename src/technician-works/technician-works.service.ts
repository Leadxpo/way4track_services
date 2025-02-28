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

    async handleTechnicianDetails(
        req: TechnicianWorksDto,
        photos: {
            photo1?: Express.Multer.File[];
            photo2?: Express.Multer.File[];
            photo3?: Express.Multer.File[];
            photo4?: Express.Multer.File[];
        }
    ): Promise<CommonResponse> {
        let filePaths: Record<keyof typeof photos, string | undefined> = {
            photo1: undefined,
            photo2: undefined,
            photo3: undefined,
            photo4: undefined
        };

        for (const [key, fileArray] of Object.entries(photos)) {
            if (fileArray && fileArray.length > 0) {
                const file = fileArray[0]; // Get the first file
                const uniqueFileName = `vehicle_photos/${Date.now()}-${file.originalname}`;
                const storageFile = this.storage.bucket(this.bucketName).file(uniqueFileName);

                await storageFile.save(file.buffer, {
                    contentType: file.mimetype,
                    resumable: false,
                });

                console.log(`File uploaded to GCS: ${uniqueFileName}`);
                filePaths[key] = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
            }
        }

        return req.id
            ? await this.updateTechnicianDetails(req, filePaths)
            : await this.createTechnicianDetails(req, filePaths);
    }


    async createTechnicianDetails(req: TechnicianWorksDto, filePaths?: Record<string, string | null>): Promise<CommonResponse> {
        try {
            if (req.imeiNumber && req.workStatus === WorkStatusEnum.COMPLETED) {
                await this.productRepo.update(
                    { imeiNumber: req.imeiNumber },
                    { location: 'install' }
                );
            }

            const newTechnician = this.adapter.convertDtoToEntity(req);

            // Assign file URLs if available
            if (filePaths) {
                newTechnician.vehiclePhoto1 = filePaths.photo1;
                newTechnician.vehiclePhoto2 = filePaths.photo2;
                newTechnician.vehiclePhoto3 = filePaths.photo3;
                newTechnician.vehiclePhoto4 = filePaths.photo4;
            }


            await this.repo.insert(newTechnician);
            return new CommonResponse(true, 65152, 'Technician Details Created Successfully');
        } catch (error) {
            console.error(`Error creating Technician details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to create Technician details: ${error.message}`);
        }
    }


    async updateTechnicianDetails(req: TechnicianWorksDto, filePaths: Record<string, string | null>): Promise<CommonResponse> {
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

            if (req.workStatus === WorkStatusEnum.COMPLETED) {
                await this.productRepo.update(
                    { imeiNumber: req.imeiNumber },
                    { location: 'install' }
                );
            }

            // Photo field mapping
            const photoMapping: Record<string, string> = {
                photo1: 'vehiclePhoto1',
                photo2: 'vehiclePhoto2',
                photo3: 'vehiclePhoto3',
                photo4: 'vehiclePhoto4',
            };

            Object.keys(photoMapping).forEach(field => {
                const entityField = photoMapping[field];
                if (filePaths[field]) {
                    (existingTechnician as any)[entityField] = filePaths[field];
                }
            });

            // Delete old images from storage if new ones are provided
            for (const field in photoMapping) {
                const entityField = photoMapping[field];
                const newFilePath = filePaths[field];
                const existingFilePath = existingTechnician[entityField as keyof TechnicianWorksEntity];

                if (typeof existingFilePath === 'string' && newFilePath) {
                    const existingFileName = existingFilePath.replace(`https://storage.googleapis.com/${this.bucketName}/`, '');
                    const file = this.storage.bucket(this.bucketName).file(existingFileName);

                    try {
                        await file.delete();
                        console.log(`Deleted old file from GCS: ${existingFileName}`);
                    } catch (error) {
                        console.error(`Error deleting old file from GCS: ${error.message}`);
                    }
                }
            }

            // Convert DTO to entity and retain existing ID
            const technicianEntity = this.adapter.convertDtoToEntity(req);
            technicianEntity.id = existingTechnician.id;

            // Retain the photo fields in the updated entity
            Object.assign(existingTechnician, technicianEntity);

            Object.keys(photoMapping).forEach(field => {
                const entityField = photoMapping[field];
                if (filePaths[field]) {
                    (existingTechnician as any)[entityField] = filePaths[field];
                }
            });

            console.log("Final data before saving:", existingTechnician);

            await this.repo.update({ id: existingTechnician.id }, {
                ...existingTechnician,
                vehiclePhoto1: existingTechnician.vehiclePhoto1,
                vehiclePhoto2: existingTechnician.vehiclePhoto2,
                vehiclePhoto3: existingTechnician.vehiclePhoto3,
                vehiclePhoto4: existingTechnician.vehiclePhoto4,
            });

            console.log("Data saved successfully");

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

    async getPaymentStatus(req: CommonReq): Promise<CommonResponse> {
        const VoucherData = await this.repo.getPaymentStatus(req)
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
