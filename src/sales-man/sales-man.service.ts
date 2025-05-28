import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { SalesWorksEntity } from './entity/sales-man.entity';
import { SalesWorksDto } from './dto/sales-man.dto';
import { SalesworkRepository } from './repo/sales-man.repo';
import { SalesWorksAdapter } from './sales-man.adapter ';
import { ProductRepository } from 'src/product/repo/product.repo';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { Storage } from '@google-cloud/storage';
@Injectable()
export class SalesWorksService {
    private storage: Storage;
    private bucketName: string;
    constructor(

        private readonly salesWorksRepository: SalesworkRepository,
        private readonly adapter: SalesWorksAdapter,
        private readonly productRepository: ProductRepository

    ) {
        this.storage = new Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });

        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }

    async handleSales(req: SalesWorksDto, files: any): Promise<CommonResponse> {
        try {

            if (req.id && req.id !== null) {
                console.log("🔄 Updating existing staff record...");
                return await this.update(req, files);
            } else {
                console.log("🆕 Creating a new staff record...");
                return await this.create(req, files);
            }
        } catch (error) {
            console.error(`❌ Error handling staff details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to handle staff details: ${error.message}`);
        }
    }

    // async findAll(): Promise<SalesWorksDto[]> {
    //     const entities = await this.salesWorksRepository.find({ relations: ['staffId'] });
    //     return entities.map(this.adapter.convertEntityToDto);
    // }

    async getSalesSearchDetails(req: { companyCode: string; unitCode: string; staffId?: string; name?: string, branch?: string }) {
        const staffData = await this.salesWorksRepository.getSalesSearchDetails(req)
        if (!staffData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", staffData)
        }
    }

    // async findOne(id: number): Promise<SalesWorksDto> {
    //     const entity = await this.salesWorksRepository.findOne({ where: { id }, relations: ['staffId'] });
    //     if (!entity) {
    //         throw new Error('Sales Work not found');
    //     }
    //     return this.adapter.convertEntityToDto(entity);
    // }


    async findAll(): Promise<CommonResponse> {
        const branch: SalesWorksEntity[] = await this.salesWorksRepository.find();

        // Convert each entity in the array to DTO
        const staffDtos = branch.map(entity => this.adapter.convertEntityToDto(entity));

        // if (staffDtos.length === 0) {
        //     return new CommonResponse(false, 35416, "There Is No List");
        // }

        return new CommonResponse(true, 35416, "Branch List Retrieved Successfully", staffDtos);
    }


    async findOne(req: SalesWorksDto): Promise<CommonResponse> {
        try {
            const request = await this.salesWorksRepository.findOne({ where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode } });
            if (!request) {
                return new CommonResponse(false, 404, 'Request not found');
            }
            return new CommonResponse(true, 200, 'Request details fetched successfully', request);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async create(dto: SalesWorksDto, files: any): Promise<CommonResponse> {
        const entity = this.adapter.convertDtoToEntity(dto);
        console.log(dto, "?????")

        if (files?.visitingCard?.[0]) {
            entity.visitingCard = await this.uploadFile(files.visitingCard[0], `visiting_card__photos/${entity.staffId}.jpg`);
        }


        entity.visitingNumber = `#VI-${(await this.salesWorksRepository.count() + 1)
            .toString()
            .padStart(5, '0')}`;
        // Upload vehicle photo to GCS
        if (files?.clientPhoto?.[0]) {
            entity.clientPhoto = await this.uploadFile(files.clientPhoto[0], `client_photos/${entity.staffId}.jpg`);
        }

        // Fetch product names and remove duplicates
        if (Array.isArray(dto.requirementDetails)) {
            entity.requirementDetails = dto.requirementDetails.map(r => ({
                productName: r.productName,
                quantity: r.quantity
            }));
        }
        console.log(entity, ">>>>>>>>")
        await this.salesWorksRepository.insert(entity);
        //    await this.adapter.convertEntityToDto(savedEntity);

        return new CommonResponse(true, 65152, 'Staff Details and Letters created Successfully');
    }

    private async uploadFile(file: Express.Multer.File, fileName: string): Promise<string> {
        const bucket = this.storage.bucket(this.bucketName);
        const fileRef = bucket.file(fileName);

        await fileRef.save(file.buffer, {
            contentType: file.mimetype,
            resumable: false,
        });

        console.log(`File uploaded to GCS: ${fileName}`);
        return `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
    }

    async deleteFile(fileUrl: string): Promise<void> {
        try {
            const existingFilePath = fileUrl.replace(`https://storage.googleapis.com/${this.bucketName}/`, '');
            const file = this.storage.bucket(this.bucketName).file(existingFilePath);
            await file.delete();
            console.log(`Deleted old file from GCS: ${existingFilePath}`);
        } catch (error) {
            console.error(`Error deleting old file from GCS: ${error.message}`);
        }
    }

    async update(dto: SalesWorksDto, files: any): Promise<CommonResponse> {

        let existingStaff: SalesWorksEntity | null = null;
        const entity = await this.salesWorksRepository.findOne({ where: { id: dto.id } });
        if (!entity) {
            throw new Error('Sales Work not found');
        }

        const updatedStaff = this.adapter.convertDtoToEntity(dto);

        if (files?.visitingCard?.[0]) {
            if (existingStaff.visitingCard) {
                await this.deleteFile(existingStaff.visitingCard);
            }
            updatedStaff.visitingCard = await this.uploadFile(files.photo[0], `staff_photos/${existingStaff.staffId}.jpg`);
        }

        if (files?.clientPhoto?.[0]) {
            if (existingStaff.clientPhoto) {
                await this.deleteFile(existingStaff.clientPhoto);
            }
            updatedStaff.clientPhoto = await this.uploadFile(files.clientPhoto[0], `vehicle_photos/${existingStaff.staffId}.jpg`);
        }

        // Fetch product names and remove duplicates
        if (Array.isArray(dto.requirementDetails)) {
            entity.requirementDetails = dto.requirementDetails.map(r => ({
                productName: r.productName,
                quantity: r.quantity
            }));
        }
        updatedStaff.id = dto.id;
        await this.salesWorksRepository.save(updatedStaff);

        await this.adapter.convertEntityToDto(updatedStaff);

        return new CommonResponse(true, 65152, 'Staff Details and Permissions Created Successfully');
    }


    async delete(id: number): Promise<void> {
        await this.salesWorksRepository.delete(id);
    }
}
