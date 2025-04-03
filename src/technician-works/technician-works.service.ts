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
import { BranchChartDto } from 'src/voucher/dto/balance-chart.dto';


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
        } = {} // ✅ Default to an empty object
    ): Promise<CommonResponse> {
        let filePaths: Record<keyof typeof photos, string | undefined> = {
            photo1: undefined,
            photo2: undefined,
            photo3: undefined,
            photo4: undefined
        };
        console.log(filePaths, "fileoath")
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
        if (!photos || typeof photos !== 'object') {
            console.error('Photos parameter is null or undefined');
            photos = {}; // Ensure it's an empty object
        }

        return req.id
            ? await this.updateTechnicianDetails(req, filePaths)
            : await this.createTechnicianDetails(req, filePaths);
    }

    async createTechnicianDetails(req: TechnicianWorksDto, filePaths?: Record<string, string | null>): Promise<CommonResponse> {
        try {
            console.log(req, "req");

            if (req.imeiNumber && req.workStatus === WorkStatusEnum.INSTALL) {
                await this.productRepo.update(
                    { imeiNumber: req.imeiNumber },
                    { status: 'install' }
                );
            } else if (req.simNumber && req.workStatus === WorkStatusEnum.INSTALL) {
                await this.productRepo.update(
                    { simNumber: req.simNumber },
                    { status: 'install' }
                );
            }

            let ProductEntity;
            if (req.imeiNumber) {
                ProductEntity = await this.productRepo.findOne({
                    where: { imeiNumber: req.imeiNumber }
                });
            } else if (req.simNumber) {
                ProductEntity = await this.productRepo.findOne({
                    where: { simNumber: req.simNumber }
                });
            }

            req.productId = ProductEntity?.id;
            req.amount = ProductEntity?.cost

            // Convert DTO to Entity
            const newTechnician = this.adapter.convertDtoToEntity(req);
            newTechnician.productId = ProductEntity?.id;
            newTechnician.amount = ProductEntity?.cost

            console.log(newTechnician, "newTechnician");

            // Assign file URLs if available
            if (filePaths) {
                newTechnician.vehiclePhoto1 = filePaths.photo1;
                newTechnician.vehiclePhoto2 = filePaths.photo2;
                newTechnician.vehiclePhoto3 = filePaths.photo3;
                newTechnician.vehiclePhoto4 = filePaths.photo4;
            }

            // Generate Technician ID
            // newTechnician.technicianNumber = await this.generateTechNumber();

            await this.repo.insert(newTechnician);
            return new CommonResponse(true, 65152, 'Technician Details Created Successfully', newTechnician.id);
        } catch (error) {
            console.error(`Error creating Technician details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to create Technician details: ${error.message}`);
        }
    }



    async updateTechnicianDetails(
        req: TechnicianWorksDto,
        filePaths: Record<string, string | null> = {} // Ensure it's always an object
    ): Promise<CommonResponse> {
        try {
            // Ensure filePaths is always an object
            filePaths = filePaths ?? {};

            let existingTechnician: TechnicianWorksEntity | null = null;

            if (req.id) {
                existingTechnician = await this.repo.findOne({
                    where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode }
                });
            }

            if (!existingTechnician) {
                return new CommonResponse(false, 4002, 'Work not found for the provided ID.');
            }

            if ((req.imeiNumber || req.simNumber) && req.workStatus === WorkStatusEnum.INSTALL) {
                await this.productRepo.update(
                    { imeiNumber: req.imeiNumber, simNumber: req.simNumber },
                    { status: 'install' }
                );
            }

            // Find product based on IMEI or SIM
            const product = await this.productRepo.findOne({
                where: [
                    { imeiNumber: req.imeiNumber },
                    { simNumber: req.simNumber }
                ]
            });
            req.productId = product?.id;
            const photoMapping: Record<string, string> = {
                photo1: 'vehiclePhoto1',
                photo2: 'vehiclePhoto2',
                photo3: 'vehiclePhoto3',
                photo4: 'vehiclePhoto4',
            };

            // ✅ Ensure filePaths is always a valid object
            filePaths = filePaths ?? {};


            // ✅ Safeguard against undefined filePaths
            for (const [field, entityField] of Object.entries(photoMapping)) {
                if (filePaths[field]) {
                    (existingTechnician as any)[entityField] = filePaths[field];
                }
            }




            // Convert DTO to entity and retain existing ID
            const technicianEntity = this.adapter.convertDtoToEntity(req);
            technicianEntity.id = existingTechnician.id;

            // Retain photo fields
            Object.assign(existingTechnician, technicianEntity);

            console.log("Final data before saving:", existingTechnician);

            await this.repo.update({ id: existingTechnician.id }, {
                ...existingTechnician,
                vehiclePhoto1: existingTechnician.vehiclePhoto1,
                vehiclePhoto2: existingTechnician.vehiclePhoto2,
                vehiclePhoto3: existingTechnician.vehiclePhoto3,
                vehiclePhoto4: existingTechnician.vehiclePhoto4,
            });

            console.log("Data saved successfully");

            return new CommonResponse(true, 65152, 'Work Details Updated Successfully', existingTechnician.id);
        } catch (error) {
            console.error(`Error updating work details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to update work details: ${error.message}`);
        }
    }

    // private async generateTechNumber(): Promise<string> {
    //     // Get the current year
    //     const currentYear = new Date().getFullYear();
    //     const nextYear = (currentYear + 1) % 100; // Last two digits of next year
    //     const formattedYear = `${currentYear % 100}${nextYear}`; // e.g., "2526" for 2025

    //     // Fetch the last inserted technician record based on ID
    //     const lastTechnician = await this.repo
    //         .createQueryBuilder('te')
    //         .orderBy('te.id', 'DESC')
    //         .getOne();

    //     // Determine sequential number
    //     let sequentialNumber = 1;

    //     if (lastTechnician) {
    //         sequentialNumber = lastTechnician.id + 1; // Increment from last ID
    //     }

    //     // Format sequential number as 9 digits (padded with leading zeros)
    //     const paddedSequentialNumber = sequentialNumber.toString().padStart(9, '0');

    //     // Generate final TechNumber
    //     return `${formattedYear}-${paddedSequentialNumber}`;
    // }







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

    async getBackendSupportWorkAllocation(req: {
        staffId: string;
        companyCode?: string;
        unitCode?: string;
        fromDate?: string;
        toDate?: string;
        branchName?: string;
    }): Promise<CommonResponse> {
        const VoucherData = await this.repo.getBackendSupportWorkAllocation(req)
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

    async getPaymentStatusPayments(req: BranchChartDto): Promise<CommonResponse> {
        const VoucherData = await this.repo.getPaymentStatusPayments(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getSucessPaymentsForTable
        (req: BranchChartDto): Promise<CommonResponse> {
        const VoucherData = await this.repo.getSucessPaymentsForTable
            (req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getAllPaymentsForTable
        (req: BranchChartDto): Promise<CommonResponse> {
        const VoucherData = await this.repo.getAllPaymentsForTable
            (req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getPendingPaymentsForTable
        (req: BranchChartDto): Promise<CommonResponse> {
        const VoucherData = await this.repo.getPendingPaymentsForTable
            (req)
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

    async getWorkStatusCards(req: {
        companyCode: string; unitCode: string; date?: string
    }): Promise<CommonResponse> {
        const VoucherData = await this.repo.getWorkStatusCards(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getUpCommingWorkAllocationDetails(req: {
        companyCode?: string;
        unitCode?: string
        staffId: string;
    }): Promise<CommonResponse> {
        const VoucherData = await this.repo.getUpCommingWorkAllocationDetails(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getClientDataForTechniciansTable(req: {
        companyCode?: string;
        unitCode?: string
        clientId: string;
    }): Promise<CommonResponse> {
        const VoucherData = await this.repo.getClientDataForTechniciansTable(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }
}
