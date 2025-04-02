import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { BranchRepository } from 'src/branch/repo/branch.repo';
import { CommonReq } from 'src/models/common-req';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { ClientAdapter } from './client.adapter';
import { ClientIdDto } from './dto/client-id.dto';
import { ClientDto } from './dto/client.dto';
import { ClientRepository } from './repo/client.repo';
import { ClientEntity } from './entity/client.entity';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class ClientService {
    private storage: Storage;
    private bucketName: string;
    constructor(
        private readonly clientAdapter: ClientAdapter,
        private readonly clientRepository: ClientRepository,
        private readonly branchRepo: BranchRepository
    ) {
        this.storage = new Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });

        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }
    async handleClientDetails(dto: ClientDto, photo?: Express.Multer.File): Promise<CommonResponse> {
        try {
            let photoPath: string | null = null
            if (photo) {
                const bucket = this.storage.bucket(this.bucketName);
                const uniqueFileName = `client_photos/${Date.now()}-${photo.originalname}`;
                const file = bucket.file(uniqueFileName);

                await file.save(photo.buffer, {
                    contentType: photo.mimetype,
                    resumable: false,
                });

                console.log(`File uploaded to GCS: ${uniqueFileName}`);
                photoPath = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
            }

            // const existingStaff = await this.clientRepository.findOne({
            //     where: [{ id: dto.id }, { clientId: dto.clientId }],
            // });
            if (dto.id || (dto.clientId && dto.clientId.trim() !== '')) {
                console.log(dto, "updateClientDetails{{{{{{{{{{{{{")
                return await this.updateClientDetails(dto, photoPath);

            } else {
                console.log(dto, "createClientDetails{{{{{{{{{{{{{")
                // Create a new client
                return await this.createClientDetails(dto, photoPath);
            }
        } catch (error) {
            console.error(`Error handling client details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to handle client details: ${error.message}`);
        }
    }

    async createClientDetails(dto: ClientDto, photoPath: string | null): Promise<CommonResponse> {
        try {
            console.log(dto, "KKKKKKKKKKKKKK")
            const branchEntity = await this.branchRepo.findOne({ where: { id: dto.branch } });
            if (!branchEntity) {
                throw new Error('Branch not found');
            }
            const entity = this.clientAdapter.convertDtoToEntity(dto);
            entity.clientId = `CLI(${branchEntity.branchName})-${(await this.clientRepository.count() + 1).toString().padStart(5, '0')}`;

            if (photoPath) {
                entity.clientPhoto = photoPath;
            }


            const branch = new BranchEntity();
            branch.id = dto.branch;
            entity.branch = branch;
            console.log(entity, "entity")
            await this.clientRepository.insert(entity);

            return new CommonResponse(true, 201, 'Client details created successfully');
        } catch (error) {
            console.error(`Error creating client details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to create client details: ${error.message}`);
        }
    }

    async updateClientDetails(dto: ClientDto, photoPath: string | null): Promise<CommonResponse> {
        try {
            // Check for client by id or clientId
            let existingClient: ClientEntity | null = null;

            if (dto.id) {
                existingClient = await this.clientRepository.findOne({ where: { id: dto.id } });
            } else if (dto.clientId) {
                existingClient = await this.clientRepository.findOne({ where: { clientId: dto.clientId } });
            }

            if (!existingClient) {
                throw new Error('Client not found');
            }

            if (photoPath && existingClient.clientPhoto) {
                const existingFilePath = existingClient.clientPhoto.replace(`https://storage.googleapis.com/${this.bucketName}/`, '');
                const file = this.storage.bucket(this.bucketName).file(existingFilePath);

                try {
                    await file.delete();
                    console.log(`Deleted old file from GCS: ${existingFilePath}`);
                } catch (error) {
                    console.error(`Error deleting old file from GCS: ${error.message}`);
                }
            }
            const entity = this.clientAdapter.convertDtoToEntity(dto);

            if (dto.branch) {
                // Fetch branch by name to get the correct ID
                const branchEntity = await this.branchRepo.findOne({ where: { id: dto.branch } });

                if (!branchEntity) {
                    throw new Error(`Branch with name '${dto.branch}' not found`);
                }

                entity.branch = branchEntity; // Assign the entire entity, not just an invalid string
            }

            // Merge existing client details with new data
            const updatedClient = {
                ...existingClient,
                ...entity,
                clientPhoto: photoPath ?? existingClient.clientPhoto,
            };

            console.log('Updated client payload:', updatedClient); // Debugging step

            await this.clientRepository.save(updatedClient);


            return new CommonResponse(true, 200, 'Client details updated successfully');
        } catch (error) {
            console.error(`Error updating client details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to update client details: ${error.message}`);
        }
    }

    async deleteClientDetails(dto: ClientIdDto): Promise<CommonResponse> {
        try {
            // Find the client by client_id, companyCode, and unitCode
            const client = await this.clientRepository.findOne({
                where: {
                    clientId: String(dto.clientId), // Ensure clientId is treated as a string
                    companyCode: dto.companyCode,
                    unitCode: dto.unitCode
                }
            });

            if (!client) {
                return new CommonResponse(false, 404, 'Client not found');
            }

            // Now delete using clientId (not id)
            await this.clientRepository.delete({ clientId: String(dto.clientId) }); // Correct column is clientId

            return new CommonResponse(true, 200, 'Client details deleted successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }


    async getClientDetailsById(req: ClientIdDto): Promise<CommonResponse> {
        try {
            console.log(req, "+++++++++++")

            const client = await this.clientRepository.findOne({ relations: ['branch'], where: { clientId: req.clientId, companyCode: req.companyCode, unitCode: req.unitCode } });
            console.log(client, "+++++++++++")

            if (!client) {
                return new CommonResponse(false, 404, 'Client not found');
            }
            else {
                // const data = this.clientAdapter.convertEntityToDto([client])
                return new CommonResponse(true, 200, 'Client details fetched successfully', client);
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getClientDetails(req: CommonReq): Promise<CommonResponse> {
        try {
            const client = await this.clientRepository.find({ relations: ['branch', 'voucherId'], where: { companyCode: req.companyCode, unitCode: req.unitCode } });
            if (!client) {
                return new CommonResponse(false, 404, 'Client not found');
            }
            else {
                const data = this.clientAdapter.convertEntityToDto(client)
                return new CommonResponse(true, 200, 'Client details fetched successfully', data);
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getClientNamesDropDown(): Promise<CommonResponse> {
        const data = await this.clientRepository.find({ select: ['name', 'id', 'clientId'] });
        if (data.length) {
            return new CommonResponse(true, 75483, "Data Retrieved Successfully", data)
        } else {
            return new CommonResponse(false, 4579, "There Is No branch names")
        }
    }

    async updateIsStatus(req: ClientIdDto): Promise<CommonResponse> {
        // Fetch the current record
        const client = await this.clientRepository.findOne({ where: { id: req.id } });

        if (!client) {
            return new CommonResponse(false, 6541, "No Data Found");
        }

        // Prepare updated fields (only if they are changed)
        const updatedFields: Partial<ClientEntity> = {};

        if (req.hasOwnProperty('tds')) {
            updatedFields.tds = !client.tds;
        }
        if (req.hasOwnProperty('tcs')) {
            updatedFields.tcs = !client.tcs;
        }
        if (req.hasOwnProperty('billWiseDate')) {
            updatedFields.billWiseDate = !client.billWiseDate;
        }

        // Only update if there are changes
        if (Object.keys(updatedFields).length > 0) {
            await this.clientRepository.update({ id: req.id }, updatedFields);
        }

        return new CommonResponse(true, 65152, "Status updated successfully");
    }

    async getClientVerification(req: ClientDto): Promise<CommonResponse> {
        let data = null;

        if (req.phoneNumber) {
            data = await this.clientRepository.findOne({ where: { phoneNumber: req.phoneNumber } });
        } else if (req.email) {
            data = await this.clientRepository.findOne({ where: { email: req.email } });
        }

        if (data) {
            return new CommonResponse(true, 75483, "Data already exists");
        } else {
            return new CommonResponse(false, 4579, "No matching data found");
        }
    }

}
