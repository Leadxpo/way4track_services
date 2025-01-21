import { Injectable } from '@nestjs/common';
import { ClientRepository } from './repo/client.repo';
import { ClientDto } from './dto/client.dto';
import { ClientIdDto } from './dto/client-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { ClientAdapter } from './client.adapter';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { BranchRepository } from 'src/branch/repo/branch.repo';
import { join } from 'path';
import { writeFile } from 'fs';
import { promises as fs } from 'fs';
import { CommonReq } from 'src/models/common-req';

@Injectable()
export class ClientService {
    constructor(
        private readonly clientAdapter: ClientAdapter,
        private readonly clientRepository: ClientRepository,
        private readonly branchRepo: BranchRepository
    ) { }
    async handleClientDetails(dto: ClientDto, file?: Express.Multer.File): Promise<CommonResponse> {
        try {
            let photoPath: string | null = null;

            // Handle photo upload
            if (file) {
                photoPath = await this.uploadClientPhoto(file);
            }

            if (dto.id) {
                // If ID exists, validate it before updating
                const existingClient = await this.clientRepository.findOne({ where: { id: dto.id } });
                if (!existingClient) {
                    throw new ErrorResponse(404, `Client with ID ${dto.id} not found`);
                }
                return await this.updateClientDetails(dto, photoPath);
            } else {
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
            const branchEntity = await this.branchRepo.findOne({ where: { id: dto.branchId } });
            if (!branchEntity) {
                throw new Error('Branch not found');
            }
            const entity = this.clientAdapter.convertDtoToEntity(dto);
            entity.clientId = `CLI(${branchEntity.branchName})-${(await this.clientRepository.count() + 1).toString().padStart(5, '0')}`;

            if (photoPath) {
                entity.clientPhoto = photoPath;
            }


            const branch = new BranchEntity();
            branch.id = dto.branchId;
            entity.branch = branch;

            await this.clientRepository.insert(entity);

            return new CommonResponse(true, 201, 'Client details created successfully');
        } catch (error) {
            console.error(`Error creating client details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to create client details: ${error.message}`);
        }
    }

    async updateClientDetails(dto: ClientDto, photoPath: string | null): Promise<CommonResponse> {
        try {
            const existingClient = await this.clientRepository.findOne({ where: { id: dto.id } });
            if (!existingClient) {
                throw new Error('Client not found');
            }

            const entity = this.clientAdapter.convertDtoToEntity(dto);

            // Merge existing client details with new data
            const updatedClient = {
                ...existingClient,
                ...entity,
                clientPhoto: photoPath || existingClient.clientPhoto,
            };

            await this.clientRepository.save(updatedClient);

            return new CommonResponse(true, 200, 'Client details updated successfully');
        } catch (error) {
            console.error(`Error updating client details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to update client details: ${error.message}`);
        }
    }

    async uploadClientPhoto(photo: Express.Multer.File): Promise<string> {
        try {
            const filePath = join(__dirname, '../../uploads/client_photos', `${Date.now()}.jpg`);
            await fs.writeFile(filePath, photo.buffer);
            return filePath;
        } catch (error) {
            console.error(`Error uploading client photo: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to upload client photo: ${error.message}`);
        }
    }

    async deleteClientDetails(dto: ClientIdDto): Promise<CommonResponse> {
        try {
            const client = await this.clientRepository.findOne({ where: { clientId: dto.clientId, companyCode: dto.companyCode, unitCode: dto.unitCode } });
            if (!client) {
                return new CommonResponse(false, 404, 'Client not found');
            }
            await this.clientRepository.delete(dto.clientId);
            return new CommonResponse(true, 200, 'Client details deleted successfully');
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getClientDetailsById(req: ClientIdDto): Promise<CommonResponse> {
        try {
            const client = await this.clientRepository.findOne({ relations: ['branch'], where: { clientId: req.clientId, companyCode: req.companyCode, unitCode: req.unitCode } });
            if (!client) {
                return new CommonResponse(false, 404, 'Client not found');
            }
            else {
                const data = this.clientAdapter.convertEntityToDto([client])
                return new CommonResponse(true, 200, 'Client details fetched successfully', data);
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

}
