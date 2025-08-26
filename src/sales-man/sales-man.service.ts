import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { SalesWorksEntity } from './entity/sales-man.entity';
import { RequirementDetailDto, SalesWorksDto, ServiceDto } from './dto/sales-man.dto';
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

    async getSalesSearchDetails(req: { companyCode: string; unitCode: string; staffId?: number; name?: string, branch?: string }) {
        const staffData = await this.salesWorksRepository.getSalesSearchDetails(req)
        if (!staffData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", staffData)
        }
    }


    async findAll(): Promise<CommonResponse> {
        const branch: SalesWorksEntity[] = await this.salesWorksRepository.find({relations: ['staffId','allocateStaffId'],
            order: {
                createdAt: 'DESC'  // <- this is what adds the descending sort
            }
        });

        // Convert each entity in the array to DTO
        const staffDtos = branch.map(entity => this.adapter.convertEntityToDto(entity));

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
        try {
            // Convert DTO to entity
            const entity = this.adapter.convertDtoToEntity(dto);

            // Set unique visiting number
            const count = await this.salesWorksRepository.count();
            entity.visitingNumber = `#VI-${(count + 1).toString().padStart(5, '0')}`;

            // Timestamp to avoid overwriting files
            const timestamp = Date.now();

            // Upload visiting card photo if available
            if (files?.visitingCard?.[0]) {
                entity.visitingCard = await this.uploadFile(
                    files.visitingCard[0],
                    `visiting_card_photos/vcp_${timestamp}.jpg`
                );
            }

            // Upload client photo if available
            if (files?.clientPhoto?.[0]) {
                entity.clientPhoto = await this.uploadFile(
                    files.clientPhoto[0],
                    `client_photos/cp_${timestamp}.jpg`
                );
            }

            // Parse requirementDetails

            if (typeof dto.requirementDetails === "string") {
                try {
                    dto.requirementDetails = JSON.parse(dto.requirementDetails);
                } catch (err) {
                    throw new Error("Invalid JSON in requirementDetails: " + err.message);
                }
            }

            // Ensure it's an array after parsing or direct assignment
            if (!Array.isArray(dto.requirementDetails)) {
                throw new Error("Invalid requirementDetails format. Expected an array.");
            }

            // Normalize each item (optional step: filter or sanitize data here)
            dto.requirementDetails = dto.requirementDetails.map((requirementDetail) => ({
                productName: requirementDetail.productName,
                quantity: requirementDetail.quantity,
            }));

            // Parse service array
            if (typeof dto.service === "string") {
                try {
                    dto.service = JSON.parse(dto.service);
                } catch (err) {
                    throw new Error("Invalid JSON in service: " + err.message);
                }
            }

            if (!Array.isArray(dto.service)) {
                throw new Error("Invalid services format. Expected an array.");
            }

            // Save the entity
            await this.salesWorksRepository.insert(entity);

            return new CommonResponse(true, 65152, 'Staff Details and Letters created Successfully');
        } catch (error) {
            console.error('Error in create():', error);
            throw new Error('Failed to create sales work entry: ' + error.message);
        }
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
        const existingStaff = await this.salesWorksRepository.findOne({ where: { id: dto.id } });
        const timestamp = Date.now();
        if (!existingStaff) {
            throw new Error('Sales Work not found');
        }

        const updatedStaff = this.adapter.convertDtoToEntity(dto);
        updatedStaff.id = dto.id; // Ensure ID is set

        // Handle visitingCard upload
        if (files?.visitingCard?.[0]) {
            if (existingStaff.visitingCard) {
                await this.deleteFile(existingStaff.visitingCard);
            }
            updatedStaff.visitingCard = await this.uploadFile(
                files.visitingCard[0],
                `visiting_card_photos/vcp_${timestamp}.jpg`
            );
        }

        // Handle clientPhoto upload
        if (files?.clientPhoto?.[0]) {
            if (existingStaff.clientPhoto) {
                await this.deleteFile(existingStaff.clientPhoto);
            }
            updatedStaff.clientPhoto = await this.uploadFile(
                files.clientPhoto[0],
                `client_photos/cp_${timestamp}.jpg`
            );
        }

        // Parse and normalize requirementDetails
        if (dto.requirementDetails) {
            try {
                if (typeof dto.requirementDetails === "string") {
                    dto.requirementDetails = JSON.parse(dto.requirementDetails);
                }
                if (!Array.isArray(dto.requirementDetails)) {
                    throw new Error("Invalid requirementDetails format");
                }

                updatedStaff.requirementDetails = dto.requirementDetails.map(r => ({
                    productName: r.productName,
                    quantity: r.quantity,
                }));
            } catch (err) {
                throw new Error("Invalid JSON in requirementDetails: " + err.message);
            }
        }

        // Parse and normalize service data
        if (dto.service) {
            try {
                if (typeof dto.service === "string") {
                    dto.service = JSON.parse(dto.service);
                }
                if (!Array.isArray(dto.service)) {
                    throw new Error("Invalid service format");
                }

                updatedStaff.service = dto.service;
            } catch (err) {
                throw new Error("Invalid JSON in service: " + err.message);
            }
        }

        // Save to DB
        const savedStaff = await this.salesWorksRepository.save(updatedStaff);

        // Make sure savedStaff is valid before converting
        if (!savedStaff || !savedStaff.id) {
            throw new Error("Failed to save updated staff");
        }

        await this.adapter.convertEntityToDto(savedStaff);

        return new CommonResponse(true, 65152, 'Staff Details and Permissions Updated Successfully');
    }


    async delete(id: number): Promise<void> {
        await this.salesWorksRepository.delete(id);
    }
}
