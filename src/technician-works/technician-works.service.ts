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
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { WorkStatusEnum } from 'src/work-allocation/enum/work-status-enum';
import { ProductEntity } from 'src/product/entity/product.entity';
import { ClientEntity } from 'src/client/entity/client.entity';
import { VoucherEntity } from 'src/voucher/entity/voucher.entity';
import { BranchChartDto } from 'src/voucher/dto/balance-chart.dto';
import { VehicleTypeRepository } from 'src/vehicle-type/repo/vehicle-type.repo';
import { ServiceTypeRepository } from 'src/service-type/repo/service.repo';
import { VendorEntity } from 'src/vendor/entity/vendor.entity';
import { VehicleTypeEntity } from 'src/vehicle-type/entity/vehicle-type.entity';
import { ServiceTypeEntity } from 'src/service-type/entity/service.entity';
import { WorkAllocationEntity } from 'src/work-allocation/entity/work-allocation.entity';
import { SubDealerEntity } from 'src/sub-dealer/entity/sub-dealer.entity';
import { NotificationService } from 'src/notifications/notification.service';
import { NotificationEnum } from 'src/notifications/entity/notification.entity';
import { PaymentStatus } from 'src/product/dto/payment-status.enum';
import { ClientRepository } from 'src/client/repo/client.repo';
import { ClientService } from 'src/client/client.service';
import { ClientDto } from 'src/client/dto/client.dto';
import { ClientStatus } from 'src/client/enum/client-status.enum';
import { StaffRepository } from 'src/staff/repo/staff-repo';
import { NotificationRepository } from 'src/notifications/repo/notification.repo';
import { NotificationAdapter } from 'src/notifications/notification.adapter';


@Injectable()
export class TechnicianService {
    private storage: Storage;
    private bucketName: string;
    constructor(
        private adapter: TechnicianWorksAdapter,
        private repo: TechinicianWoksRepository,
        private productRepo: ProductRepository,
        private vehicleRepo: VehicleTypeRepository,
        private serviceRepo: ServiceTypeRepository,
        private notificationService: NotificationService,
        private clientService: ClientService,
        private clientRepo: ClientRepository,
        private staffRepository: StaffRepository,
        private notificationRepository: NotificationRepository,
        private notificationAdapter: NotificationAdapter

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
            photo5?: Express.Multer.File[];
            photo6?: Express.Multer.File[];
            photo7?: Express.Multer.File[];
            photo8?: Express.Multer.File[];
            photo9?: Express.Multer.File[];
            photo10?: Express.Multer.File[];
            screenShot?: Express.Multer.File[];
            image?: Express.Multer.File[];
            videos?: Express.Multer.File[];
        } = {}
    ): Promise<CommonResponse> {
        let filePaths: Record<keyof typeof photos, string | undefined> = {
            photo1: undefined,
            photo2: undefined,
            photo3: undefined,
            photo4: undefined,
            photo5: undefined,
            photo6: undefined,
            photo7: undefined,
            photo8: undefined,
            photo9: undefined,
            photo10: undefined,
            screenShot: undefined,
            image: undefined,
            videos: undefined
        };

        const uploadedImages: string[] = [];
        const uploadedVideos: string[] = [];

        for (const [key, fileArray] of Object.entries(photos)) {
            if (!fileArray || fileArray.length === 0) continue;

            if (key === 'image' || key === 'videos') continue;

            const file = fileArray[0];
            const uniqueFileName = `vehicle_photos/${Date.now()}-${file.originalname}`;
            const storageFile = this.storage.bucket(this.bucketName).file(uniqueFileName);

            await storageFile.save(file.buffer, {
                contentType: file.mimetype,
                resumable: false,
            });

            filePaths[key as keyof typeof filePaths] = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
        }

        // Upload multiple remark images
        if (photos.image?.length) {
            for (const file of photos.image) {
                const uniqueFileName = `remark_images/${Date.now()}-${file.originalname}`;
                const storageFile = this.storage.bucket(this.bucketName).file(uniqueFileName);

                await storageFile.save(file.buffer, {
                    contentType: file.mimetype,
                    resumable: false,
                });

                uploadedImages.push(`https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`);
            }
        }

        // Upload multiple remark videos
        if (photos.videos?.length) {
            for (const file of photos.videos) {
                const uniqueFileName = `remark_videos/${Date.now()}-${file.originalname}`;
                const storageFile = this.storage.bucket(this.bucketName).file(uniqueFileName);

                await storageFile.save(file.buffer, {
                    contentType: file.mimetype,
                    resumable: false,
                });

                uploadedVideos.push(`https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`);
            }
        }
        console.log(photos, "?")
        return req.id
            ? await this.updateTechnicianDetails(req, filePaths, uploadedImages, uploadedVideos)
            : await this.createTechnicianDetails(req, filePaths, uploadedImages, uploadedVideos);

    }


    async createTechnicianDetails(
        req: TechnicianWorksDto,
        filePaths?: Record<string, string | null>,
        uploadedImages: string[] = [],
        uploadedVideos: string[] = []
    ): Promise<CommonResponse> {

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
            let vehicle;
            if (req.vehicleId) {
                vehicle = await this.vehicleRepo.findOne({ where: { id: req.vehicleId } })
            }
            req.vehicleId = vehicle?.id
            req.vehicleType = vehicle?.name

            let service;
            if (req.serviceId) {
                service = await this.serviceRepo.findOne({ where: { id: req.serviceId } })
            }
            req.serviceId = service?.id
            req.service = service?.name


            // Convert DTO to Entity
            const newTechnician = this.adapter.convertDtoToEntity(req);
            newTechnician.productId = ProductEntity?.id;
            newTechnician.amount = ProductEntity?.cost


            // Assign file URLs if available
            if (filePaths) {
                newTechnician.vehiclePhoto1 = filePaths.photo1;
                newTechnician.vehiclePhoto2 = filePaths.photo2;
                newTechnician.vehiclePhoto3 = filePaths.photo3;
                newTechnician.vehiclePhoto4 = filePaths.photo4;
                newTechnician.vehiclePhoto5 = filePaths.photo5;
                newTechnician.vehiclePhoto6 = filePaths.photo6;
                newTechnician.vehiclePhoto7 = filePaths.photo7;
                newTechnician.vehiclePhoto8 = filePaths.photo8;
                newTechnician.vehiclePhoto9 = filePaths.photo9;
                newTechnician.vehiclePhoto10 = filePaths.photo10;
                newTechnician.screenShot = filePaths.screenShot;

            }

            if (typeof newTechnician.remark === 'string') {
                newTechnician.remark = JSON.parse(newTechnician.remark);
            }
            if (typeof newTechnician.remark === 'string') {
                newTechnician.remark = JSON.parse(newTechnician.remark);
            }

            if (Array.isArray(newTechnician.remark)) {
                newTechnician.remark = newTechnician.remark.map((remark, index) => ({
                    ...remark,
                    image: uploadedImages[index] || null,
                    video: uploadedVideos[index] || null,
                }));
            }


            // Generate Technician ID
            newTechnician.technicianNumber = await this.generateTechNumber();
            const client = await this.clientRepo.findOne({ where: { phoneNumber: req.phoneNumber } })
            if (!client) {
                const clientDto: ClientDto = {
                    name: newTechnician.name || "",
                    branch: req.branchId ?? null,
                    phoneNumber: newTechnician.phoneNumber || "",
                    dob: "",
                    email: newTechnician.email || "",
                    address: newTechnician.address || "",
                    state: "",
                    companyCode: req.companyCode ?? "",
                    unitCode: req.unitCode ?? "",
                    hsnCode: "",
                    userName:newTechnician.userName,
                    SACCode: "",
                    tds: false,
                    tcs: false,
                    status: ClientStatus.Active,
                    // password: ""
                };

                try {
                   const rrr= await this.clientService.createClientDetails(clientDto);
                   console.log("bbb",rrr.data.id);
                    newTechnician.clientId =rrr.data.id; 
                    console.log(newTechnician, "newTechnician");

                    await this.repo.insert(newTechnician);
        
                } catch (notificationError) {
                    console.error(`client failed: ${notificationError.message}`, notificationError.stack);
                }
            }else{
                try {
                     await this.repo.insert(newTechnician);
                 } catch (notificationError) {
                     console.error(`client failed: ${notificationError.message}`, notificationError.stack);
                 }
            }
            return new CommonResponse(true, 65152, 'Technician Details Created Successfully', newTechnician.id);
        } catch (error) {
            console.error('Error creating Technician details:', error);

            // Handle TypeORM QueryFailedError (e.g., unique constraint, null value, etc.)
            const code = error.driverError?.code;
            let errorMessage = 'Database error occurred.';
            let field = '';

            switch (code) {
                case '23505': // unique_violation
                    field = error.driverError.detail?.match(/\(([^)]+)\)/)?.[1] || '';
                    errorMessage = 'Duplicate entry found.';
                    break;
                case '23502': // not_null_violation
                    field = error.driverError.column || '';
                    errorMessage = 'A required field is missing.';
                    break;
                case '23503': // foreign_key_violation
                    field = error.driverError.constraint || '';
                    errorMessage = 'Invalid reference to another table.';
                    break;
            }

            throw new ErrorResponse(400, `${errorMessage} ${field ? 'Field: ' + field : ''}`);
        }
    }

    async updateTechnicianDetails(
        req: TechnicianWorksDto,
        filePaths: Record<string, string | null> = {},
        uploadedImages: string[] = [],
        uploadedVideos: string[] = []
    ): Promise<CommonResponse> {
        try {
            console.log(req, "remark");


            // filePaths = filePaths ?? {};
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


            // ✅ Ensure filePaths is always a valid object
            filePaths = filePaths ?? {};

            console.log("Saving technician with remarks: before", existingTechnician.remark);
            let parsedRemark = req.remark;
            if (typeof req.remark === 'string') {
                try {
                    parsedRemark = JSON.parse(req.remark);
                } catch (e) {
                    console.error('Failed to parse remark string', req.remark);
                    parsedRemark = [];  // Default to an empty array in case of parsing error
                }
            }

            // Ensure it's an array before processing
            if (!Array.isArray(parsedRemark)) {
                parsedRemark = [];  // Default to an empty array if it's not a valid array
            }
            // ✅ Create new remarks with media
            let newRemarks: any[] = [];
            if (parsedRemark && Array.isArray(parsedRemark)) {
                newRemarks = parsedRemark.map((remark, index) => ({
                    ...remark,
                    image: uploadedImages[index] || null,
                    video: uploadedVideos[index] || null,
                }));

            }


            // ✅ Merge remarks
            existingTechnician.remark = Array.isArray(existingTechnician.remark)
                ? [...existingTechnician.remark, ...newRemarks]
                : newRemarks;

            console.log("Saving technician with remarks:", existingTechnician.remark);


            if (existingTechnician.workStatus === WorkStatusEnum.ACTIVATE && existingTechnician.paymentStatus === PaymentStatus.PENDING && existingTechnician.subDealerId) {
                try {
                    await this.notificationService.createNotification(existingTechnician, NotificationEnum.TechnicianWorks);
                } catch (notificationError) {
                    console.error(`Notification failed: ${notificationError.message}`, notificationError.stack);
                }
            }


            // New logic: Notify related staff of new remarks
            if (newRemarks.length > 0) {
                const staffIdValue =
                    typeof existingTechnician.staffId === 'object'
                        ? existingTechnician.staffId.staffId
                        : existingTechnician.staffId;

                const relatedStaff = await this.staffRepository.find({
                    where: {
                        companyCode: existingTechnician.companyCode,
                        unitCode: existingTechnician.unitCode,
                        staffId: staffIdValue,
                    },
                    relations: ['branch'],
                });


                for (const staff of relatedStaff) {
                    for (const newRemark of newRemarks) {
                        const message = `New remark added: ${newRemark?.text || 'No message'}`;

                        const notificationEntity = this.notificationAdapter.convertDtoToEntity({
                            message,
                            createdAt: new Date(),
                            isRead: false,
                            notificationType: NotificationEnum.TechnicianWorks,
                            userId: staff.id,
                            branchId: null,
                            companyCode: staff.companyCode,
                            unitCode: staff.unitCode,
                            subDealerId: null, // ✅ Add this line
                        });


                        await this.notificationRepository.insert(notificationEntity);
                    }
                }
            }


            // ✅ Convert rest of DTO, remove remark
            let convertedData = this.adapter.convertDtoToEntity(req);
            delete convertedData.remark;

            Object.assign(existingTechnician, convertedData);
            if (filePaths) {
                existingTechnician.vehiclePhoto1 = filePaths.photo1;
                existingTechnician.vehiclePhoto2 = filePaths.photo2;
                existingTechnician.vehiclePhoto3 = filePaths.photo3;
                existingTechnician.vehiclePhoto4 = filePaths.photo4;
                existingTechnician.vehiclePhoto5 = filePaths.photo5;
                existingTechnician.vehiclePhoto6 = filePaths.photo6;
                existingTechnician.vehiclePhoto7 = filePaths.photo7;
                existingTechnician.vehiclePhoto8 = filePaths.photo8;
                existingTechnician.vehiclePhoto9 = filePaths.photo9;
                existingTechnician.vehiclePhoto10 = filePaths.photo10;
                existingTechnician.screenShot = filePaths.screenShot;

            }


            await this.repo.save(existingTechnician);

            return new CommonResponse(true, 65152, 'Work Details Updated Successfully', existingTechnician.id);
        } catch (error) {
            console.error('Error updating work details:', error);

            // Handle TypeORM QueryFailedError (e.g., unique constraint, null value, etc.)
            const code = error.driverError?.code;
            let errorMessage = 'Database error occurred.';
            let field = '';

            switch (code) {
                case '23505': // unique_violation
                    field = error.driverError.detail?.match(/\(([^)]+)\)/)?.[1] || '';
                    errorMessage = 'Duplicate entry found.';
                    break;
                case '23502': // not_null_violation
                    field = error.driverError.column || '';
                    errorMessage = 'A required field is missing.';
                    break;
                case '23503': // foreign_key_violation
                    field = error.driverError.constraint || '';
                    errorMessage = 'Invalid reference to another table.';
                    break;
            }

            throw new ErrorResponse(400, `${errorMessage} ${field ? 'Field: ' + field : ''}`);
        }
    }

    private async generateTechNumber(): Promise<string> {
        // Get the current year
        const currentYear = new Date().getFullYear();
        const nextYear = (currentYear + 1) % 100; // Last two digits of next year
        const formattedYear = `${currentYear % 100}${nextYear}`; // e.g., "2526" for 2025

        // Fetch the last inserted technician record based on ID
        const lastTechnician = await this.repo
            .createQueryBuilder('te')
            .orderBy('te.id', 'DESC')
            .getOne();

        // Determine sequential number
        let sequentialNumber = 1;

        if (lastTechnician) {
            sequentialNumber = lastTechnician.id + 1; // Increment from last ID
        }

        // Format sequential number as 9 digits (padded with leading zeros)
        const paddedSequentialNumber = sequentialNumber.toString().padStart(9, '0');

        // Generate final TechNumber
        return `${formattedYear}-${paddedSequentialNumber}`;
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
            where: { companyCode: req.companyCode, unitCode: req.unitCode }, relations: ['branchId', 'voucherId', 'staffId', 'productId', 'clientId', 'workId', 'subDealerStaffId']
        });
        if (!branch.length) {
            return new CommonResponse(false, 35416, "There Is No List");
        } else {
            return new CommonResponse(true, 35416, "work List Retrieved Successfully", branch);
        }
    }

    async getTechnicianDetailsById(req: TechIdDto): Promise<CommonResponse> {
        try {
            console.log(req, "+++++++++++")

            const Technician = await this.repo.findOne({ where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode }, relations: ['branchId', 'backEndStaffRelation', 'applicationId', 'clientId', 'vehicleId', 'serviceId', 'subDealerId', 'subDealerStaffId'] });

            if (!Technician) {
                return new CommonResponse(false, 404, 'Technician not found');
            }
            else {
                return new CommonResponse(true, 200, 'Technician details fetched successfully', Technician);
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
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

    async getSubDealerPendingPayments(req: {
        subDealerId: number
    }): Promise<CommonResponse> {
        const VoucherData = await this.repo.getSubDealerPendingPayments(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getBackendSupportWorkAllocation(req: {
        staffId?: string;
        subDealerId?: string;
        supporterId?: string;
        companyCode?: string;
        unitCode?: string;
        fromDate?: string;
        toDate?: string;
        branchName?: string;
        status?: string;
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

    async getJobCompleted(req: {
        companyCode: string;
        unitCode: string;
        date?: string;
    }): Promise<CommonResponse> {
        const VoucherData = await this.repo.getJobCompleted(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getWorkStatusCards(req: {
        companyCode: string;
        unitCode: string;
        date?: string;
    }): Promise<CommonResponse> {
        const VoucherData = await this.repo.getWorkStatusCards(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }

    async getSubDealerServiceTypesCards(req: {
        companyCode: string; unitCode: string; date?: string
    }): Promise<CommonResponse> {
        const VoucherData = await this.repo.getSubDealerServiceTypesCards(req)
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

    async getClientDataForTablePhoneNumber(req: {
        companyCode?: string;
        unitCode?: string
        phoneNumber: string;
    }): Promise<CommonResponse> {
        const VoucherData = await this.repo.getClientDataForTablePhoneNumber(req)
        if (!VoucherData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", VoucherData)
        }

    }
}
